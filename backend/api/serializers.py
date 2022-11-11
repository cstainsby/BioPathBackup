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


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "name"]


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True)
    
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "groups"
        ]
        
        
class MoleculeSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    
    class Meta:
        model = models.Molecule
        fields = [
            "name",
            "abbreviation",
            "ball_and_stick_image",
            "space_filling_image",
            "link",
            "author",
            "public"
        ]


class EnzymeSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    substrates = MoleculeSerializer(many=True)
    products = MoleculeSerializer(many=True)
    cofactors = MoleculeSerializer(many=True)
    
    class Meta:
        model = models.Enzyme
        fields = [
            "name",
            "reversible",
            "substrates",
            "products",
            "cofactors",
            "abbreviation",
            "image",
            "link",
            "author",
            "public"
        ]


class PathwaySerializer(serializers.ModelSerializer):
    author = UserSerializer()
    enzymes = EnzymeSerializer(many=True)
    molecules = MoleculeSerializer(many=True)
    
    class Meta:
        model = models.Pathway
        fields = [
            "name",
            "enzymes",
            "molecules",
            "author",
            "link",
            "public"
        ]


