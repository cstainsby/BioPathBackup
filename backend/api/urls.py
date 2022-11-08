"""
File: serialzers.py
Description: Maps url endpoints to the viewsets in views.py. We are using DRF routers to
    abstract this so we can just deal with viewsets and not individual views. This helps
    insure CRUD compliance and means there's less code for us to write. Note that these 
    the given routes here are actually all prefixed with api/ as this file is routed to
    from the projects base urls.py in backend/biopath.
Modified: 10/27 - Josh Schmitz
"""

from django.urls import include, path
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'enzymes', views.EnzymeViewSet)
router.register(r'molecules', views.MoleculeViewSet)
router.register(r'pathways', views.PathwayViewSet)
# router.register(r'enzyme_substrates', views.EnzymeSubstrateViewSet)
# router.register(r'pathway_connections', views.PathwayConnectionsViewSet)

urlpatterns = [
    path(route='hello-world/', view=views.index, name='index'),
    path(route='', view=include(router.urls)),
    path(route='api-auth/', view=include('rest_framework.urls', namespace='rest_framework')),
]

# urlpatterns = format_suffix_patterns(urlpatterns) # not sure what this does