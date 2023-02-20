"""
Defines the api functionality by mapping http methods to the associated
    serializers in serializers.py. We are using viewsets instead of plain
    views to ensure CRUD compliance and prevent us from manually having to
    write out each function for POST, GET, PUT, and DELETE methods. Url endpoints
    are mapped to these viewsets in urls.py.
TODO Ensure users can only see public molecules/enzymes/pathways or one's that
    they authored.
"""

from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from django.db.models import Q


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView

from api import serializers, models


class MoleculeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.MoleculeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return models.Molecule.objects.all()
        else:
            return models.Molecule.objects.filter(
                Q(public=True) | Q(author=self.request.user)
            )


class MoleculeInstanceViewSet(viewsets.ModelViewSet):
    queryset = models.MoleculeInstance.objects.all()
    serializer_class = serializers.MoleculeInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]


class EnzymeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.EnzymeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return models.Enzyme.objects.all()
        else:
            return models.Enzyme.objects.filter(
                Q(public=True) | Q(author=self.request.user)
            )


class EnzymeInstanceViewSet(viewsets.ModelViewSet):
    queryset = models.EnzymeInstance.objects.all()
    serializer_class = serializers.EnzymeInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]


class PathwayViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PathwayDetailSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return models.Pathway.objects.all()
        # if self.request.user.is_superuser:
        #     return models.Pathway.objects.all()
        # else:            
        #     return models.Pathway.objects.filter(
        #         Q(public=True) | Q(author=self.request.user)
        #     )

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.PathwayWriteSerializer
        else:
            return serializers.PathwayDetailSerializer
    
    # TODO: stubbed out post method
    def post_pathway(self, request):
        data = request.data


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAdminUser]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.IsAdminUser]



class UserRegistrationView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.TokenObtainPairSerializer
