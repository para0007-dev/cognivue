# mealplanner/views.py
import os, json, requests, hashlib, re
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
from django.conf import settings


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
    # split on occurrences like "1. step ..." "2. step ..."
    parts = [s.strip(" .\n") for s in re.split(r"\s*\d+\.\s*", str(recipe)) if s.strip()]
    return parts or [str(recipe)]

def _extract_items_from_worker(payload):
    """
    Pull items[] whether the Worker returned:
      A) already-parsed JSON with top-level 'items', or
      B) raw GLM: candidates -> content.parts[].text containing a JSON string.
    """
    # A) direct dict with items
    if isinstance(payload, dict) and "items" in payload:
        return payload.get("items") or []

    # A') sometimes wrapped under 'output'
    if isinstance(payload, dict) and "output" in payload and isinstance(payload["output"], dict):
        out = payload["output"]
        if "items" in out:
            return out.get("items") or []

    # B) GLM structure
    try:
        for c in (payload or {}).get("candidates", []) or []:
            for p in (c.get("content") or {}).get("parts", []) or []:
                t = p.get("text")
                if t:
                    doc = json.loads(t)
                    if isinstance(doc, dict) and "items" in doc:
                        return doc.get("items") or []
    except Exception:
        pass
    return []


def _enforce(items, prefs):
    """
    Validate / normalise model output and enforce constraints:
    - honor dietary tags (only if tags are present)
    - respect max prep time
    - ensure at least one snack and one meal
    - cap to exactly 3 items and compute budget summary
    """
    # accept either "dietary" or "dietary_restrictions" from the client
    dietary_raw = (
        prefs.get("dietary")
        or prefs.get("dietary_restrictions")
        or []
    )
    dietary = set(str(t).strip().lower() for t in dietary_raw if str(t).strip())

    max_prep = int(prefs.get("max_prep_minutes", 60))
    budget_total = _coerce_f(prefs.get("budgetAud", 0.0))

    cleaned, cost, has_snack, has_meal = [], 0.0, False, False
    for it in items or []:
        tags = set(str(x).strip().lower() for x in (it.get("tags") or []))

        # Only enforce dietary inclusion if model actually supplied tags
        if dietary and tags and not dietary.issubset(tags):
            continue

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

        ingredients = [str(x) for x in (it.get("ingredients") or [])][:20]
        recipe_steps = [str(x) for x in (recipe_steps or [])][:12]

        # Ensure name exists; derive from first ingredient if missing
        name = (it.get("name") or "").strip()
        if not name:
            if ingredients:
                name = str(ingredients[0]).split(",")[0].strip().title()
            else:
                name = "Suggested Option"

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


# --------- AI endpoint (via Cloudflare Worker proxy) ---------
@csrf_exempt
@require_POST
def generate_ai_plan(request):
    """
    Generates a 1-day plan (3 items: ≥1 snack, ≥1 meal) using your Cloudflare Worker
    as the Gemini proxy. Expects JSON body with:
      - budgetAud (number)
      - max_prep_minutes (int)
      - dietary OR dietary_restrictions (array[str])
    """
    proxy_url = getattr(settings, "GEMINI_PROXY_URL", "").strip()
    if not proxy_url:
        return JsonResponse({"success": False, "error": "GEMINI_PROXY_URL not configured"}, status=500)

    prefs = json.loads(request.body or "{}")

    prompt = {
        "task": "Generate exactly 3 options with at least one snack and one full meal.",
        "preferences": prefs,
        "rules": [
            "All items must satisfy every dietary tag in preferences.dietary or preferences.dietary_restrictions.",
            "Each item MUST include: name, kind ('meal'|'snack'), cost_aud, prep_minutes, vitd_mcg, vitd_iu, tags[], ingredients[], recipe_steps[].",
            "Include cost_aud (AUD), prep_minutes, vitd_mcg and vitd_iu (1 µg = 40 IU).",
            "Label each item with kind: 'meal' or 'snack'.",
            "Provide an itemised ingredients list and short step-by-step recipe.",
            "Return ONLY JSON with top-level key 'items'.",
            "Don't use gimmicky ingredients or titles like 'UV treated mushrooms' or 'Fortified oats', just keep it simple food ingredients",
        ],
        "region": "AU supermarkets; realistic prices and prep times.",
    }

    # Generative Language–style body; Worker returns JSON (or GLM payload)
    body = {
        "contents": [{"parts": [{"text": json.dumps(prompt)}]}],
        "generationConfig": {"responseMimeType": "application/json"},
    }

    try:
        r = requests.post(
            proxy_url,
            json=body,
            headers={"content-type": "application/json"},
            timeout=60,
        )
        if r.status_code != 200:
            return JsonResponse(
                {"success": False, "error": f"Proxy {r.status_code}: {r.text[:400]}"},
                status=502,
            )

        try:
            parsed = r.json()
        except Exception:
            parsed = json.loads(r.text)

        print(parsed)

        # Robustly extract items from either GLM payload or direct JSON
        raw_items = _extract_items_from_worker(parsed)

        # Normalise fields the model may omit / rename
        items = []
        for idx, it in enumerate(raw_items or []):
            if not isinstance(it, dict):
                continue
            name = (it.get("name") or "").strip()
            if not name:
                ings = it.get("ingredients") or []
                guess = (ings[0] if ings else f"Option {idx+1}")
                name = str(guess).split(",")[0].strip().title()

            recipe_steps = it.get("recipe_steps")
            if not recipe_steps and it.get("recipe"):
                recipe_steps = _split_recipe_to_steps(it.get("recipe"))

            items.append({
                "name": name,
                "kind": (it.get("kind") or "meal").lower(),
                "cost_aud": it.get("cost_aud"),
                "prep_minutes": it.get("prep_minutes"),
                "vitd_mcg": it.get("vitd_mcg"),
                "vitd_iu": it.get("vitd_iu"),
                "tags": it.get("tags") or [],
                "ingredients": it.get("ingredients") or [],
                "recipe_steps": recipe_steps or [],
            })

        if not items and getattr(settings, "DEBUG", False):
            print("Gemini payload (truncated):", str(parsed)[:800])

    except Exception as e:
        return JsonResponse({"success": False, "error": f"Gemini call failed: {e}"}, status=502)

    cleaned, summary = _enforce(items, prefs)
    return JsonResponse({"success": True, "items": cleaned, "summary": summary, "preferences": prefs})


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

    # Memcached-safe cache key
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
