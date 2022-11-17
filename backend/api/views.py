"""
File: views.py
Description: Defines view functions that are mapped to in urls.py for generating api
    responses. We are using viewsets instead of plain views as ensures CRUD compliance
    and prevents us from manually having to individually write out each function for
    POST, GET, PUT, and DELETE methods.
Modified: 10/27 - Josh Schmitz
TODO: only show enzyme/molecule/pathway if public or auther=user
"""

from django.http import HttpResponse
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions

from . import serializers, models


class EnzymeViewSet(viewsets.ModelViewSet):
    queryset = models.Enzyme.objects.all()
    serializer_class = serializers.EnzymeSerializer
    permission_classes = [permissions.IsAuthenticated]


class MoleculeViewSet(viewsets.ModelViewSet):
    queryset = models.Molecule.objects.all()
    serializer_class = serializers.MoleculeSerializer
    permission_classes = [permissions.IsAuthenticated]


class PathwayViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Pathway.objects.all()
    serializer_class = serializers.PathwaySerializer
    permission_classes = [permissions.IsAuthenticated]


class PathwayMoleculeViewSet(viewsets.ModelViewSet):
    queryset = models.PathwayMolecule.objects.all()
    serializer_class = serializers.PathwayMoleculeBasicSerializer
    permission_classes = [permissions.IsAuthenticated]


class PathwayEnzymeViewSet(viewsets.ModelViewSet):
    queryset = models.PathwayEnzyme.objects.all()
    serializer_class = serializers.PathwayEnzymeBasicSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.IsAuthenticated]