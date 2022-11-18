from django.test import TestCase, Client
from models import Pathway, Products, Substrates, Module

# Create your tests here.

class SimpleTest(TestCase):
      def setUp(self):
            self.test_client = Client()

      def test_response(self):
            response = self.test_client.get('/biopath/')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.content, b"Hello world from django backend")

class DataTest(TestCase):
      def setUp(self):
            Pathway1 = Pathway.objects.create(id=1, modelName="Glycolysis", public=False)
            Module1 = Module.objects.create(id=1, enzyme="Adenosine Diphosphate", enzymeAbbr="ADP", reversible="reversible", xCoor=1.0, yCoor=1.0, modelID_id=1)
            Product1 = Products.objects.create(id=1, product="Adenosine Triphosphate", abbr="ATP", moduleID=Module1)
            Substrate1 = Substrates.objects.create(id=1, substrate="Hexokinase", abbr="HK", modelID="1", moduleID=Module1)
      
      def test_objects(self):
            pathways = Pathway.objects.all()
            modules = Module.objects.all()
            products = Products.objects.all()
            substrates = Substrates.objects.all()
            

            self.assertEqual(len(pathways), 1)
            self.assertEqual(len(products), 1)
            self.assertEqual(len(substrates), 1)
            self.assertEqual(len(modules), 1)
            print(pathways[0])
            self.assertEqual(pathways[0].__str__(), "Pathway: 1 Glycolysis")
            self.assertEqual(modules[0].__str__(), "Module: Adenosine Diphosphate ADP reversible 1 1")
            self.assertEqual(products[0].__str__(), "Product: Adenosine Triphosphate ATP")
            self.assertEqual(substrates[0].__str__(), "Substrate: Hexokinase HK")

            #self.assertEqual(pathways.first(), "Pathway: 1 Glycolysis")
            #return str(self.id) + " " + str(self.userID_id) + " " + str(self.modelName)
