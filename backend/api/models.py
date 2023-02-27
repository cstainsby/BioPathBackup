"""
Defines the models for enzymes, substrates, pathways, etc. Django uses these models
    to construct the database tables. These classes are used by serializers.py which
    serializes the data into json for easy view building and deserializes json into
    these objects for creating new objects in the DB.
TODO validation
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User, Group
from django.core.validators import MinLengthValidator


class Molecule(models.Model):
    name = models.CharField(
        max_length=64,
        null=False,
        blank=False,
        validators=[MinLengthValidator(1)]
    )
    abbreviation = models.CharField(
        max_length=8,
        null=False,
        blank=False,
        validators=[MinLengthValidator(1)]
    )
    ball_and_stick_image = models.CharField(
        null=True,
        blank=True,
        max_length=64
    )
    space_filling_image = models.CharField(
        null=True,
        blank=True,
        max_length=64
    )
    link = models.URLField(null=True, blank=True)
    author = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=False,
        blank=False,
        related_name="molecules"
    )
    public = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Enzyme(models.Model):
    name = models.CharField(
        max_length=64,
        null=False,
        blank=False,
        validators=[MinLengthValidator(1)]
    )
    abbreviation = models.CharField(
        max_length=8,
        null=False,
        blank=False,
        validators=[MinLengthValidator(1)]
    )
    reversible = models.BooleanField(
        null=False,
        blank=False
    )
    substrates = models.ManyToManyField(
        Molecule,
        related_name="enzymes_substrates"
    )
    products = models.ManyToManyField(
        Molecule,
        related_name="enzymes_products"
    )
    cofactors = models.ManyToManyField(
        Molecule,
        related_name="enzymes_cofactors"
    )
    image = models.CharField(
        max_length=64,
        null=True,
        blank=True
    ) # space filling
    link = models.URLField(null=True, blank=True) # link to protopedia
    author = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=False,
        blank=False,
        related_name="enzymes"
    )
    public = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Pathway(models.Model):
    name = models.CharField(
        max_length=50,
        null=False,
        blank=False,
        validators=[MinLengthValidator(1)]
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="pathways"
    )
    link = models.URLField(
        null=True,
        blank=True
    )
    public = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class MoleculeInstance(models.Model):
    molecule = models.ForeignKey(Molecule, on_delete=models.PROTECT)
    pathway = models.ForeignKey(
        Pathway,
        on_delete=models.CASCADE,
        related_name="molecule_instances"
    )
    x = models.PositiveSmallIntegerField(null=False, blank=False)
    y = models.PositiveSmallIntegerField(null=False, blank=False)

    def __str__(self):
        return f"{self.molecule.name} @ ({self.x},{self.y})"


class EnzymeInstance(models.Model):
    enzyme = models.ForeignKey(Enzyme, on_delete=models.PROTECT)
    pathway = models.ForeignKey(
        Pathway,
        on_delete=models.CASCADE,
        related_name="enzyme_instances"
    )
    x = models.PositiveSmallIntegerField(null=False, blank=False)
    y = models.PositiveSmallIntegerField(null=False, blank=False)
    limiting = models.BooleanField(null=False, blank=False)
    # TODO what happens if a substrate, product, or cofactor is deleted?
    substrate_instances = models.ManyToManyField(
        MoleculeInstance,
        related_name="enzyme_instances_substrates"
    )
    product_instances = models.ManyToManyField(
        MoleculeInstance,
        related_name="enzyme_instances_products"
    )
    cofactor_instances = models.ManyToManyField(
        MoleculeInstance,
        related_name="enzyme_instances_cofactors"
    )

    def __str__(self):
        return f"{self.enzyme.name} @ ({self.x},{self.y})"
