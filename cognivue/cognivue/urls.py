from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from insights.views import article_list  # <-- cards view
from insights import views as insights_views


urlpatterns = [
    path('admin/', admin.site.urls),

    path('', insights_views.hub, name='home'),
    path('news/', include('news_scraper.urls')),
    path('timer/', include('timer.urls')),
    path('vitamin-d-helper/', include('vitamin_d_helper.urls')),
    path('insights/', include('insights.urls')),

    path('accounts/login/',  auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(next_page='/accounts/login/'), name='logout'),
]
