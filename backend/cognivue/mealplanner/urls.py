from django.urls import path
from .views import generate_ai_plan, photo_search

urlpatterns = [
    path("api/meal-plan/ai-generate/", generate_ai_plan, name="ai_meal_plan"),
    path("api/photo/", photo_search, name="meal_photo"),
]