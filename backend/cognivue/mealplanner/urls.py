from django.urls import path
from .views import generate_ai_plan

urlpatterns = [
    path("api/meal-plan/ai-generate/", generate_ai_plan, name="ai_meal_plan"),
]