"""
File: models.py
Description: Defines the models for enzymes, substrates, connections, etc. Django uses
    these models to construct the database tables. They are used by serializers.py which
    serializes the data into json for easy view building.
Modified: 11/8 - Zach Burnaby & Josh Schmitz
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User


class Molecule(models.Model):
    name = models.CharField(max_length=50)

    # ball_and_stick_image = models.ImageField()
    # abbreviation = models.CharField(max_length=10)
    # space_filling_image = models.ImageField()
    # link = models.URLField()
    # author = models.ForeignKey(User)
    # public = models.BooleanField()

    def __str__(self):
        return self.name

    
class Enzyme(models.Model):
    name = models.CharField(max_length=50)
    reversible = models.BooleanField()

    # you can't (or shouldn't) have multiple manyToMany fields refrencing the same table
    #   but we could use
    molecules = models.ManyToManyField(Molecule, through='EnzymeMolecule')
    # instead of
    # substrates = models.ManyToManyField(Molecule)
    # products = models.ManyToManyField(Molecule)
    # cofactors = models.ManyToManyField(Molecule)

    # abbreviation = models.CharField(max_length=10)
    # image = models.ImageField() # space filling
    # link = models.URLField() # link to protopedia
    # author = models.ForeignKey(User)
    # public = models.BooleanField()

    def __str__(self):
        return self.name


class EnzymeMolecule(models.Model):
    enzyme = models.ForeignKey(Enzyme, on_delete=models.CASCADE)
    molecule = models.ForeignKey(Molecule, on_delete=models.CASCADE)
    
    class MoleculeType(models.TextChoices):
        """
        This is essentially defining an enum that the molecule_type field uses.
        """
        SUBSTRATE = 'SUB', _('Substrate')
        PRODUCT = 'PRO', _('Product')
        COFACTOR = 'COF', _('Cofactor')
    
    molecule_type = models.CharField(
        max_length=3,
        choices=MoleculeType.choices
    )
    
class Pathway(models.Model):
    name = models.CharField(max_length=50)
    enzymes = models.ManyToManyField(Enzyme, through='PathwayEnzyme')
    molecules = models.ManyToManyField(Molecule, through='PathwayMolecule')
    
    # author = models.ForeignKey(User)
    # link = models.URLField()
    # public = models.BooleanField()
    '''TODO: Add constraint on multiple enzymes in a pathway'''

    def __str__(self):
        return self.name


class PathwayEnzyme(models.Model):
    enzyme = models.ForeignKey(Enzyme, on_delete=models.CASCADE)
    pathway = models.ForeignKey(Pathway, on_delete=models.CASCADE)
    x = models.PositiveSmallIntegerField()
    y = models.PositiveSmallIntegerField()
    limiting = models.BooleanField()

    def __str__(self):
        return f"{self.pathway.__str__()} - {self.enzyme.__str__()}"

  
class PathwayMolecule(models.Model):
    substrate = models.ForeignKey(Molecule, on_delete=models.CASCADE)
    pathway = models.ForeignKey(Pathway, on_delete=models.CASCADE)
    x = models.PositiveSmallIntegerField()
    y = models.PositiveSmallIntegerField()
    
    def __str__(self):
        return f"{self.pathway.__str__()} - {self.substrate.__str__()}"