from django.test import TestCase
from api import models


class MoleculeTestCase(TestCase):
      """
      All tests for the molecule model. Author is 'MoleculeTestCase'.
      """

      def setUp(self):
            """
            Basic set up functionality required for all tests.
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

      def basic_get(self):
            """
            Testing query-abilility using .get() on name, field access, and Molecule.__str__()
            """
            test_author = models.User.objects.get(username="MoleculeTestCase")
            m1 = models.Molecule.objects.get(name="m1")

            self.assertEqual(m1.name, "Molecule 1")
            self.assertEqual(m1.abbreviation, "m1")
            self.assertEqual(m1.link, "https://www.django-rest-framework.org/api-guide/testing/")
            self.assertEqual(m1.author, test_author)
            self.assertEqual(m1.public, True)
            self.assertEqual(m1.__str__(), "Molecule 1")