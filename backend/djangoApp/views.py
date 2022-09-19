#from msilib import schema
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, JsonResponse
from models import Pathway, Module, Products, Substrates
from serializers import PathwaySerializer, ModuleSerializer, ProductsSerializer, SubstratesSerializer
from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer

from . import serializers



# Create your views here.
# Default test view
def index(request):
      return HttpResponse("Hello world from django backend")

class PathWayViewSet(viewsets.ModelViewSet):
      '''
      This class is used to either list or retrieve objects stored in the database using
      the Pathway model. This class can also be expanded to add in other functionalities
      such as create, update, partial_update, or destory:
      Ref: https://www.django-rest-framework.org/api-guide/viewsets/
      '''
      queryset = Pathway.objects.all()
      serializer_class = PathwaySerializer

      # Note: safe=False is needed in order for non-dict objects to be serialized
      def list(self, request):
            #Returns all Pathway objects in the pathways table
            serializer = PathwaySerializer(self.queryset, many=True)
            return JsonResponse(serializer.data, safe=False)

      def retrieve(self, request, pk=None):
            # Searches the queryset for the object with matching ID (pk), if not found
            # the reponse returns a 404
            pathway = get_object_or_404(self.queryset, pk=pk)
            serializer = PathwaySerializer(pathway)
            return JsonResponse(serializer.data, safe=False)

class ModuleViewSet(viewsets.ModelViewSet):
      '''
      This class is used to either list or retrieve objects stored in the database using
      the Module model. This class can also be expanded to add in other functionalities
      such as create, update, partial_update, or destory:
      Ref: https://www.django-rest-framework.org/api-guide/viewsets/
      '''
      queryset = Module.objects.all()
      serializer_class = ModuleSerializer

      # Note: safe=False is needed in order for non-dict objects to be serialized
      def list(self, request):
            #Returns all Module objects in the modules table
            serializer = ModuleSerializer(self.queryset, many=True)
            return JsonResponse(serializer.data, safe=False)

      def retrieve(self, request, pk=None):
            # Searches the queryset for the object with matching ID (pk), if not found
            # the reponse returns a 404
            module = get_object_or_404(self.queryset, pk=pk)
            serializer = ModuleSerializer(module)
            return JsonResponse(serializer.data, safe=False)
class ProductsViewSet(viewsets.ModelViewSet):
      '''
      This class is used to either list or retrieve objects stored in the database using
      the Products model. This class can also be expanded to add in other functionalities
      such as create, update, partial_update, or destory:
      Ref: https://www.django-rest-framework.org/api-guide/viewsets/
      '''
      queryset = Products.objects.all()
      serializer_class = ProductsSerializer

      # Note: safe=False is needed in order for non-dict objects to be serialized
      def list(self, request):
            #Returns all Products objects in the products table
            serializer = ProductsSerializer(self.queryset, many=True)
            return JsonResponse(serializer.data, safe=False)

      def retrieve(self, request, pk=None):
            # Searches the queryset for the object with matching ID (pk), if not found
            # the reponse returns a 404
            product = get_object_or_404(self.queryset, pk=pk)
            serializer = ProductsSerializer(product)
            return JsonResponse(serializer.data, safe=False)

class SubstratesViewSet(viewsets.ModelViewSet):
      '''
      This class is used to either list or retrieve objects stored in the database using
      the Substrates model. This class can also be expanded to add in other functionalities
      such as create, update, partial_update, or destory:
      Ref: https://www.django-rest-framework.org/api-guide/viewsets/
      '''
      queryset = Substrates.objects.all()
      serializer_class = SubstratesSerializer

      def list(self, request):
            #Returns all Substrate objects in the subtrates table
            serializer = Substrates.Serializer(self.queryset, many=True)
            return JsonResponse(serializer.data, safe=False)

      def retrieve(self, request, pk=None):
            # Searches the queryset for the object with matching ID (pk), if not found
            # the reponse returns a 404
            substrate = get_object_or_404(self.queryset, pk=pk)
            serializer = SubstratesSerializer(substrate)
            return JsonResponse(serializer.data, safe=False)
      # Note: safe=False is needed in order for non-dict objects to be serialized


# Error handling for API's



# These views are used for API documentation
class PathwayList(generics.ListCreateAPIView):
      queryset = Pathway.objects.all()
      serializer_class = PathwaySerializer

class PathwayDetail(generics.RetrieveUpdateDestroyAPIView):
      queryset = Pathway.objects.all()
      serializer_class = PathwaySerializer

class SubstratesList(generics.ListCreateAPIView):
      queryset = Substrates.objects.all()
      serializer_class = SubstratesSerializer

class SubstratesDetail(generics.RetrieveUpdateDestroyAPIView):
      queryset = Substrates.objects.all()
      serializer_class = SubstratesSerializer