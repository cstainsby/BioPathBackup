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
    abbreviation = models.CharField(max_length=10)
    ball_and_stick_image = models.ImageField()
    space_filling_image = models.ImageField()
    link = models.URLField()
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    public = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    
class Enzyme(models.Model):
    name = models.CharField(max_length=50)
    reversible = models.BooleanField()
    substrates = models.ManyToManyField(
        Molecule,
        related_name="enzymes_substrates",
        on_delete=models.PROTECT
    )
    products = models.ManyToManyField(
        Molecule,
        related_name="enzymes_products",
        on_delete=models.PROTECT
    )
    cofactors = models.ManyToManyField(
        Molecule,
        related_name="enzymes_cofactors",
        on_delete=models.PROTECT
    )
    abbreviation = models.CharField(max_length=10)
    image = models.ImageField() # space filling
    link = models.URLField() # link to protopedia
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    public = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    
class Pathway(models.Model):
    name = models.CharField(max_length=50)
    enzymes = models.ManyToManyField(
        Enzyme,
        through='PathwayEnzyme',
        related_name="pathways_enzyme",
        on_delete=models.PROTECT
    )
    molecules = models.ManyToManyField(
        Molecule,
        through='PathwayMolecule',
        related_name="pathways_molecule",
        on_delete=models.PROTECT
    )
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    link = models.URLField()
    public = models.BooleanField(default=False)
    '''TODO: Add constraint on multiple enzymes in a pathway'''

    def __str__(self):
        return self.name


class PathwayEnzyme(models.Model):
    enzyme = models.ForeignKey(Enzyme, on_delete=models.PROTECT)
    pathway = models.ForeignKey(Pathway, on_delete=models.CASCADE)
    x = models.PositiveSmallIntegerField()
    y = models.PositiveSmallIntegerField()
    limiting = models.BooleanField()

    def __str__(self):
        return f"{self.pathway.__str__()} - {self.enzyme.__str__()}"

  
class PathwayMolecule(models.Model):
    substrate = models.ForeignKey(Molecule, on_delete=models.PROTECT)
    pathway = models.ForeignKey(Pathway, on_delete=models.CASCADE)
    x = models.PositiveSmallIntegerField()
    y = models.PositiveSmallIntegerField()
    
    def __str__(self):
        return f"{self.pathway.__str__()} - {self.substrate.__str__()}"