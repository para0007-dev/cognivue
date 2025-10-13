from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

USERNAME = "admin"
PASSWORD = "sinepgib"

# HTML login/logout (optional)dsadas
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        if username == USERNAME and password == PASSWORD:
            request.session["logged_in"] = True
            return redirect("/news/")  # or any page
        return render(request, "login.html", {"error": "Invalid username or password"})
    return render(request, "login.html")

def logout_view(request):
    request.session.flush()
    return redirect("/login/")

# API login/logout (for Vue frontend)
@csrf_exempt
def api_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
 
    # --- robust body parsing: JSON first, fall back to form/urlencoded ---
    data = {}
    try:
        # If Content-Type is JSON or body looks like JSON
        raw = request.body or b""
        if raw:
            try:
                data = json.loads(raw.decode("utf-8"))
            except Exception:
                # Not valid JSON; fall back to form data
                data = request.POST.dict()
        else:
            data = request.POST.dict()
    except Exception:
        # Final fallback
        data = request.POST.dict()
 
    username = data.get("username")
    password = data.get("password")
 
    if username == USERNAME and password == PASSWORD:
        request.session["logged_in"] = True
        return JsonResponse({"success": True})
 
    return JsonResponse({"success": False, "error": "Invalid credentials"}, status=401)

@csrf_exempt
def api_logout(request):
    request.session.flush()
    return JsonResponse({"success": True})
