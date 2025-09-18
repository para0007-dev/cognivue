from django.urls import path
from . import views

app_name = "insights"

urlpatterns = [
    # Dashboard
    path("", views.dashboard, name="dashboard"),

    # Questionnaire
    path("questionnaire/", views.questionnaire_start, name="questionnaire_start"),
    path("questionnaire/q/<int:index>/", views.questionnaire_question, name="question"),
    path("questionnaire/result/", views.questionnaire_result, name="questionnaire_result"),
    path("disclaimer/", views.disclaimer, name="disclaimer"),
    path("learn-more/", views.learn_more, name="learn_more"),

    # JSON endpoints for Vue
    path("api/factoids/", views.api_factoids, name="api_factoids"),
    path("api/tips/", views.api_tips, name="api_tips"),
]
