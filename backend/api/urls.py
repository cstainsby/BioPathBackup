"""
Maps url endpoints to the viewsets in views.py. We are using DRF routers to abstract
    this so we can just deal with viewsets and not individual views. This helps
    ensure CRUD compliance and means there's less code for us to write. Note that
    these the given routes here are actually all prefixed with api/ as this file is
    routed to from the projects base urls.py in backend/biopath.
Note: We purposefully haven't added endpoints to MoleculeInstance/EnzymeInstance.
    These are abstracted away from the api user who interacts with them solely through
    the Pathway endpoint since they are intrinsic to a pathway.
"""

from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views


router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'enzymes', views.EnzymeViewSet, basename="enzymes")
router.register(r'molecules', views.MoleculeViewSet, basename="molecules")
router.register(r'pathways', views.PathwayViewSet, basename="pathways")


urlpatterns = [
    path(route='', view=include(router.urls)),

    # session auth (only used by browsable api)
    path(route='api-auth/', view=include('rest_framework.urls', namespace='rest_framework')),
    
    # jwt auth (used by frontend/end-users)
    path(route='register/', view=views.UserRegistrationView.as_view(), name='register user'),
    path(route='api-token-auth/', view=views.TokenObtainPairView.as_view(), name="get token")
]
