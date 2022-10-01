"""
These are the url routes for all requests starting with http://ip:port/api/
"""

from django.urls import path

from . import views

urlpatterns = [
    path(route='', view=views.index, name='index'),
]