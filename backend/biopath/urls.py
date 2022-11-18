"""
File: urls.py
Description: Defines urls to views. This is the project urls.py which just map admin
    and api to the urls.py at backend/api/urls.py.
Modified: 11/17 - Josh Schmitz
"""

from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path(route='admin/', view=admin.site.urls),
    path(route='api/', view=include('api.urls')),
]


urlpatterns = [
    path('', include(router.urls)),
    path('biopath/', include('biopath.urls')),
    path('frontend/', include('frontend.urls')),
    path('admin/', admin.site.urls),
    path('swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

]
