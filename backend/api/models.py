"""
File: models.py
Description: Defines the models for enzymes, substrates, connections, etc. Django uses
    these models to construct the database tables. They are used by serializers.py which
    serializes the data into json for easy view building.
Modified: 10/27 - Josh Schmitz
"""

from operator import mod
from unittest.util import _MAX_LENGTH
from django.db import models
from django.utils.translation import gettext_lazy as _


class Molecule(models.Model):
    name = models.CharField(max_length=30, primary_key=True)
    image = models.CharField(max_length=30, default="") # image is a filepath to a png showing the substrate
    link = models.URLField()
    abbreviation = models.CharField(max_length=30)

class Enzyme(Molecule):
    reversible = models.BooleanField()
    cofactors = models.ManyToManyField(Molecule)
    substrates = models.ManyToManyField(Molecule)
    products = models.ManyToManyField(Molecule)

class User(models.Model):
    name = models.CharField(max_length=30)

class Pathway(models.Model):
    name = models.CharField(max_length=30)
    author = models.ForeignKey(User)
    enzymes = models.ManyToManyField(Enzyme, through=PathwayEnzyme)
    substrates = models.ManyToManyField(Molecule, through=PathwaySubstrate)
    link = models.URLField()
    public = models.BooleanField()

class PathwayEnzyme(models.Model):
    enzyme = models.ForeignKey(Enzyme)
    pathway = models.ForeignKey(Pathway)
    x = models.PositiveSmallIntegerField()
    y = models.PositiveSmallIntegerField()
  
class PathwayEnzyme(models.Model):
    substrate = models.ForeignKey(Molecule)
    pathway = models.ForeignKey(Pathway)
    x = models.PositiveSmallIntegerField()
    y = models.PositiveSmallIntegerField()


class EnzymeMolecule(models.Model):
    """
    This model contains information that is intrinsic to an enzyme. It is unnecessary for
        building pathways in the sense that a pathway can be derived without it (ie using
        only PathwayConnections instead), however it is useful to have this model for storing
        the substrates and products of an enzyme irrespective of any pathway.
    
    Django doesn't allow multi-field primary keys, so instead we allow Django to create an
        integer id primary key and enforce that (enzyme, substrate) is unique.
    """
    enzyme = models.ForeignKey(to=Enzyme, on_delete=models.CASCADE)
    molecule = models.ForeignKey(to=Molecule, on_delete=models.CASCADE)
    class MoleculeType(models.TextChoices):
        """
        This is essentially defining an enum that the substrate_type field uses.
        """
        INPUT = 'IN', _('Input')
        OUTPUT = 'OUT', _('Output')
    substrate_type = models.CharField(max_length=3, choices=MoleculeType.choices)
    focus = models.BooleanField()

    class Meta():
        """
        This class describes meta properties of the model. So far we are only using it to
            ensure that (enzyme, molecule) is unique.
        """
        constraints = [
            models.UniqueConstraint(
                fields=['enzyme', 'molecule'], name='unique_enzyme_molecule'
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
    molecule = models.ForeignKey(to=Molecule, on_delete=models.CASCADE)

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