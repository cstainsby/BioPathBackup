"""
These are the url routes for all requests starting with http://ip:port/api/
"""

from django.urls import include, path
from rest_framework import routers
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'enzymes', views.EnzymeViewSet)
router.register(r'substrates', views.SubstrateViewSet)
router.register(r'enzyme_substrates', views.EnzymeSubstrateViewSet)
router.register(r'pathway_connections', views.PathwayConnectionsViewSet)

urlpatterns = [
    path(route='hello-world/', view=views.index, name='index'),
    path(route='', view=include(router.urls)),
    path(route='api-auth/', view=include('rest_framework.urls', namespace='rest_framework')), # only required for auth
    # path(route='enzymes/', view=views.enzyme_list),
    # path(route='enzymes/<str:pk>/', view=views.enzyme_detail)
]

# urlpatterns = format_suffix_patterns(urlpatterns) # not sure what this does