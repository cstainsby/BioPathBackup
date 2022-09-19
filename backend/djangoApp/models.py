from statistics import mode
from django.core import validators
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User

# Create your models here.

class Pathway(models.Model):
      modelName = models.CharField(max_length=200)
      public = models.BooleanField(default=False)

      def __str__(self):
            return "Pathway: " + str(self.id) + " " + str(self.modelName)
      
class Module(models.Model):
	modelID = models.ForeignKey(Pathway, on_delete=models.CASCADE)
	enzyme = models.CharField(max_length = 200 )
	enzymeAbbr = models.CharField(max_length = 8, default="ENZYME")
	reversible = models.CharField(max_length = 200 )
	xCoor = models.IntegerField(default=0)
	yCoor = models.IntegerField(default=0)

	def __str__(self):
		return "Module: " + str(self.enzyme) + " " + str(self.enzymeAbbr) + " " + str(self.reversible) + " " + str(self.xCoor) + " " + str(self.yCoor) 

class Products(models.Model):
	moduleID = models.ForeignKey(Module, on_delete=models.CASCADE)
	product = models.CharField(max_length = 200)
	abbr = models.CharField(max_length = 8, default="PROD")
	modelID = models.IntegerField(default=1)

	def __str__(self):
		return "Product: " + str(self.product) + " " + str(self.abbr)

class Substrates(models.Model):
	moduleID = models.ForeignKey(Module, on_delete=models.CASCADE)
	substrate = models.CharField(max_length = 200)
	abbr = models.CharField(max_length = 8, default="SUB")
	modelID = models.IntegerField(default=1)

	def __str__(self):
		return "Substrate: " + str(self.substrate) + " " + str(self.abbr)

class Cofactors(models.Model):
	moduleID = models.ForeignKey(Module, on_delete=models.CASCADE)
	cofactor = models.CharField(max_length=200)
	cofactorAbbr = models.CharField(max_length=200)
	modelID = models.IntegerField(default=1)

	def __str__(self):
		return "Cofactor: " + str(self.cofactor) + " " + str(self.cofactorAbbr)