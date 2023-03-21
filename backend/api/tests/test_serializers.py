"""
Unit tests for Django serializers.
TODO test all serializers, validation, etc
TODO test creation/modification
"""

from copy import deepcopy
from django.test import TestCase
from rest_framework.exceptions import ErrorDetail

from api import models, serializers
from api.tests import example_data


class GroupSerializerTestCase(TestCase):
    """
    All tests for the group serializer.
    """
    def setUp(self):
        self.group_attributes = {
            "id": 5,
            "name": "group1"
        }
        self.group = models.Group(**self.group_attributes)
        self.serializer = serializers.GroupSerializer(instance=self.group)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(data.keys(), ["id", "name"])

    def test_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["id"], self.group_attributes["id"])


class UserSerializerTestCase(TestCase):
    """
    All tests for the user serializer.
    """
    def setUp(self):
        self.user_attributes = {
            "id": 5,
            "username": "us1"
        }
        self.user = models.User(**self.user_attributes)
        self.serializer = serializers.UserSerializer(instance=self.user)

    # def test_contains_expected_fields(self):
    #     data = self.serializer.data
    #     self.assertCountEqual(data.keys(), ["id", "username", "groups"])

    # def test_field_content(self):
    #     data = self.serializer.data
    #     self.assertEqual(data["id"], self.user_attributes["id"])
    #     self.assertEqual(data["username"], "us1")
    #     self.assertEqual(data["groups"], [])


class MoleculeSerializerTestCase(TestCase):
    """
    All tests for the molecule serializer.
    """

    @classmethod
    def setUpTestData(cls):
        author = models.User(username="MoleculeSerializerTestCase")
        author.save()

    def setUp(self):
        self.author = models.User.objects.get(username="MoleculeSerializerTestCase")
        self.molecule_attributes = {
            "id": 1,
            "name": "Molecule 1",
            "abbreviation": "m1",
            # "ball_and_stick_image": 
            # "space_filling_image": 
            "link": "https://www.django-rest-framework.org/api-guide/testing/",
            "author": self.author,
            "public": True
        }
        self.molecule = models.Molecule(**self.molecule_attributes)
        self.serializer = serializers.MoleculeSerializer(instance=self.molecule)

    # def test_contains_expected_fields(self):
    #     data = self.serializer.data
    #     self.assertCountEqual(
    #         data.keys(),
    #         ["id", "name", "abbreviation", "ball_and_stick_image", "space_filling_image", "link", "author", "public"]
    #     )

    def test_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["id"], self.molecule_attributes["id"])
        self.assertEqual(data["name"], self.molecule_attributes["name"])
        self.assertEqual(data["abbreviation"], self.molecule_attributes["abbreviation"])
        self.assertEqual(data["ball_and_stick_image"], None)
        self.assertEqual(data["space_filling_image"], None)
        self.assertEqual(data["link"], self.molecule_attributes["link"])
        self.assertEqual(data["author"], self.molecule_attributes["author"].id)
        self.assertEqual(data["public"], self.molecule_attributes["public"])


class PathwaySerializerTestCase(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        author = models.User.objects.create(username="PathwayDetailSerializerTestCase")
        m1 = models.Molecule.objects.create(
            name="molecule 1",
            abbreviation="m1",
            author=author
        )
        m2 = models.Molecule.objects.create(
            name="molecule 2",
            abbreviation="m2",
            author=author
        )
        e = models.Enzyme.objects.create(
            name="enzyme 1",
            abbreviation="e1",
            author=author,
            reversible=True
        )
        e.substrates.add(m1)
        e.products.add(m2)

    def setUp(self):
        self.author = models.User.objects.get(username="PathwayDetailSerializerTestCase")
        self.m1 = models.Molecule.objects.get(name="molecule 1")
        self.m2 = models.Molecule.objects.get(name="molecule 2")
        self.e = models.Enzyme.objects.get(name="enzyme 1")
    
    def test_create(self):
        pathway_data = deepcopy(example_data.PATHWAY_DATA)
        pathway_data["author"] = self.author.id
        pathway_data["molecule_instances"][0]["molecule"] = self.m1.id
        pathway_data["molecule_instances"][1]["molecule"] = self.m2.id
        pathway_data["enzyme_instances"][0]["enzyme"] = self.e.id
        serializer = serializers.PathwayWriteSerializer(data=pathway_data)
        self.assertTrue(serializer.is_valid())
        pathway = serializer.save()
        self.assertEqual(
            pathway.molecule_instances.first().id,
            pathway.enzyme_instances.first().substrate_instances.first().id
        )
        self.assertEqual(
            pathway.molecule_instances.all()[1].id,
            pathway.enzyme_instances.first().product_instances.first().id
        )

    def test_create_invalid_author(self):
        pathway_data = deepcopy(example_data.PATHWAY_DATA)
        pathway_data["author"] = 999
        pathway_data["molecule_instances"][0]["molecule"] = self.m1.id
        pathway_data["molecule_instances"][1]["molecule"] = self.m2.id
        pathway_data["enzyme_instances"][0]["enzyme"] = self.e.id
        serializer = serializers.PathwayWriteSerializer(data=pathway_data)
        self.assertFalse(serializer.is_valid())
        self.assertDictEqual(
            serializer.errors,
            {'author': [ErrorDetail(string='Invalid pk "999" - object does not exist.', code='does_not_exist')]}
        )
        
    def test_create_invalid_subprod(self):
        pathway_data = deepcopy(example_data.PATHWAY_DATA)
        pathway_data["author"] = self.author.id
        pathway_data["molecule_instances"][0]["molecule"] = self.m2.id # <--| swapped these
        pathway_data["molecule_instances"][1]["molecule"] = self.m1.id # <--|
        pathway_data["enzyme_instances"][0]["enzyme"] = self.e.id
        serializer = serializers.PathwayWriteSerializer(data=pathway_data)
        self.assertFalse(serializer.is_valid())
        self.assertDictEqual(
            serializer.errors,
            {'non_field_errors': [ErrorDetail(string='substrate_instance must be a substrate of the enzyme', code='invalid')]}
        )

    def test_create_missing_cofactor(self):
        wrong_enzyme = models.Enzyme.objects.create(
            name="enzyme 1",
            abbreviation="e1",
            author=self.author,
            reversible=True
        )
        wrong_enzyme.substrates.add(self.m1)
        wrong_enzyme.products.add(self.m2)
        wrong_enzyme.cofactors.add(self.m1) # <-- has cofactor
        pathway_data = deepcopy(example_data.PATHWAY_DATA)
        pathway_data["author"] = self.author.id
        pathway_data["molecule_instances"][0]["molecule"] = self.m1.id
        pathway_data["molecule_instances"][1]["molecule"] = self.m2.id
        pathway_data["enzyme_instances"][0]["enzyme"] = wrong_enzyme.id # <--  
        serializer = serializers.PathwayWriteSerializer(data=pathway_data)
        self.assertFalse(serializer.is_valid())
        print(f"*****{serializer.errors}*****")
        self.assertDictEqual(
            serializer.errors,
            {'non_field_errors': [ErrorDetail(string='substrate_instance must be a substrate of the enzyme', code='invalid')]}
        )
        