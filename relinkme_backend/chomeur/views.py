from django.db import transaction
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from core.models import Utilisateur
from .models import Chomeur, ChomeurCompetence, Exploit
from .serializers import ChomeurSerializer, ChomeurCompetenceSerializer, ExploitSerializer


class HelloChomeurView(APIView):
    def get(self, request):
        return Response({"message": "Bienvenue dans le module Chômeur !"})


# ============================================================
# CHOMEUR
# ============================================================
class ChomeurListCreateView(generics.ListCreateAPIView):
    queryset = Chomeur.objects.all().select_related('utilisateur')
    serializer_class = ChomeurSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        """
        Crée un utilisateur automatiquement si non fourni,
        puis associe le chômeur à cet utilisateur.
        """
        data = self.request.data
        creator = self.request.user if getattr(self.request, 'user', None) and self.request.user.is_authenticated else None

        # --- Cas 1 : utilisateur (id) fourni ---
        utilisateur_id = data.get('utilisateur')
        if utilisateur_id:
            try:
                user = Utilisateur.objects.get(pk=utilisateur_id)
            except Utilisateur.DoesNotExist:
                raise ValidationError({"utilisateur": "Utilisateur introuvable."})
            if hasattr(user, 'profil_chomeur'):
                raise ValidationError({"utilisateur": "Cet utilisateur a déjà un profil chômeur."})
            serializer.save(utilisateur=user, created_by=creator)
            return

        # --- Cas 2 : création automatique d’un utilisateur ---
        email = data.get('email')
        password = data.get('password')
        nom_complet = data.get('nom_complet')

        if not (email and password and nom_complet):
            raise ValidationError("Vous devez fournir 'email', 'password' et 'nom_complet' si 'utilisateur' n'est pas fourni.")

        if Utilisateur.objects.filter(email=email).exists():
            user = Utilisateur.objects.get(email=email)
            if hasattr(user, 'profil_chomeur'):
                raise ValidationError({"email": "Cet email est déjà utilisé par un chômeur existant."})
        else:
            user = Utilisateur.objects.create_user(
                email=email,
                nom_complet=nom_complet,
                password=password,
                role='chomeur'
            )

        serializer.save(utilisateur=user, created_by=creator)

    def perform_update(self, serializer):
        modifier = self.request.user if getattr(self.request, 'user', None) and self.request.user.is_authenticated else None
        serializer.save(modified_by=modifier)


class ChomeurDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chomeur.objects.all().select_related('utilisateur')
    serializer_class = ChomeurSerializer

    def perform_update(self, serializer):
        modifier = self.request.user if getattr(self.request, 'user', None) and self.request.user.is_authenticated else None
        serializer.save(modified_by=modifier)


# ============================================================
# CHOMEUR COMPETENCE
# ============================================================
class ChomeurCompetenceListCreateView(generics.ListCreateAPIView):
    queryset = ChomeurCompetence.objects.all().select_related('chomeur', 'competence')
    serializer_class = ChomeurCompetenceSerializer

    def perform_create(self, serializer):
        creator = self.request.user if getattr(self.request, 'user', None) and self.request.user.is_authenticated else None
        serializer.save(created_by=creator)

    def perform_update(self, serializer):
        modifier = self.request.user if getattr(self.request, 'user', None) and self.request.user.is_authenticated else None
        serializer.save(modified_by=modifier)


class ChomeurCompetenceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChomeurCompetence.objects.all().select_related('chomeur', 'competence')
    serializer_class = ChomeurCompetenceSerializer

    def perform_update(self, serializer):
        modifier = self.request.user if getattr(self.request, 'user', None) and self.request.user.is_authenticated else None
        serializer.save(modified_by=modifier)


# ============================================================
# EXPLOIT
# ============================================================
class ExploitListCreateView(generics.ListCreateAPIView):
    queryset = Exploit.objects.all().select_related('chomeur')
    serializer_class = ExploitSerializer

    def perform_create(self, serializer):
        creator = self.request.user if getattr(self.request, 'user', None) and self.request.user.is_authenticated else None
        serializer.save(created_by=creator)

    def perform_update(self, serializer):
        modifier = self.request.user if getattr(self.request, 'user', None) and self.request.user.is_authenticated else None
        serializer.save(modified_by=modifier)


class ExploitDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exploit.objects.all().select_related('chomeur')
    serializer_class = ExploitSerializer

    def perform_update(self, serializer):
        modifier = self.request.user if getattr(self.request, 'user', None) and self.request.user.is_authenticated else None
        serializer.save(modified_by=modifier)
