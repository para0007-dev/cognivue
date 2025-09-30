from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

USERNAME = "admin"
PASSWORD = "brainhealth123"

# HTML login/logout (optional)
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

    try:
        data = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Bad JSON"}, status=400)

    if data.get("username") == USERNAME and data.get("password") == PASSWORD:
        request.session["logged_in"] = True
        return JsonResponse({"success": True})
    return JsonResponse({"success": False, "error": "Invalid credentials"}, status=401)

@csrf_exempt
def api_logout(request):
    request.session.flush()
    return JsonResponse({"success": True})
