import os, json
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

from django.conf import settings
import google.generativeai as genai

# --- tiny guards (keeps your AC true even if model slips) ---
def _coerce_f(x, d=0.0): 
    try: return float(x)
    except: return float(d)

def _enforce(items, prefs):
    dietary = set(prefs.get("dietary", []))
    max_prep = int(prefs.get("max_prep_minutes", 60))
    scope    = prefs.get("budget_scope","weekly")
    days     = int(prefs.get("days",1))
    budget   = _coerce_f(prefs.get("budget_aud",0.0))
    budget_total = budget if scope=="weekly" else budget*days

    cleaned, cost, has_snack, has_meal = [], 0.0, False, False
    for it in items:
        tags = set(it.get("tags",[]))
        if not dietary.issubset(tags): continue
        prep = int(_coerce_f(it.get("prep_minutes"), 999))
        if prep > max_prep: continue
        kind = (it.get("kind") or "meal").lower()
        if kind not in ("meal","snack"): kind = "meal"
        vitd_mcg = _coerce_f(it.get("vitd_mcg"), 0)
        vitd_iu  = int(_coerce_f(it.get("vitd_iu"), vitd_mcg*40))
        cost_aud = round(_coerce_f(it.get("cost_aud"), 0), 2)
        ingredients = it.get("ingredients") or []
        recipe_steps = it.get("recipe_steps") or []

        cleaned.append({
          "name": (it.get("name") or "").strip(),
          "kind": kind,
          "cost_aud": cost_aud,
          "prep_minutes": prep,
          "vitd_mcg": round(vitd_mcg,1),
          "vitd_iu": vitd_iu,
          "tags": list(tags),
          "ingredients": [str(x) for x in ingredients][:20],
          "recipe_steps": [str(x) for x in recipe_steps][:12],
        })
        has_snack |= kind=="snack"; has_meal |= kind=="meal"; cost += cost_aud

    # ensure ≥1 snack & ≥1 meal
    if cleaned and not has_snack: cleaned[0]["kind"]="snack"; has_snack=True
    if len(cleaned)>1 and not has_meal: cleaned[1]["kind"]="meal"; has_meal=True

    # pad to exactly 3 if needed
    FALLBACKS = [
      {"name":"Fortified oat milk (250ml)","kind":"snack","cost_aud":1.2,"prep_minutes":1,"vitd_mcg":3.0,"vitd_iu":120,"tags":["vegan","lactose-free","nut-free"]},
      {"name":"Eggs on toast","kind":"meal","cost_aud":2.1,"prep_minutes":10,"vitd_mcg":2.0,"vitd_iu":80,"tags":["nut-free"]},
      {"name":"Canned tuna on crackers","kind":"snack","cost_aud":2.2,"prep_minutes":3,"vitd_mcg":2.0,"vitd_iu":80,"tags":["nut-free"]},
    ]
    while len(cleaned) < 3 and FALLBACKS:
        cleaned.append(FALLBACKS.pop(0))

    return cleaned[:3], {
        "total_cost_aud": round(cost,2),
        "budget_limit_aud": round(budget_total,2),
        "within_budget": (cost <= budget_total) if budget_total>0 else True,
        "has_snack": has_snack, "has_meal": has_meal,
    }

# --- Gemini call ---
def _extract_json_from_gemini(resp):
    # Prefer .text when response_mime_type is JSON; else stitch parts
    data = getattr(resp, "text", None)
    if not data:
        parts = []
        for cand in getattr(resp, "candidates", []) or []:
            content = getattr(cand, "content", None)
            for p in (getattr(content, "parts", []) or []):
                t = getattr(p, "text", None)
                if t: parts.append(t)
        data = "".join(parts)
    if not data:
        raise ValueError("Empty response from Gemini")
    try:
        return json.loads(data)
    except Exception as e:
        raise ValueError(f"Gemini returned non-JSON: {data[:300]} ... ({e})")

@csrf_exempt
@require_POST
def generate_ai_plan(request):
    if not settings.GEMINI_API_KEY:
        return JsonResponse({"success": False, "error": "Missing GEMINI_API_KEY"}, status=500)

    prefs = json.loads(request.body or "{}")

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(
            model_name=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            system_instruction=(
                "You are a diet assistant for middle-aged Australians. "
                "Suggest vitamin-D rich foods available in AU supermarkets. "
                "Respect dietary restrictions. Use AUD prices and give realistic prep times."
                "Avoid gimmicky foods with adjectives like 'Vitamin-D fortified', 'UV-enriched' and the like."
            ),
            generation_config={
                "response_mime_type": "application/json",
                "response_schema": {
                    "type": "object",
                    "properties": {
                        "items": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "kind": {"type": "string", "enum": ["meal", "snack"]},
                                    "cost_aud": {"type": "number"},
                                    "prep_minutes": {"type": "integer"},
                                    "vitd_mcg": {"type": "number"},
                                    "vitd_iu": {"type": "integer"},
                                    "tags": {"type": "array", "items": {"type": "string"}},
                                    "ingredients": {"type":"array","items":{"type":"string"}},
                                    "recipe_steps": {"type":"array","items":{"type":"string"}}
                                },
                                "required": ["name","kind","cost_aud","prep_minutes","vitd_mcg","vitd_iu","tags","ingredients","recipe_steps"],
                            },
                        }
                    },
                    "required": ["items"],
                },
            },
        )

        prompt = {
            "task": "Generate exactly 3 options with at least one snack and one full meal.",
            "preferences": prefs,
            "rules": [
                "All items must satisfy every dietary tag in preferences.dietary.",
                "Include cost_aud (AUD), prep_minutes, vitd_mcg and vitd_iu (1 µg = 40 IU).",
                "Label each item with kind: 'meal' or 'snack'.",
                "Provide an itemised ingredients list and short step-by-step recipe.",
                "Return ONLY JSON matching the response schema."
            ],
        }

        resp = model.generate_content(
            [json.dumps(prompt)],
            request_options={"timeout": 30},
        )
        parsed = _extract_json_from_gemini(resp)
        items = parsed.get("items", [])
    except Exception as e:
        # Surface a clear message instead of generic 502
        return JsonResponse({"success": False, "error": f"Gemini call failed: {e}"}, status=502)

    cleaned, summary = _enforce(items, prefs)
    return JsonResponse({"success": True, "items": cleaned, "summary": summary, "preferences": prefs})