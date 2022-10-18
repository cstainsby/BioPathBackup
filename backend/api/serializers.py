from django.contrib.auth.models import User, Group
from rest_framework import serializers
from api.models import Enzyme, Substrate, EnzymeSubstrate, PathwayConnections


class EnzymeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enzyme
        fields = ['name', 'reversible', 'image']

class SubstrateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Substrate
        fields = ['name', 'image']

class EnzymeSubstrateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnzymeSubstrate
        fields = ['enzyme', 'substrate', 'substrate_type', 'focus']

class PathwayConnectionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PathwayConnections
        fields = ['pathway', 'enzyme_from', 'enzyme_to', 'substrate']



class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']