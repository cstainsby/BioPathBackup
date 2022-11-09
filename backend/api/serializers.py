"""
File: serialzers.py
Description: Defines the serializers for serializing various models in models.py into json.
    These serializers are used to create viewsets in views.py to simplify and standardize
    the data format that is returned by the API.
Modified: 10/27 - Josh Schmitz
"""

from django.contrib.auth.models import User, Group
from rest_framework import serializers

from . import models


class MoleculeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Molecule
        fields = "__all__"


class EnzymeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Enzyme
        fields = "__all__"


class PathwaySerializer(serializers.ModelSerializer):
    






class EnzymeSubstrateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EnzymeSubstrate
        fields = ['enzyme', 'substrate', 'substrate_type', 'focus']


class EnzymeSerializer(serializers.ModelSerializer):
    substrate = EnzymeSubstrateSerializer(many=True)
    
    class Meta:
        model = models.Enzyme
        fields = ['name', 'reversible', 'image', 'substrate']

        
class SubstrateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Substrate
        fields = ['name', 'image']


class PathwayConnectionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PathwayConnections
        fields = ['pathway', 'enzyme_from', 'enzyme_to', 'substrate']


# class PathwaySerializer(serializers.ModelSerializer):
#     enzymes = EnzymeSubstrateSerializer(many=True)

#     class Meta:
#         model = models.PathwayEnzyme
#         fields = ['pathway', 'enzyme', 'row']


# class PathwayListSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.Pathway
#         fields = ['name']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']