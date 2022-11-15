"""
File: views.py
Description: Defines view functions that are mapped to in urls.py for generating api
    responses. We are using viewsets instead of plain views as ensures CRUD compliance
    and prevents us from manually having to individually write out each function for
    POST, GET, PUT, and DELETE methods.
Modified: 10/27 - Josh Schmitz
"""

from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import serializers, models




def index(request):
    """
    Just for fun.
    """
    return HttpResponse(content="Hello, world.")


class EnzymeViewSet(viewsets.ModelViewSet):
    queryset = models.Enzyme.objects.all()
    serializer_class = serializers.EnzymeSerializer
    permission_classes = [permissions.IsAuthenticated]


class MoleculeViewSet(viewsets.ModelViewSet):
    queryset = models.Molecule.objects.all()
    serializer_class = serializers.MoleculeSerializer
    permission_classes = [permissions.IsAuthenticated]


class PathwayViewSet(viewsets.ModelViewSet):
    queryset = models.Pathway.objects.all()
    serializer_class = serializers.PathwaySerializer
    permission_classes = [permissions.IsAuthenticated]


# class EnzymeSubstrateViewSet(viewsets.ModelViewSet):
#     queryset = models.EnzymeSubstrate.objects.all()
#     serializer_class = serializers.EnzymeSubstrateSerializer
#     permission_classes = [permissions.IsAuthenticated]


# class PathwayConnectionsViewSet(viewsets.ModelViewSet):
#     queryset = models.PathwayConnections.objects.all()
#     serializer_class = serializers.PathwayConnectionsSerializer
#     permission_classes = [permissions.IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.IsAuthenticated]