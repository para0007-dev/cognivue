from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Q
from .models import FoodItem, NutritionTip, MealPlan
from .serializers import FoodItemSerializer, NutritionTipSerializer, MealPlanSerializer

class FoodItemListView(generics.ListAPIView):
    serializer_class = FoodItemSerializer
    def get_queryset(self):
        qs = FoodItem.objects.all()
        q = self.request.query_params.get("q")
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(category__icontains=q))
        if self.request.query_params.get("vegetarian") == "true":
            qs = qs.filter(is_vegetarian=True)
        if self.request.query_params.get("lactose_free") == "true":
            qs = qs.filter(is_lactose_free=True)
        if self.request.query_params.get("nut_free") == "true":
            qs = qs.filter(is_nut_free=True)
        return qs.order_by("name")

class NutritionTipListView(generics.ListAPIView):
    serializer_class = NutritionTipSerializer
    queryset = NutritionTip.objects.prefetch_related("related_foods").all()

class MealPlanListView(generics.ListAPIView):
    serializer_class = MealPlanSerializer
    def get_queryset(self):
        # Must return 21 rows with nested food
        return MealPlan.objects.select_related("food").all()
        # If you want a deterministic order, rely on the frontend’s dayOrder,
        # or add a Case/When here to order Monday..Sunday.

@api_view(["POST"])
def swap_meal(request):
    day = request.data.get("day")
    meal_type = request.data.get("meal_type")
    new_food_id = request.data.get("new_food_id")
    try:
        meal = MealPlan.objects.get(day=day, meal_type=meal_type)
    except MealPlan.DoesNotExist:
        return Response({"error": "Meal not found"}, status=404)
    meal.food_id = new_food_id
    meal.save()
    return Response({"message": "ok", "meal": MealPlanSerializer(meal).data})
