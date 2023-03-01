"""
Defines the serializers for serializing models from models.py into json and
    deserialzing json into model objects to store the molecules/enzymes/pathways
    in the db. These serializers are used in views.py to create specify the api
    functions.
TODO Optimize with prefetch_related or select_related https://www.django-rest-framework.org/api-guide/relations/
TODO Should we get author from request instead of trusting the json?
    * https://www.django-rest-framework.org/api-guide/serializers/#passing-additional-attributes-to-save
TODO Remove unused serializers?
TODO More comprehensive validation (write reused validation functions in validators.py)
    * for example: in PathwayWriteSerializer, validate that each EnzymeInstance
        all the SubstrateInstances, ProductInstances, and CofactorInstances of the
        associated Enzyme.
TODO Better comments
TODO Overwrite PathwayWriteSerializer's update(). Also verify the desired output is
    achieved for each endpoints list, detail, etc. For example, pathway list probably
    shouldn't display all the data for each pathway; you should have to go to pathway
    detail for that.
TODO Ensure pathway deletion deletes related PathwayMolecules/PathwayEnzymes
    * Maybe this is handled by 'on_delete=models.CASCADE' in models.py?
"""

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from collections import OrderedDict
from rest_framework import serializers
# from rest_framework.fields import CurrentUserDefault

from api import models, validators


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Group
        fields = [
            "id",
            "name"
        ]
        

class UserSerializer(serializers.ModelSerializer):
    molecules = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    enzymes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    pathways = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = models.User
        fields = [
            "id",
            "username",
            "molecules",
            "enzymes",
            "pathways",
            "password"
        ]
    
    def create(self, validated_data):
        user = models.User(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class MoleculeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Molecule
        fields = "__all__"


class MoleculeInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MoleculeInstance
        fields = "__all__"


class MoleculeInstanceDetailSerializer(serializers.ModelSerializer):
    molecule_name = serializers.ReadOnlyField(source="molecule.name")
    abbreviation = serializers.ReadOnlyField(source="molecule.abbreviation")
    ball_and_stick_image = serializers.CharField(source="molecule.ball_and_stick_image")
    space_filling_image = serializers.CharField(source="molecule.space_filling_image")
    link = serializers.ReadOnlyField(source="molecule.link")
    author = serializers.ReadOnlyField(source="molecule.author.id")
    public = serializers.ReadOnlyField(source="molecule.public")

    class Meta:
        model = models.MoleculeInstance
        fields = "__all__"


class EnzymeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Enzyme
        fields = "__all__"


class EnzymeInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EnzymeInstance
        fields = "__all__"


class EnzymeInstanceDetailSerializer(serializers.ModelSerializer):
    """
    note that substrate, product, cofactor aren't defined here. this is because
        we want it to display the ones from EnzymeInstance, not Enzyme.
    """
    name = serializers.ReadOnlyField(source="enzyme.name")
    abbreviation = serializers.ReadOnlyField(source="enzyme.abbreviation")
    image = serializers.CharField(
        source="enzyme.image"
    )
    reversible = serializers.ReadOnlyField(source="enzyme.reversible")
    link = serializers.ReadOnlyField(source="enzyme.link")
    author = serializers.ReadOnlyField(source="enzyme.author.id")
    public = serializers.ReadOnlyField(source="enzyme.public")
    
    class Meta:
        model = models.EnzymeInstance
        fields = "__all__"


class PathwayBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Pathway
        fields = "__all__"


class PathwayDetailSerializer(serializers.ModelSerializer):
    enzyme_instances = EnzymeInstanceDetailSerializer(
        many=True
    )
    molecule_instances = MoleculeInstanceDetailSerializer(
        many=True
    )
    
    class Meta:
        model = models.Pathway
        fields = "__all__"


class MoleculeInstanceWriteSerializer(serializers.Serializer):
    """
    This serializer isn't used as of now. The pathway write serializer is handling
        the deserialization and creation of enzyme/molecule instances
    """
    molecule = serializers.IntegerField()
    pathway = serializers.IntegerField()
    x = serializers.IntegerField(min_value=0)
    y = serializers.IntegerField(min_value=0)

    def validate_molecule(self, value: int) -> models.Molecule:
        molecule = models.Molecule.objects.filter(id=value)
        if not molecule.exists():
            raise serializers.ValidationError(f"Molecule with id='{value}' does not exist")
        return molecule.first()

    def validate_pathway(self, value: int) -> models.Pathway:
        pathway = models.Pathway.objects.filter(id=value)
        if not pathway.exists():
            raise serializers.ValidationError(f"Pathway with id='{value}' does not exist")
        return pathway.first()

    def validate(self, data: OrderedDict) -> OrderedDict:
        molecule = models.Molecule.objects.get(id=data.get("molecule"))
        pathway = models.Pathway.objects.get(id=data.get("pathway"))
        if (not molecule.public) and pathway.public:
            raise serializers.ValidationError(f"Public pathways can't have private molecules")
        return data
    
    def create(self, validated_data: OrderedDict) -> models.MoleculeInstance:
        return models.MoleculeInstance.objects.create(**validated_data)

    def update(self, instance: models.MoleculeInstance, validated_data: OrderedDict) -> models.MoleculeInstance:
        if validated_data.get("pathway") != instance.pathway:
            raise serializers.ValidationError("Can't change MoleculeInstance to new pathway")
        instance.molecule = validated_data.get("molecule", instance.molecule)
        instance.x = validated_data.get("x", instance.x)
        instance.y = validated_data.get("y", instance.y)
        instance.save()
        return instance


class IntegerListField(serializers.ListField):
    child = serializers.IntegerField()


class EnzymeInstanceWriteSerializer(serializers.Serializer):
    """
    This serializer isn't used as of now. The pathway write serializer is handling
        the deserialization and creation of enzyme/molecule instances
    """
    enzyme = serializers.IntegerField()
    pathway = serializers.IntegerField()
    x = serializers.IntegerField(min_value=0)
    y = serializers.IntegerField(min_value=0)
    limiting = serializers.BooleanField()
    substrate_instances = IntegerListField()
    product_instances = IntegerListField()
    cofactor_instances = IntegerListField()

    def validate_enzyme(self, value: int) -> models.Enzyme:
        enzyme = models.Enzyme.objects.filter(id=value)
        if not enzyme.exists():
            raise serializers.ValidationError(f"Enzyme with id='{value}' does not exist")
        return enzyme.first()

    def validate_pathway(self, value: int) -> models.Pathway:
        pathway = models.Pathway.objects.filter(id=value)
        if not pathway.exists():
            raise serializers.ValidationError(f"Pathway with id='{value}' does not exist")
        return pathway.first()
    
    def validate(self, data: OrderedDict) -> OrderedDict:
        """
        First, ensure only public enzymes appear in public pathways
        Then, ensure the substrate_instances, product_instances, and cofactor_instances
            are instances of the enzymes actual substrates, products, and cofactors
        """
        enzyme = models.Enzyme.objects.get(id=data.get("id"))
        pathway = models.Pathway.objects.get(id=data.get("pathway"))
        if (not enzyme.public) and pathway.public:
            raise serializers.ValidationError(f"Public pathways can't have private enzymes")
        
        actual_substrates = enzyme.substrates.all()
        actual_products = enzyme.products.all()
        actual_cofactors = enzyme.cofactors.all()

        for substrate_instance_id in data.get("substrate_instances"):
            substrate_instance = models.MoleculeInstance.objects.get(id=substrate_instance_id)
            if substrate_instance.molecule not in actual_substrates:
                raise serializers.ValidationError(f"{substrate_instance} isn't an instance of any of the substrates of {enzyme}")
        
        for product_instance_id in data.get("product_instances"):
            product_instance = models.MoleculeInstance.objects.get(id=product_instance_id)
            if product_instance.molecule not in actual_products:
                raise serializers.ValidationError(f"{product_instance} isn't an instance of any of the products of {enzyme}")

        for cofactor_instance_id in data.get("cofactor_instances"):
            cofactor_instance = models.MoleculeInstance.objects.get(id=cofactor_instance_id)
            if cofactor_instance.molecule not in actual_cofactors:
                raise serializers.ValidationError(f"{cofactor_instance} isn't an instance of any of the cofactors of {enzyme}")

        return data

    def create(self, validated_data: OrderedDict) -> models.EnzymeInstance:
        substrate_instances = [models.MoleculeInstance.objects.get(id=val) for val in validated_data.pop("substrate_instances")]
        product_instances =  [models.MoleculeInstance.objects.get(id=val) for val in validated_data.pop("product_instances")]
        cofactor_instances =  [models.MoleculeInstance.objects.get(id=val) for val in validated_data.pop("cofactor_instances")]

        enzyme_instance = models.EnzymeInstance.objects.create(**validated_data)
        enzyme_instance.substrate_instances.add(*substrate_instances)
        enzyme_instance.product_instances.add(*product_instances)
        enzyme_instance.cofactor_instances.add(*cofactor_instances)
        
        return enzyme_instance

    def update(self, instance: models.EnzymeInstance, validated_data: OrderedDict) -> models.EnzymeInstance:
        if validated_data.get("pathway") != instance.pathway:
            raise serializers.ValidationError("Can't change EnzymeInstance to new pathway")
        
        instance.enzyme = validated_data.get("enzyme", instance.enzyme)
        instance.x = validated_data.get("x", instance.x)
        instance.y = validated_data.get("y", instance.y)
        instance.limiting = validated_data.get("limiting", instance.limiting)

        instance.substrate_instances.clear()
        instance.product_instances.clear()
        instance.cofactor_instances.clear()

        substrate_instances = [models.MoleculeInstance.objects.get(id=val) for val in validated_data.get("substrate_instances")]
        product_instances =  [models.MoleculeInstance.objects.get(id=val) for val in validated_data.get("product_instances")]
        cofactor_instances =  [models.MoleculeInstance.objects.get(id=val) for val in validated_data.get("cofactor_instances")]

        instance.substrate_instances.add(*substrate_instances)
        instance.product_instances.add(*product_instances)
        instance.cofactor_instances.add(*cofactor_instances)

        instance.save()
        return instance


class MoleculeInstanceHelperSerializer(serializers.Serializer):
    temp_id = serializers.IntegerField(write_only=True)
    molecule = serializers.PrimaryKeyRelatedField(queryset=models.Molecule.objects.all())
    x = serializers.IntegerField(min_value=0)
    y = serializers.IntegerField(min_value=0)

    # def validate_molecule(self, value: int) -> models.Molecule:
    #     molecule = models.Molecule.objects.filter(id=value)
    #     if not molecule.exists():
    #         raise serializers.ValidationError(f"Molecule with id='{value}' does not exist")
    #     return value


class EnzymeInstanceHelperSerializer(serializers.Serializer):
    enzyme = serializers.PrimaryKeyRelatedField(queryset=models.Enzyme.objects.all())
    x = serializers.IntegerField(min_value=0)
    y = serializers.IntegerField(min_value=0)
    limiting = serializers.BooleanField()
    substrate_instances = IntegerListField()
    product_instances = IntegerListField()
    cofactor_instances = IntegerListField()

    # def validate_enzyme(self, value: int) -> models.Enzyme:
    #     enzyme = models.Enzyme.objects.filter(id=value)
    #     if not enzyme.exists():
    #         raise serializers.ValidationError(f"Enzyme with id='{value}' does not exist")
    #     return value


class PathwayWriteSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(
        write_only=False, #True,
        min_length=1,
        max_length=50
    )
    author = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(),
        write_only=True
    )
    link = serializers.URLField(required=False, write_only=True)
    public = serializers.BooleanField(write_only=True)
    molecule_instances = MoleculeInstanceHelperSerializer(many=True, write_only=True)
    enzyme_instances = EnzymeInstanceHelperSerializer(many=True, write_only=True)

    def validate(self, data: OrderedDict) -> OrderedDict:
        molecule_instances = data.get("molecule_instances")
        molecule_instance_temp_ids = [instance["temp_id"] for instance in molecule_instances]
        
        # validate molecule instances have unique temp_ids
        molecule_instance_temp_ids_set = set(molecule_instance_temp_ids)
        if len(molecule_instance_temp_ids) != len(molecule_instance_temp_ids_set):
            raise serializers.ValidationError("temp_id must be unique")
        
        # validate all enzymes have > 0 substrates & products
        # validate all substrates, products, cofactors are temp_ids from molecule_instance_set
        enzyme_instances = data.get("enzyme_instances")
        for enzyme_instance in enzyme_instances:
            if len(enzyme_instance["substrate_instances"]) < 1 or len(enzyme_instance["product_instances"]) < 1:
                raise serializers.ValidationError("All enzymes need at least one substrate and product")
            for substrate_instance in enzyme_instance["substrate_instances"]:
                if substrate_instance not in molecule_instance_temp_ids_set:
                    raise serializers.ValidationError("substrate_instances must be a temp_id in molecule_instances")
            for product_instance in enzyme_instance["product_instances"]:
                if product_instance not in molecule_instance_temp_ids_set:
                    raise serializers.ValidationError("product_instances must be a temp_id in molecule_instances")
            for cofactor_instance in enzyme_instance["cofactor_instances"]:
                if cofactor_instance not in molecule_instance_temp_ids_set:
                    raise serializers.ValidationError("cofactor_instances must be a temp_id in molecule_instances")

        # map temp_id -> molecule
        molecule_map = {}
        for molecule_instance in molecule_instances:
            temp_id = molecule_instance["temp_id"]
            molecule_map[temp_id] = molecule_instance["molecule"]

        # validate enzymes have correct substrates, products, enzymes
        for enzyme_instance in enzyme_instances:
            enzyme = enzyme_instance.get("enzyme")
            substrates = [molecule_map[temp_id] for temp_id in enzyme_instance["substrate_instances"]]
            products = [molecule_map[temp_id] for temp_id in enzyme_instance["product_instances"]]
            cofactors = [molecule_map[temp_id] for temp_id in enzyme_instance["cofactor_instances"]]
            for substrate in substrates:
                if substrate.id not in {substrate.id for substrate in enzyme.substrates.all()}:
                    raise serializers.ValidationError("substrate_instance must be a substrate of the enzyme")
            for product in products:
                if product.id not in {product.id for product in enzyme.products.all()}:
                    raise serializers.ValidationError("product_instance must be a product of the enzyme")
            for cofactor in cofactors:
                if cofactor.id not in {cofactor.id for cofactor in enzyme.cofactors.all()}:
                    raise serializers.ValidationError("cofactor_instance must be a cofactor of the enzyme")

        return data
    
    def create(self, validated_data: OrderedDict) -> models.Pathway:
        molecule_instances_data = validated_data.pop("molecule_instances")
        enzyme_instances_data = validated_data.pop("enzyme_instances")

        # create pathway
        pathway = models.Pathway.objects.create(**validated_data)

        # map temp_id -> instance
        molecule_instances = {}

        # create molecule instances
        for molecule_instance_data in molecule_instances_data:
            temp_id = molecule_instance_data.pop("temp_id")
            molecule_instance = models.MoleculeInstance.objects.create(
                pathway=pathway,
                **molecule_instance_data
            )
            molecule_instances[temp_id] = molecule_instance

        # create enzyme instances
        for enzyme_instance_data in enzyme_instances_data:
            substrate_temp_ids = enzyme_instance_data.pop("substrate_instances")
            product_temp_ids = enzyme_instance_data.pop("product_instances")
            cofactor_temp_ids = enzyme_instance_data.pop("cofactor_instances")
            substrate_instances = [molecule_instances[temp_id] for temp_id in substrate_temp_ids]
            product_instances = [molecule_instances[temp_id] for temp_id in product_temp_ids]
            cofactor_instances = [molecule_instances[temp_id] for temp_id in cofactor_temp_ids]
            enzyme_instance = models.EnzymeInstance.objects.create(
                pathway=pathway,
                **enzyme_instance_data
            )
            enzyme_instance.substrate_instances.add(*substrate_instances)
            enzyme_instance.product_instances.add(*product_instances)
            enzyme_instance.cofactor_instances.add(*cofactor_instances)

        return pathway


class TokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data