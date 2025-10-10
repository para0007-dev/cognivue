from django.urls import path
from . import views
from .views_questionnaire import QuestionnaireAPIView


urlpatterns = [
    path('', views.vitamin_d_helper, name='vitamin_d_helper'),
    path('update-location/', views.update_location_from_coords, name='update_location_from_coords'),
    path("api/weather/", views.weather_summary, name="weather_summary"),
    path("api/update-location/", views.update_location_from_coords, name="update_location_from_coords"),
    path('api/questionnaire/', QuestionnaireAPIView.as_view(), name='questionnaire_api'),

]