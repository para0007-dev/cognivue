"""
URL configuration for cognivue project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),

    # 👇 Force login to be the entry point
    path('', include('simpleauth.urls')),

    # Other apps only accessible after login
    path('news/', include('news_scraper.urls')),
    path('timer/', include('timer.urls')),
    path('vitamin-d-helper/', include('vitamin_d_helper.urls')),
    path('insights/', include('insights.urls')),
    path('nutrition/', include('nutrition.urls')),

]

