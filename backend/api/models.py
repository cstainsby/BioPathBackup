"""
File: models.py
Description: Defines the models for enzymes, substrates, connections, etc. Django uses
    these models to construct the database tables. They are used by serializers.py which
    serializes the data into json for easy view building.
Modified: 10/27 - Josh Schmitz
"""

from django.db import models
from django.utils.translation import gettext_lazy as _


class Enzyme(models.Model):
    name = models.CharField(max_length=30, primary_key=True)
    reversible = models.BooleanField()
    image = models.CharField(max_length=30) # image is a filepath to a png showing the enzyme


class Substrate(models.Model):
    name = models.CharField(max_length=30, primary_key=True)
    image = models.CharField(max_length=30) # image is a filepath to a png showing the substrate


class EnzymeSubstrate(models.Model):
    """
    This model contains information that is intrinsic to an enzyme. It is unnecessary for
        building pathways in the sense that a pathway can be derived without it (ie using
        only PathwayConnections instead), however it is useful to have this model for storing
        the substrates and products of an enzyme irrespective of any pathway.
    
    Django doesn't allow multi-field primary keys, so instead we allow Django to create an
        integer id primary key and enforce that (enzyme, substrate) is unique.
    """
    enzyme = models.ForeignKey(to=Enzyme, on_delete=models.CASCADE)
    substrate = models.ForeignKey(to=Substrate, on_delete=models.CASCADE)
    class SubstrateType(models.TextChoices):
        """
        This is essentially defining an enum that the substrate_type field uses.
        """
        INPUT = 'IN', _('Input')
        OUTPUT = 'OUT', _('Output')
    substrate_type = models.CharField(max_length=3, choices=SubstrateType.choices)
    focus = models.BooleanField()

    class Meta():
        """
        This class describes meta properties of the model. So far we are only using it to
            ensure that (enzyme, substrate) is unique.
        """
        constraints = [
            models.UniqueConstraint(
                fields=['enzyme', 'substrate'], name='unique_enzyme_substrate'
            )
        ]


class PathwayConnections(models.Model):
    """
    This table describes a pathway by listing the various enzyme->enzyme connections within
        a pathway. There is a START enzyme and an END enzyme which are used to specify
        initial and terminal substrates within a pathway.
        
    Django doesn't allow multi-field primary keys, so instead we allow Django to create an
        integer id primary key and enforce that (pathway, enzyme_from, enzyme_to) is unique.
    """
    pathway = models.CharField(max_length=30)
    enzyme_from = models.ForeignKey(to=Enzyme, on_delete=models.CASCADE, related_name="connection_enzyme_from")
    enzyme_to = models.ForeignKey(to=Enzyme, on_delete=models.CASCADE, related_name="connection_enzyme_to")
    substrate = models.ForeignKey(to=Substrate, on_delete=models.CASCADE)

    class Meta():
        """
        This class describes meta properties of the model. So far we are only using it to ensure that
            (pathway, enzyme_from, enzyme_to) is unique.
        """
        constraints = [
            models.UniqueConstraint(
                fields=['pathway', 'enzyme_from', 'enzyme_to'], name='unique_pathway_connection'
            )
        ]