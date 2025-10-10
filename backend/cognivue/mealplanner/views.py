# mealplanner/views.py
import os, json, requests, hashlib, re
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
from django.conf import settings
from groq import Groq

GROQ_BASE = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")

# --------- helpers ---------
def _coerce_f(x, d=0.0):
    """Best-effort float coercion with default."""
    try:
        return float(x)
    except Exception:
        return float(d)

def _split_recipe_to_steps(recipe):
    """Accept 'recipe' string and convert to recipe_steps[]."""
    if not recipe:
        return []
    parts = [s.strip(" .\n") for s in re.split(r"\s*\d+\.\s*", str(recipe)) if s.strip()]
    return parts or [str(recipe)]

def _ingredients_to_strings(raw):
    """
    Accepts either:
      - ["1 cup oats", "250 ml milk"]  OR
      - [{"name":"oats","quantity":"1","unit":"cup"}, ...]
    Returns list[str] like "1 cup oats".
    """
    out = []
    if not raw:
        return out
    for x in raw:
        if isinstance(x, dict):
            name = str(x.get("name", "")).strip()
            qty  = str(x.get("quantity", "")).strip()
            unit = str(x.get("unit", "")).strip()
            s = " ".join(p for p in [qty, unit, name] if p)
            out.append(s or name)
        else:
            out.append(str(x).strip())
    return out

def _enforce(items, prefs):
    """
    Validate / normalise model output and enforce constraints:
    - respect max prep time
    - ensure at least one snack and one meal
    - cap to exactly 3 items and compute budget summary
    NOTE: dietary restrictions are NOT enforced.
    """
    max_prep = int(prefs.get("max_prep_minutes", 60))
    budget_total = _coerce_f(prefs.get("budgetAud", 0.0))

    cleaned, cost, has_snack, has_meal = [], 0.0, False, False
    for it in items or []:
        tags = set(str(x).strip().lower() for x in (it.get("tags") or []))

        prep = int(_coerce_f(it.get("prep_minutes"), 999))
        if prep > max_prep:
            continue

        kind = (it.get("kind") or "meal").strip().lower()
        if kind not in ("meal", "snack"):
            kind = "meal"

        vitd_mcg = _coerce_f(it.get("vitd_mcg"), 0)
        vitd_iu = int(_coerce_f(it.get("vitd_iu"), vitd_mcg * 40))
        cost_aud = round(_coerce_f(it.get("cost_aud"), 0), 2)

        # Accept 'recipe_steps' or a single 'recipe' string
        recipe_steps = it.get("recipe_steps")
        if not recipe_steps and it.get("recipe"):
            recipe_steps = _split_recipe_to_steps(it.get("recipe"))

        # Ensure ingredients are strings for display
        ingredients = _ingredients_to_strings(it.get("ingredients"))[:20]
        recipe_steps = [str(x) for x in (recipe_steps or [])][:12]

        # Ensure name exists
        name = (it.get("name") or "").strip() or (ingredients[0].split(",")[0].title() if ingredients else "Suggested Option")

        cleaned.append(
            {
                "name": name,
                "kind": kind,
                "cost_aud": cost_aud,
                "prep_minutes": prep,
                "vitd_mcg": round(vitd_mcg, 1),
                "vitd_iu": vitd_iu,
                "tags": list(tags),
                "ingredients": ingredients,
                "recipe_steps": recipe_steps,
            }
        )

        has_snack |= kind == "snack"
        has_meal |= kind == "meal"
        cost += cost_aud

    # ensure ≥1 snack & ≥1 meal where possible
    if cleaned and not has_snack:
        cleaned[0]["kind"] = "snack"
        has_snack = True
    if len(cleaned) > 1 and not has_meal:
        cleaned[1]["kind"] = "meal"
        has_meal = True

    # pad to exactly 3 if needed (simple, safe defaults)
    FALLBACKS = [
        {
            "name": "Fortified oat milk (250ml)",
            "kind": "snack",
            "cost_aud": 1.2,
            "prep_minutes": 1,
            "vitd_mcg": 3.0,
            "vitd_iu": 120,
            "tags": ["vegan", "lactose-free", "nut-free"],
            "ingredients": ["250ml fortified oat milk"],
            "recipe_steps": ["Serve chilled."],
        },
        {
            "name": "Eggs on toast",
            "kind": "meal",
            "cost_aud": 2.1,
            "prep_minutes": 10,
            "vitd_mcg": 2.0,
            "vitd_iu": 80,
            "tags": ["nut-free"],
            "ingredients": ["2 eggs", "2 slices wholegrain bread", "salt", "pepper"],
            "recipe_steps": ["Toast bread.", "Pan-fry eggs to preference.", "Season and serve."],
        },
        {
            "name": "Canned tuna on crackers",
            "kind": "snack",
            "cost_aud": 2.2,
            "prep_minutes": 3,
            "vitd_mcg": 2.0,
            "vitd_iu": 80,
            "tags": ["nut-free"],
            "ingredients": ["Tuna in springwater", "Wholegrain crackers", "Lemon wedge"],
            "recipe_steps": ["Drain tuna.", "Top crackers with tuna.", "Finish with lemon."],
        },
    ]
    while len(cleaned) < 3 and FALLBACKS:
        cleaned.append(FALLBACKS.pop(0))

    summary = {
        "total_cost_aud": round(cost, 2),
        "budget_limit_aud": round(budget_total, 2),
        "within_budget": (cost <= budget_total) if budget_total > 0 else True,
        "has_snack": has_snack,
        "has_meal": has_meal,
    }
    return cleaned[:3], summary

# --------- AI endpoint (Groq: Llama-3.x) ---------
def __groq_client():
    return Groq(
        api_key=os.getenv("GROQ_API_KEY", ""),
        base_url=GROQ_BASE,            # prevent wrong default
        timeout=20,                    # fail fast
    )

@csrf_exempt
@require_POST
def generate_ai_plan(request):
    if not getattr(settings, "GROQ_API_KEY", ""):
        return JsonResponse({"success": False, "error": "GROQ_API_KEY not configured"}, status=500)

    prefs = json.loads(request.body or "{}")
    budget = prefs.get("budgetAud")
    max_prep = prefs.get("max_prep_minutes")
    dietary_raw = prefs.get("dietary") or prefs.get("dietary_restrictions") or []
    dietary = sorted({str(x).strip().lower() for x in dietary_raw if str(x).strip()})

    # Strong instruction with inline schema (plain JSON)
    system_msg = (
        "You are a diet assistant for middle-aged Australians. Your goal is to design recipes rich in vitamin D. "
        "Only suggest realistic AU-supermarket recipes. Use realistic AUD costs and realistic prep times. "
        "Output STRICT JSON only (no extra text). The JSON MUST match this shape:\n"
        "{\n"
        '  "items": [\n'
        "    {\n"
        '      "name": string,\n'
        '      "kind": "meal" | "snack",\n'
        '      "cost_aud": number,\n'
        '      "prep_minutes": integer,\n'
        '      "vitd_mcg": number,\n'
        '      "vitd_iu": integer,\n'
        '      "tags": string[],\n'
        '      "ingredients": [{"name": string, "quantity": string, "unit": string}],\n'
        '      "recipe_steps": string[]\n'
        "    }\n"
        "  ]\n"
        "}\n"
        "Return exactly 3 items."
    )

    user_prompt = {
        "task": "Generate exactly 3 items for one day: include at least 1 snack and 1 full meal.",
        "preferences": {
            "budgetAud": budget,
            "max_prep_minutes": max_prep,
            "budget_scope": "daily",
            "days": 1,
            "dietary": dietary,
        },
        "rules": [
            "If preferences.dietary is non-empty, every item MUST comply with ALL listed restrictions.",
            "Do not include violating ingredients (e.g., meat/fish for vegetarian, any animal products for vegan, dairy for lactose-free, gluten for gluten-free, nuts for nut-free, high-sodium items for low-sodium).",
            "Ensure that the recipes are rich in vitamin D.",
            "Provide vitamin D in both µg and IU (1 µg = 40 IU).",
            "Ingredients must be objects with name, quantity, unit (unit may be empty string if not applicable).",
            "Return ONLY JSON matching the shape above. No prose.",
            "Try to be reasonable with your recipes - if it's a meal it should be satiating.",
            "Don't come up with gimmicky ingredients or meal options like 'fortified milk' or 'vitamin D treated mushrooms'. Keep it simple.",
            "Include meaningful tags for each item, and copy the user dietary tags into tags as well."
            "Don't hallucinate costs. If you are given 60 AUD to work with the cost of all meals don't strictly have to add up to 60 AUD.",
        ],
    }

    try:
        client = __groq_client()
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": json.dumps(user_prompt)},
            ],
            response_format={"type": "json_object"},
            temperature=0.4,
            max_tokens=5000,
        )
        content = resp.choices[0].message.content or "{}"
        try:
            parsed = json.loads(content)
        except Exception:
            s = content
            start = s.find("{"); end = s.rfind("}")
            parsed = json.loads(s[start:end+1]) if start >= 0 and end > start else {}
        items = (parsed or {}).get("items", [])
    except Exception as e:
        return JsonResponse({"success": False, "error": f"Groq call failed: {e}"}, status=502)
    print(items)
    cleaned_input = []
    for it in items or []:
        # normalise ingredients to strings so UI renders cleanly
        it["ingredients"] = _ingredients_to_strings(it.get("ingredients"))
        # accept items that have at least some structure
        if len(it["ingredients"]) < 1:
            continue
        if len(it.get("recipe_steps") or []) < 1 and it.get("recipe"):
            it["recipe_steps"] = _split_recipe_to_steps(it.get("recipe"))
        cleaned_input.append(it)
    print(cleaned_input)
    items2, summary = _enforce(cleaned_input, {
        "max_prep_minutes": max_prep,
        "budgetAud": budget,
    })
    return JsonResponse({"success": True, "items": items2, "summary": summary, "preferences": prefs})

@require_GET
def groq_ping(request):
    try:
        # Raw HTTP
        r = requests.get(
            f"{GROQ_BASE}/models",
            headers={"Authorization": f"Bearer {os.getenv('GROQ_API_KEY','')}",
                     "Accept": "application/json"},
            timeout=15,
        )
        raw_status = r.status_code
        raw_body = r.text[:500]

        # SDK
        client = __groq_client()
        models = client.models.list()
        names = [m.id for m in models.data][:8]

        return JsonResponse({
            "ok": True,
            "raw_status": raw_status,
            "raw_sample": raw_body,
            "sdk_models": names,
            "base_url": GROQ_BASE,
        })
    except Exception as e:
        return JsonResponse({
            "ok": False,
            "error": f"Error code: {getattr(e, 'status', 'n/a')} - {str(e)}",
            "has_key": bool(os.getenv("GROQ_API_KEY","")),
            "base_url": GROQ_BASE,
        }, status=502)


# --------- Photo search (Pexels) ---------
@require_GET
def photo_search(request):
    """
    GET /mealplanner/api/photo/?q=<dish>&diet=vegan,gluten-free
    Returns: {"url": <image_or_null>}
    """
    q = (request.GET.get("q") or "").strip()
    diet = (request.GET.get("diet") or "").lower()  # e.g. "vegan,gluten-free"
    api_key = getattr(settings, "PEXELS_API_KEY", "")

    if not q or not api_key:
        return JsonResponse({"url": None})

    q_full = " ".join([q] + [d.strip() for d in diet.split(",") if d.strip()])
    cache_key = "pexels:" + hashlib.sha1(q_full.encode("utf-8")).hexdigest()

    if (cached := cache.get(cache_key)):
        return JsonResponse({"url": cached})

    try:
        resp = requests.get(
            "https://api.pexels.com/v1/search",
            params={"query": q_full, "per_page": 1, "orientation": "landscape"},
            headers={"Authorization": api_key},
            timeout=8,
        )
        resp.raise_for_status()
        photos = resp.json().get("photos", []) or []
        url = photos[0]["src"].get("large") if photos else None
        cache.set(cache_key, url, 60 * 60 * 24 * 30)  # 30 days
        return JsonResponse({"url": url})
    except Exception:
        return JsonResponse({"url": None})
