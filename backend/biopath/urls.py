"""
Used to map the api's URL endpoints to the views for those endpoints, however this
    urls.py just maps the prefix api/ to the urls in backend/api/urls.py.
"""

from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken import views

from api.views import UserRegistrationView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path(route='admin/', view=admin.site.urls),
    path(route='api/', view=include('api.urls')), # this essentially just includes the urls from api/urls.py

    # routes that are used for authentication
    # register/ - used for sending json containing new user's data to be stored 
    # login/    - used for getting a sign in token from backend
    path(route='register/', view=UserRegistrationView.as_view(), name='register user'),
    # path(route='login/', view=LoginView.as_view(), name='login'),
    path(route='api-token-auth/', view=views.obtain_auth_token)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
