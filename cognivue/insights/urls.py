from django.urls import path
from . import views

app_name = "insights"

urlpatterns = [
    path("", views.hub, name="hub"),
    path("questionnaire/", views.questionnaire_start, name="questionnaire_start"),
    path("questionnaire/q/<int:index>/", views.questionnaire_question, name="question"),
    path("questionnaire/result/", views.questionnaire_result, name="questionnaire_result"),
    path("disclaimer/", views.disclaimer, name="disclaimer"),
]
