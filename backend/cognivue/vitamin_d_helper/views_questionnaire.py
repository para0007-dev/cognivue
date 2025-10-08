from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import QuestionnaireResponse
from .serializers import QuestionnaireResponseSerializer
from vitamin_d_helper.views import get_weather_data_by_city  # ✅ safer import path
import math

class QuestionnaireAPIView(APIView):
    """
    Handles questionnaire submissions from the Vue frontend.
    Accepts user answers + optional user_uuid for device tracking.
    """

    def post(self, request):
        data = request.data
        city = data.get("location") or "Melbourne"
        user_uuid = data.get("user_uuid")  # ✅ include from frontend

        # --- Fetch weather / UV index ---
        try:
            weather = get_weather_data_by_city(city)
            uv_index = weather.get("uv_index", 5)
        except Exception as e:
            print(f"Weather lookup failed: {e}")
            uv_index = 5

        # --- Calculate risk and weekly plan ---
        score = self.calculate_risk_score(data)
        result = "Inadequate" if score >= 35 else "Adequate"
        weekly_plan = self.generate_weekly_plan(data, uv_index, result)

        # --- Save response to DB ---
        entry = QuestionnaireResponse.objects.create(
            user=request.user if request.user.is_authenticated else None,
            user_uuid=user_uuid,  # ✅ store device ID if available
            outdoor_time=data.get("outdoorTime", ""),
            work_pattern=data.get("workPattern", ""),
            skin_type=data.get("skinType", ""),
            location=city,
            clothing_coverage=data.get("clothingCoverage", ""),
            vitamin_d_supplement=data.get("vitaminDSupplement", ""),
            vitamin_d_foods=data.get("vitaminDFoods", ""),
            risk_score=score,
            result=result,
            uv_index=uv_index,
            weekly_plan=weekly_plan,
        )

        serializer = QuestionnaireResponseSerializer(entry)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # --- Helper functions ---

    def calculate_risk_score(self, a):
        """Calculate vitamin D deficiency risk score based on user inputs."""
        score = 0
        # Outdoor time
        if a.get("outdoorTime") == ">30min": score += 0
        elif a.get("outdoorTime") == "10-29min": score += 8
        elif a.get("outdoorTime") == "<10min": score += 14
        # Work pattern
        if a.get("workPattern") == "outdoor": score += 0
        elif a.get("workPattern") == "mixed": score += 2
        elif a.get("workPattern") == "indoor": score += 6
        # Skin type
        if a.get("skinType") == "I-II": score += 0
        elif a.get("skinType") == "III-IV": score += 8
        elif a.get("skinType") == "V-VI": score += 15
        # Location
        if a.get("location") == "QLD-NT-year-round": score += 0
        elif a.get("location") == "NSW-WA-autumn-winter": score += 6
        elif a.get("location") == "VIC-TAS-ACT-autumn-winter": score += 15
        # Clothing
        if a.get("clothingCoverage") == "arms-legs-exposed": score += 0
        elif a.get("clothingCoverage") == "one-area-covered": score += 6
        elif a.get("clothingCoverage") == "full-coverage": score += 10
        # Diet & supplements
        if a.get("vitaminDSupplement") == "yes": score -= 10
        if a.get("vitaminDFoods") == "yes": score -= 5

        return max(0, score)

    def generate_weekly_plan(self, data, uv_index, result):
        """Generate a simple weekly plan based on result & UV conditions."""
        base_time = 20 if result == "Inadequate" else 15
        safe_time = f"{max(10, base_time - math.ceil(uv_index / 2))} min outdoor"
        plan = []
        for day in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]:
            plan.append({
                "day": day,
                "sun_exposure": safe_time,
                "activity": "Morning walk" if uv_index < 8 else "Evening stroll",
                "note": (
                    "Include fish/eggs for extra vitamin D"
                    if data.get("vitaminDFoods") == "no"
                    else "Maintain healthy diet"
                ),
            })
        return plan
