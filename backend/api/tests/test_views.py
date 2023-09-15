"""
Unit tests for Django views.
"""

from copy import deepcopy
import json
from django.test import TestCase
from rest_framework.test import APIClient

from api import models, serializers
from api.tests import example_data

AUTHOR_NAME = "TestViewsAuthor"
NUMBER_OF_PATHWAYS = 20
PATHWAY_FIELDS = {
    "id",
    "name",
    "author",
    "link",
    "public",
    "enzyme_instances",
    "molecule_instances"
}
NUMBER_OF_MOLECULES = 20
MOLECULE_FIELDS = {
    "id",
    "name",
    "abbreviation",
    "ball_and_stick_image",
    "space_filling_image",
    "link",
    "public",
    "author"
}
MOLECULE_INSTANCE_FIELDS = {
    "id",
    "name",
    "abbreviation",
    "ball_and_stick_image",
    "space_filling_image",
    "link",
    "public",
    "author",
    "x",
    "y",
    "molecule"
}
NUMBER_OF_ENZYMES = 20
ENZYME_FIELDS = {
    "id",
    "name",
    "abbreviation",
    "reversible",
    "substrates",
    "products",
    "cofactors",
    "image",
    "link",
    "author",
    "public"
}
ENZYME_INSTANCE_FIELDS = {
    "id",
    "name",
    "abbreviation",
    "reversible",
    "substrate_instances",
    "product_instances",
    "cofactor_instances",
    "image",
    "link",
    "author",
    "public",
    "x",
    "y",
    "enzyme",
    "limiting"
}

client = APIClient()


class PathwayListViewTest(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        author_id = models.User.objects.create(username=AUTHOR_NAME).id
        
        m1_data = deepcopy(example_data.MOLECULE_DATA)
        m2_data = deepcopy(example_data.MOLECULE_DATA)        
        m1_data["author"] = author_id
        m2_data["author"] = author_id
        m1_data["name"] += "1"
        m2_data["name"] += "2"
        m1_serializer = serializers.MoleculeSerializer(data=m1_data)
        m2_serializer = serializers.MoleculeSerializer(data=m2_data)
        m1_serializer.is_valid()

        m2_serializer.is_valid()
        m1 = m1_serializer.save()
        m2 = m2_serializer.save()

        e_data = deepcopy(example_data.ENZYME_DATA)
        e_data["author"] = author_id
        e_data["substrates"].append(m1.id)
        e_data["products"].append(m2.id)
        e_serializer = serializers.EnzymeSerializer(data=e_data)
        e_serializer.is_valid()
        e = e_serializer.save()

        pathway_data = deepcopy(example_data.PATHWAY_DATA)
        for pathway_num in range(NUMBER_OF_PATHWAYS):
            pathway_data["author"] = author_id
            pathway_data["name"] += str(pathway_num)
            pathway_data["molecule_instances"][0]["molecule"] = m1.id
            pathway_data["molecule_instances"][1]["molecule"] = m2.id
            pathway_data["enzyme_instances"][0]["enzyme"] = e.id
            pathway_serializer = serializers.PathwayWriteSerializer(data=pathway_data)
            pathway_serializer.is_valid()
            pathway_serializer.save()

    def setUp(self) -> None:
        self.author = models.User.objects.get(username=AUTHOR_NAME)
        client.force_authenticate(user=self.author)

    def test_view_url_exists_at_desired_location(self):
        response = client.get("/api/pathways/")
        self.assertEqual(response.status_code, 200)

    def test_lists_all_pathways(self):
        response = client.get("/api/pathways/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content)), NUMBER_OF_PATHWAYS)

    def test_correct_pathway_response(self):
        response = client.get("/api/pathways/")
        self.assertEqual(response.status_code, 200)
        pathway_list = json.loads(response.content)
        self.assertEqual(set(pathway_list[0].keys()), PATHWAY_FIELDS)

    def test_molecule_format_in_pathway_view(self):
        response = client.get("/api/pathways/")
        self.assertEqual(response.status_code, 200)
        molecule_instance_data = json.loads(response.content)[0]["molecule_instances"][0]
        self.assertEqual(set(molecule_instance_data.keys()), MOLECULE_INSTANCE_FIELDS)
        molecule_instance = models.MoleculeInstance.objects.get(id=molecule_instance_data["id"])
        molecule = models.Molecule.objects.get(id=molecule_instance_data["molecule"])
        self.assertEqual(molecule_instance.molecule.id, molecule.id)
        self.assertEqual(molecule.name, example_data.MOLECULE_DATA["name"] + "1")

    def test_enzyme_format_in_pathway_view(self):
        response = client.get("/api/pathways/")
        self.assertEqual(response.status_code, 200)
        enzyme_instance_data = json.loads(response.content)[0]["enzyme_instances"][0]
        self.assertEqual(set(enzyme_instance_data.keys()), ENZYME_INSTANCE_FIELDS)
        enzyme_instance = models.EnzymeInstance.objects.get(id=enzyme_instance_data["id"])
        enzyme = models.Enzyme.objects.get(id=enzyme_instance_data["enzyme"])
        self.assertEqual(enzyme_instance.enzyme.id, enzyme.id)
        self.assertEqual(enzyme.name, example_data.ENZYME_DATA["name"])

    def test_molecule_relations_in_pathway_view(self):
        response = client.get("/api/pathways/")
        self.assertEqual(response.status_code, 200)
        enzyme_instance_data = json.loads(response.content)[0]["enzyme_instances"][0]
        molecule_instances_data = json.loads(response.content)[0]["molecule_instances"]
        self.assertEqual(enzyme_instance_data["substrate_instances"], [molecule_instances_data[0]["id"]])
        self.assertEqual(enzyme_instance_data["product_instances"], [molecule_instances_data[1]["id"]])

    def test_nonpublic_accessibility(self):
        new_user = models.User.objects.create(username="NonpublicPathwayTestUser")
        models.Pathway.objects.create(
            name="private pathway",
            author=new_user,
            public=False
        )
        models.Pathway.objects.create(
            name="public pathway",
            author=new_user,
            public=True
        )

        # users can only view other's public pathways
        response = client.get("/api/pathways/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content)), NUMBER_OF_PATHWAYS + 1) # all of own + 1 public
        pathway_names = [pathway["name"] for pathway in json.loads(response.content)]
        self.assertIn("public pathway", pathway_names)
        self.assertNotIn("private pathway", pathway_names)
    
    def test_permissions(self):
        new_client = APIClient()
        response = new_client.get("/api/pathways/")
        self.assertEqual(response.status_code, 200)
        response = new_client.post("/api/pathways/")
        self.assertEqual(response.status_code, 401)
        response = new_client.put("/api/pathways/1/")
        self.assertEqual(response.status_code, 401)


class MoleculeListViewTest(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        author = models.User.objects.create(username=AUTHOR_NAME)

        for molecule_id in range(NUMBER_OF_MOLECULES):
            models.Molecule.objects.create(
                name=f"m{molecule_id}",
                abbreviation=f"m{molecule_id}",
                author=author,
                public=True
            )

    def setUp(self) -> None:
        self.author = models.User.objects.get(username=AUTHOR_NAME)
        client.force_authenticate(user=self.author)

    def test_view_url_exists_at_desired_location(self):
        response = client.get('/api/molecules/')
        self.assertEqual(response.status_code, 200)

    def test_lists_all_molecules(self):
        response = client.get("/api/molecules/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content)), NUMBER_OF_MOLECULES)

    def test_correct_molecule_response(self):
        response = client.get("/api/molecules/")
        self.assertEqual(response.status_code, 200)
        molecule_list = json.loads(response.content)
        self.assertEqual(set(molecule_list[0].keys()), MOLECULE_FIELDS)

    def test_nonpublic_accessibility(self):
        new_user = models.User.objects.create(username="NonpublicMoleculeTestUser")
        models.Molecule.objects.create(
            name="private molecule",
            abbreviation="private",
            author=new_user,
            public=False
        )
        models.Molecule.objects.create(
            name="public molecule",
            abbreviation="public",
            author=new_user,
            public=True
        )

        # users can only view other's public molecules
        response = client.get("/api/molecules/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content)), NUMBER_OF_MOLECULES + 1) # all of own + 1 public
        molecule_names = [mol["name"] for mol in json.loads(response.content)]
        self.assertIn("public molecule", molecule_names)
        self.assertNotIn("private molecule", molecule_names)

    def test_permissions(self):
        new_client = APIClient()
        response = new_client.get("/api/molecules/")
        self.assertEqual(response.status_code, 200)
        response = new_client.post("/api/molecules/")
        self.assertEqual(response.status_code, 401)
        response = new_client.put("/api/molecules/1/")
        self.assertEqual(response.status_code, 401)
        


class EnzymeListViewTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        author = models.User(username=AUTHOR_NAME)
        author.save()

        for enzyme_id in range(NUMBER_OF_ENZYMES):
            models.Enzyme.objects.create(
                name=f"m{enzyme_id}",
                abbreviation=f"m{enzyme_id}",
                author=author,
                reversible=True
            )

    def setUp(self):
        self.author = models.User.objects.get(username=AUTHOR_NAME)
        client.force_authenticate(user=self.author)

    def test_view_url_exists_at_desired_location(self):
        response = client.get("/api/enzymes/")
        self.assertEqual(response.status_code, 200)

    def test_lists_all_enzymes(self):
        response = client.get("/api/enzymes/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content)), NUMBER_OF_ENZYMES)

    def test_correct_enzyme_response(self):
        response = client.get("/api/enzymes/")
        self.assertEqual(response.status_code, 200)
        enzyme_list = json.loads(response.content)
        self.assertEqual(set(enzyme_list[0].keys()), ENZYME_FIELDS)

    def test_molecule_format_in_enzyme_view(self):
        """
        Within the enzyme list, the related molecules (substrates etc) should only
            contain the id of the molecules
        """
        # create molecules relations to enzyme
        substrate = models.Molecule.objects.create(
                name="substrate",
                abbreviation="s",
                author=self.author
        )
        product = models.Molecule.objects.create(
                name="product",
                abbreviation="p",
                author=self.author
        )
        cofactor = models.Molecule.objects.create(
                name="cofactor",
                abbreviation="c",
                author=self.author
        )

        # add molecules to a new enzyme
        enzyme = models.Enzyme.objects.create(
            name="new enzyme",
            abbreviation="ne",
            author=self.author,
            reversible=True
        )
        enzyme.substrates.add(substrate)
        enzyme.products.add(product)
        enzyme.cofactors.add(cofactor)
        
        # get enzyme list view response
        response = client.get("/api/enzymes/")
        self.assertEqual(response.status_code, 200)
        enzymes = json.loads(response.content)

        # verify the new enzyme's related molecules are formatted correctly
        for enzyme in enzymes:
            if enzyme["name"] == "new enzyme":
                self.assertEqual(enzyme["substrates"], [substrate.id])
                self.assertEqual(enzyme["cofactors"], [cofactor.id])
                self.assertEqual(enzyme["products"], [product.id])

    def test_nonpublic_accessibility(self):
        # create new user/client
        new_user = models.User.objects.create(username="NonpublicEnzymeTestUser")
        models.Enzyme.objects.create(
            name="public enzyme",
            abbreviation="pub",
            author=new_user,
            public=True,
            reversible=True
        )
        models.Enzyme.objects.create(
            name="private enzyme",
            abbreviation="priv",
            author=new_user,
            public=False,
            reversible=True
        )

        # users can only view other's public enzymes
        response = client.get("/api/enzymes/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content)), NUMBER_OF_ENZYMES + 1)
        enzyme_names = [enz["name"] for enz in json.loads(response.content)]
        self.assertIn("public enzyme", enzyme_names)
        self.assertNotIn("private enzyme", enzyme_names)

    def test_permissions(self):
        new_client = APIClient()
        response = new_client.get("/api/enzymes/")
        self.assertEqual(response.status_code, 200)
        response = new_client.post("/api/enzymes/")
        self.assertEqual(response.status_code, 401)
        response = new_client.put("/api/enzymes/1/")
        self.assertEqual(response.status_code, 401)
