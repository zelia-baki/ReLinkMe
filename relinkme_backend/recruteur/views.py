from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Recruteur, Offre
from .serializers import RecruteurSerializer, OffreSerializer

class RecruteurViewSet(viewsets.ModelViewSet):
    queryset = Recruteur.objects.all()
    serializer_class = RecruteurSerializer
    permission_classes = [permissions.IsAuthenticated]

class OffreViewSet(viewsets.ModelViewSet):
    queryset = Offre.objects.all()
    serializer_class = OffreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Relie automatiquement l'offre au recruteur connecté
        recruteur = self.request.user.profil_recruteur
        serializer.save(recruteur=recruteur)

