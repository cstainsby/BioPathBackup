"""
File: serialzers.py
Description: Defines the serializers for serializing various models in
    models.py into json. These serializers are used to create viewsets in
    views.py to simplify and standardize the data format that is returned by
    the API.
Modified: 11/17 - Josh Schmitz
TODO: If you explicitly specify a relational field pointing to a ManyToManyField with a through model, be sure to set read_only to True.
TODO: Optimmize with prefetch_related or select_related https://www.django-rest-framework.org/api-guide/relations/
"""

from django.contrib.auth.models import User, Group
from rest_framework import serializers

from api import models


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = [
            "id",
            "name"
        ]
        

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "groups"
        ]


class MoleculeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Molecule
        fields = "__all__"


class MoleculeInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MoleculeInstance
        fields = "__all__"


class MoleculeInstanceDetailSerializer(serializers.ModelSerializer):
    molecule_name = serializers.ReadOnlyField(source="molecule.name")
    abbreviation = serializers.ReadOnlyField(source="molecule.abbreviation")
    # TODO change images to read only
    ball_and_stick_image = serializers.ImageField(source="molecule.ball_and_stick_image")
    space_filling_image = serializers.ImageField(source="molecule.space_filling_image")
    link = serializers.ReadOnlyField(source="molecule.link")
    author = serializers.ReadOnlyField(source="molecule.author.id")
    public = serializers.ReadOnlyField(source="molecule.public")

    class Meta:
        model = models.MoleculeInstance
        fields = "__all__"


class EnzymeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Enzyme
        fields = "__all__"


class EnzymeInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EnzymeInstance
        fields = "__all__"


class EnzymeInstanceDetailSerializer(serializers.ModelSerializer):
    """
    note that substrate, product, cofactor aren't defined here. this is because
        we want it to display the ones from EnzymeInstance, not Enzyme.
    """
    name = serializers.ReadOnlyField(source="enzyme.name")
    abbreviation = serializers.ReadOnlyField(source="enzyme.abbreviation")
    image = serializers.ImageField(
        source="enzyme.image",
        allow_empty_file=True
    )
    reversible = serializers.ReadOnlyField(source="enzyme.reversible")
    link = serializers.ReadOnlyField(source="enzyme.link")
    author = serializers.ReadOnlyField(source="enzyme.author.id")
    public = serializers.ReadOnlyField(source="enzyme.public")
    
    class Meta:
        model = models.EnzymeInstance
        fields = "__all__"


class PathwaySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Pathway
        fields = "__all__"

class PathwayDetailSerializer(serializers.ModelSerializer):
    enzyme_instances = EnzymeInstanceSerializer(
        # source="enzymes.id",
        many=True
    )
    molecule_instances = MoleculeInstanceSerializer(
        # source="molecules.id",
        many=True
    )
    
    class Meta:
        model = models.Pathway
        fields = "__all__"
        