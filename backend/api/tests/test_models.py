"""
Unit tests for Django models.
TODO barely anything is tested here. we need to test MoleculeInstance,
    EnzymeInstance, Pathway, users, etc in addition to more comprehensize test
    of molecule and enzyme
TODO test images
TODO test validation
"""

from django.test import TestCase
from django.core.exceptions import ValidationError

from api import models


class MoleculeTestCase(TestCase):
    """
    All tests for the molecule model. Author is 'MoleculeTestCase'.
    """

    def setUp(self):
        """
        Basic set up functionality required for all tests (function level).
        """
        self.test_author = models.User(username="MoleculeTestCase")
        self.test_author.save()
        
        self.molecule_attributes = {
            "name": "Molecule 1",
            "abbreviation": "m1",
            "ball_and_stick_image": None, # TODO test images
            "space_filling_image": None,
            "link": "hi", #"https://www.django-rest-framework.org/api-guide/testing/",
            "author": self.test_author,
            "public": True
        }
        self.m1 = models.Molecule(**self.molecule_attributes)
        self.m1.save()

    def test_retrieval(self):
        """
        Testing query-abilility using .get() on name, field access, and Molecule.__str__()
        """
        m1 = models.Molecule.objects.get(name="Molecule 1")

        self.assertEqual(m1.name, self.molecule_attributes["name"])
        self.assertEqual(m1.abbreviation, self.molecule_attributes["abbreviation"])
        self.assertEqual(m1.link, self.molecule_attributes["link"])
        self.assertEqual(m1.author, self.molecule_attributes["author"])
        self.assertEqual(m1.public, self.molecule_attributes["public"])
        self.assertEqual(m1.__str__(), self.molecule_attributes["name"])

    def test_validators_blank(self):
        m1 = models.Molecule()
        expected_errors = {
            'name': ['This field cannot be blank.'],
            'abbreviation': ['This field cannot be blank.'],
            'author': ['This field cannot be null.']
        }
        try:
            m1.full_clean()
        except ValidationError as e:
            self.assertDictEqual(expected_errors, e.message_dict)

    def test_validators_empty(self):
        m1 = models.Molecule(
            name="",
            abbreviation="",
            author=self.test_author
        )
        expected_errors = {
            'name': ['This field cannot be blank.'],
            'abbreviation': ['This field cannot be blank.']
        }
        try:
            m1.full_clean()
        except ValidationError as e:
            self.assertDictEqual(expected_errors, e.message_dict)

    def test_validators_max_length(self):
        m1 = models.Molecule(
            name="01234567890123456789012345678901234567890123456789012345678901234",
            abbreviation="012345678",
            author=self.test_author
        )
        expected_errors = {
            'name': ['Ensure this value has at most 64 characters (it has 65).'],
            'abbreviation': ['Ensure this value has at most 8 characters (it has 9).']
        }
        try:
            m1.full_clean()
        except ValidationError as e:
            self.assertDictEqual(expected_errors, e.message_dict)


class EnzymeTestCase(TestCase):
    """
    All tests for the Enzyme model. Author is 'EnzymeTestCase'.
    """

    @classmethod
    def setUpTestData(cls):
        """
        Set up functionality: ran once per TestClass (class level).
        """
        test_author = models.User(username="EnzymeTestCase")
        test_author.save()

        m1 = models.Molecule(
            name="Molecule 1",
            abbreviation="m1",
            # ball_and_stick_image="", # TODO test images
            # space_filling_image="",
            link="https://www.django-rest-framework.org/api-guide/testing/",
            author=test_author,
            public=True
        )
        m1.save()

        m2 = models.Molecule(
            name="Molecule 2",
            abbreviation="m2",
            # ball_and_stick_image="", # TODO test images
            # space_filling_image="",
            link="https://www.django-rest-framework.org/api-guide/testing/",
            author=test_author,
            public=True
        )
        m2.save()

        m3 = models.Molecule(
            name="Molecule 3",
            abbreviation="m3",
            # ball_and_stick_image="", # TODO test images
            # space_filling_image="",
            link="https://www.django-rest-framework.org/api-guide/testing/",
            author=test_author,
            public=True
        )
        m3.save()

    def setUp(self):
        """
        Basic set up functionality required for all tests (function level).
        """
        test_author = models.User.objects.get(username="EnzymeTestCase")
        m1 = models.Molecule.objects.get(name="Molecule 1")
        m2 = models.Molecule.objects.get(name="Molecule 2")
        m3 = models.Molecule.objects.get(name="Molecule 3")

        e1 = models.Enzyme(
            name="Enzyme 1",
            abbreviation="e1",
            reversible=True,
            # image= #TODO
            link="https://www.django-rest-framework.org/api-guide/testing/",
            author=test_author,
            public=True
        )
        e1.save()
        e1.substrates.add(m1)
        e1.products.add(m2)
        e1.cofactors.add(m3)

    def test_basic_retrieval(self):
        """
        Testing query-abilility using .get() on name, field access, and Enzyme.__str__()
        """
        test_author = models.User.objects.get(username="EnzymeTestCase")
        e1 = models.Enzyme.objects.get(name="Enzyme 1")

        self.assertEqual(e1.name, "Enzyme 1")
        self.assertEqual(e1.abbreviation, "e1")
        self.assertEqual(e1.link, "https://www.django-rest-framework.org/api-guide/testing/")
        self.assertEqual(e1.author, test_author)
        self.assertEqual(e1.public, True)
        self.assertEqual(e1.__str__(), "Enzyme 1")

    def test_related_retrieval(self):
        """
        Testing retrieval of related fields
        """
        test_author = models.User.objects.get(username="EnzymeTestCase")
        e1 = models.Enzyme.objects.get(name="Enzyme 1")
        m1 = models.Molecule.objects.get(name="Molecule 1")
        m2 = models.Molecule.objects.get(name="Molecule 2")
        m3 = models.Molecule.objects.get(name="Molecule 3")

        self.assertEqual(e1.substrates.all()[0], m1)
        self.assertEqual(e1.products.all()[0], m2)
        self.assertEqual(e1.cofactors.all()[0], m3)