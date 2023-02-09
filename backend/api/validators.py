
from api import models
from rest_framework import serializers

def is_molecule_instance(value: int):
    molecule_instance = models.MoleculeInstance.objects.filter(id=value)
    if not molecule_instance.exists():
        raise serializers.ValidationError(f"'{value}' is not the id of a MoleculeInstance")


def is_enzyme_instance(value: int):
    enzyme_instance = models.EnzymeInstance.objects.filter(id=value)
    if not enzyme_instance.exists():
        raise serializers.ValidationError(f"'{value}' is not the id of a EnzymeInstance")