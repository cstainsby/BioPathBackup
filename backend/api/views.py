"""
File: views.py
Description: Defines view functions that are mapped to in urls.py for generating api
    responses. We are using viewsets instead of plain views as ensures CRUD compliance
    and prevents us from manually having to individually write out each function for
    POST, GET, PUT, and DELETE methods.
TODO: only show enzyme/molecule/pathway if public or auther=user
"""

from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions
from django.db.models import Q

from api import serializers, models


class MoleculeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.MoleculeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return models.Molecule.objects.all()
        else:
            return models.Molecule.objects.filter(
                Q(public=True) | Q(author=self.request.user)
            )


class MoleculeInstanceViewSet(viewsets.ModelViewSet):
    queryset = models.MoleculeInstance.objects.all()
    serializer_class = serializers.MoleculeInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]


class EnzymeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.EnzymeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return models.Enzyme.objects.all()
        else:
            return models.Enzyme.objects.filter(
                Q(public=True) | Q(author=self.request.user)
            )


class EnzymeInstanceViewSet(viewsets.ModelViewSet):
    queryset = models.EnzymeInstance.objects.all()
    serializer_class = serializers.EnzymeInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]


class PathwayViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PathwayDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return models.Pathway.objects.all()
        else:            
            return models.Pathway.objects.filter(
                Q(public=True) | Q(author=self.request.user)
            )

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.PathwayWriteSerializer
        else:
            return serializers.PathwayDetailSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAdminUser]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.IsAdminUser]
