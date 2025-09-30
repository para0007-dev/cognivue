# simpleauth/urls.py
from django.urls import path
from .views import login_view, logout_view, api_login, api_logout

urlpatterns = [
    # (optional) backend HTML login/logout:
    path("", login_view, name="login"),
    path("logout/", logout_view, name="logout"),

    # API used by Vue:
    path("api/login/", api_login, name="api_login"),
    path("api/logout/", api_logout, name="api_logout"),
]
