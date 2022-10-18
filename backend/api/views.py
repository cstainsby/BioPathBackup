from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import serializers, models


# Create your views here.
def index(request):
    return HttpResponse(content="Hello, world.")


# @api_view(['GET', 'PUT', 'DELETE'])
# def enzyme_detail(request, pk):
#     """
#     Retrieve, update or delete a code snippet.
#     """
#     try:
#         enzyme = models.Enzyme.objects.get(pk=pk)
#     except models.Enzyme.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = serializers.EnzymeSerializer(enzyme)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = serializers.EnzymeSerializer(enzyme, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         enzyme.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


# @api_view(['GET', 'POST'])
# def enzyme_list(request):
#     """
#     List all code enzymes, or create a new enzyme.
#     """
#     if request.method == 'GET':
#         enzymes = models.Enzyme.objects.all()
#         serializer = serializers.EnzymeSerializer(enzymes, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = serializers.EnzymeSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EnzymeViewSet(viewsets.ModelViewSet):
    queryset = models.Enzyme.objects.all()
    serializer_class = serializers.EnzymeSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubstrateViewSet(viewsets.ModelViewSet):
    queryset = models.Substrate.objects.all()
    serializer_class = serializers.SubstrateSerializer
    permission_classes = [permissions.IsAuthenticated]

class EnzymeSubstrateViewSet(viewsets.ModelViewSet):
    queryset = models.EnzymeSubstrate.objects.all()
    serializer_class = serializers.EnzymeSubstrateSerializer
    permission_classes = [permissions.IsAuthenticated]

class PathwayConnectionsViewSet(viewsets.ModelViewSet):
    queryset = models.PathwayConnections.objects.all()
    serializer_class = serializers.PathwayConnectionsSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.IsAuthenticated]