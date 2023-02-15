"""
File: urls.py
Description: Defines urls to views. This is the project urls.py which just map admin
    and api to the urls.py at backend/api/urls.py.
Modified: 11/17 - Josh Schmitz
"""

from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken import views

from api.views import RegisterView

urlpatterns = [
    path(route='admin/', view=admin.site.urls),
    path(route='api/', view=include('api.urls')), # this essentially just includes the urls from api/urls.py

    # routes that are used for authentication
    # register/ - used for sending json containing new user's data to be stored 
    # login/    - used for getting a sign in token from backend
    path(route='register/', view=RegisterView.as_view(), name='register'),
    # path(route='login/', view=LoginView.as_view(), name='login'),
    path(route='api-token-auth/', view=views.obtain_auth_token)
]
