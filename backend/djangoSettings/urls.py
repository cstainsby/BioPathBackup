"""seniorProj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from django.urls import include, path
from rest_framework import routers, permissions
from djangoApp import views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


router = routers.DefaultRouter()
# The basename attribute is required but is somewhat arbitrary. Still search for the pathway using
# /localhost:8000/pathways as an example
router.register(r'pathways', views.PathWayViewSet, basename='MyPathways')
router.register(r'modules', views.ModuleViewSet, basename='MyModules')
router.register(r'products', views.ProductsViewSet, basename='MyProducts')
router.register(r'substrates', views.SubstratesViewSet, basename='MySubstrates')

schema_view = get_schema_view(
   openapi.Info(
      title="Biopath API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)


urlpatterns = [
    path('', include(router.urls)),
    path('biopath/', include('biopath.urls')),
    path('frontend/', include('frontend.urls')),
    path('admin/', admin.site.urls),
    path('swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

]
