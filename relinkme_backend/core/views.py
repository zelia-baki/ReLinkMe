from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Utilisateur
from .serializers import UtilisateurSerializer


class HelloView(APIView):
    def get(self, request):
        return Response({"message": "Backend Django connecté à React 🚀"})


class UtilisateurViewSet(viewsets.ModelViewSet):
    """
    CRUD complet avec interface HTML dans DRF (GET/POST/PUT/DELETE)
    """
    queryset = Utilisateur.objects.all().order_by('-id')
    serializer_class = UtilisateurSerializer
    permission_classes = [AllowAny]