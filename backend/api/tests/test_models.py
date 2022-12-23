"""
File: test_models.py
Description: Unit tests for Django models.
Modified: 12/21 - Josh Schmitz
TODO test images
"""

from django.test import TestCase
from api import models


class MoleculeTestCase(TestCase):
      """
      All tests for the molecule model. Author is 'MoleculeTestCase'.
      """

      def setUp(self):
            """
            Basic set up functionality required for all tests (function level).
            """
            test_author = models.User(username="MoleculeTestCase")
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

      def test_retrieval(self):
            """
            Testing query-abilility using .get() on name, field access, and Molecule.__str__()
            """
            test_author = models.User.objects.get(username="MoleculeTestCase")
            m1 = models.Molecule.objects.get(name="Molecule 1")

            self.assertEqual(m1.name, "Molecule 1")
            self.assertEqual(m1.abbreviation, "m1")
            self.assertEqual(m1.link, "https://www.django-rest-framework.org/api-guide/testing/")
            self.assertEqual(m1.author, test_author)
            self.assertEqual(m1.public, True)
            self.assertEqual(m1.__str__(), "Molecule 1")


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


class PathwayTestCase(TestCase):
      """
      All tests for the Pathway model. Author is 'PathwayTestCase'.
      """

      @classmethod
      def setUpTestData(cls):
            """
            Set up functionality: ran once per TestClass (class level).
            """
            test_author = models.User(username="PathwayTestCase")
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

            e2 = models.Enzyme(
                  name="Enzyme 2",
                  abbreviation="e2",
                  reversible=True,
                  # image= #TODO
                  link="https://www.django-rest-framework.org/api-guide/testing/",
                  author=test_author,
                  public=True
            )
            e2.save()
            e2.substrates.add(m2)
            e2.products.add(m3)

      def setUp(self):
            """
            Basic set up functionality required for all tests (function level).
            """
            test_author = models.User.objects.get(username="PathwayTestCase")
            m1 = models.Molecule.objects.get(name="Molecule 1")
            m2 = models.Molecule.objects.get(name="Molecule 2")
            e1 = models.Enzyme.objects.get(name="Enzyme 1")

            p1 = models.Pathway(
                  name="Pathway 1",
                  author=test_author,
                  link="https://www.django-rest-framework.org/api-guide/testing/",
                  public=True
            )
            p1.save()

            pe1 = models.PathwayEnzyme(
                  pathway=p1,
                  enzyme=e1,
                  x=0,
                  y=0
            )
            pe1.save()

            pm1 = models.PathwayMolecule(
                  molecule=m1,
                  pathway=p1,
                  x=0,
                  y=0
            )
            pm1.save()

            pm2 = models.PathwayMolecule(
                  molecule=m2,
                  pathway=p1,
                  x=0,
                  y=0
            )
            pm2.save()

      def test_basic_retrieval(self):
            """
            Testing query-abilility using .get() on name, field access, and Enzyme.__str__()
            """
            test_author = models.User.objects.get(username="PathwayTestCase")
            e1 = models.Enzyme.objects.get(name="Enzyme 1")
            m1 = models.Molecule.objects.get(name="Molecule 1")
            m2 = models.Molecule.objects.get(name="Molecule 2")
            p1 = models.Pathway.objects.get(name="Pathway 1")

            self.assertEqual(p1.name, "Pathway 1")
            self.assertEqual(p1.author, test_author)

      def test_related_retrieval(self):
            """
            Testing retrieval of related fields
            """
            test_author = models.User.objects.get(username="PathwayTestCase")
            e1 = models.Enzyme.objects.get(name="Enzyme 1")
            m1 = models.Molecule.objects.get(name="Molecule 1")
            m2 = models.Molecule.objects.get(name="Molecule 2")
            p1 = models.Pathway.objects.get(name="Pathway 1")

            self.assertEqual(p1.enzymes.all()[0], e1)
            self.assertEqual(p1.molecules.all()[0], m1)
            self.assertEqual(p1.molecules.all()[1], m2)
            self.assertEqual(p1.enzymes.all()[0].substrates.all()[0], m1)