"""
Used to map the api's URL endpoints to the views for those endpoints, however this
    urls.py just maps the prefix api/ to the urls in backend/api/urls.py.
"""

from django.contrib import admin
from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("", include("frontend.urls")),
    path(route='admin/', view=admin.site.urls),
    path(route='api/', view=include('api.urls')), # this essentially just includes the urls from api/urls.py

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
