from django.urls import path
from . import views

urlpatterns = [
    path('', views.timer_page, name='timer_page'),
    path('start/', views.start_timer, name='start_timer'),
]