# chomeur/views.py
from django.db import transaction
from rest_framework import generics, status, filters
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
# 🔁 Fonctions utilitaires
# ============================================================
def get_authenticated_user(request):
    """Renvoie l'utilisateur connecté ou None."""
    return request.user if getattr(request, "user", None) and request.user.is_authenticated else None


# ============================================================
# 💼 CHOMEUR
# ============================================================
class ChomeurListCreateView(generics.ListCreateAPIView):
    queryset = Chomeur.objects.select_related('utilisateur').all()
    serializer_class = ChomeurSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['utilisateur__nom_complet', 'profession', 'code_chomeur']

    @transaction.atomic
    def perform_create(self, serializer):
        creator = get_authenticated_user(self.request)
        data = self.request.data

        # --- Cas 1 : utilisateur existant fourni ---
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

        # Vérification d’unicité
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

    def create(self, request, *args, **kwargs):
        """Personnalise la réponse après création."""
        response = super().create(request, *args, **kwargs)
        response.data['message'] = "Chômeur créé avec succès."
        return response


class ChomeurDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chomeur.objects.select_related('utilisateur')
    serializer_class = ChomeurSerializer

    def perform_update(self, serializer):
        modifier = get_authenticated_user(self.request)
        serializer.save(modified_by=modifier)

    def perform_destroy(self, instance):
        instance.delete()


# ============================================================
# 🧠 CHOMEUR COMPETENCE
# ============================================================
class ChomeurCompetenceListCreateView(generics.ListCreateAPIView):
    queryset = ChomeurCompetence.objects.select_related('chomeur', 'competence')
    serializer_class = ChomeurCompetenceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['chomeur__utilisateur__nom_complet', 'competence__libelle']

    @transaction.atomic
    def perform_create(self, serializer):
        creator = get_authenticated_user(self.request)
        serializer.save(created_by=creator)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['message'] = "Compétence ajoutée au chômeur avec succès."
        return response


class ChomeurCompetenceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChomeurCompetence.objects.select_related('chomeur', 'competence')
    serializer_class = ChomeurCompetenceSerializer

    def perform_update(self, serializer):
        modifier = get_authenticated_user(self.request)
        serializer.save(modified_by=modifier)


# ============================================================
# 🏆 EXPLOIT
# ============================================================
class ExploitListCreateView(generics.ListCreateAPIView):
    queryset = Exploit.objects.select_related('chomeur')
    serializer_class = ExploitSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['titre', 'chomeur__utilisateur__nom_complet', 'code_exploit']

    @transaction.atomic
    def perform_create(self, serializer):
        creator = get_authenticated_user(self.request)
        serializer.save(created_by=creator)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['message'] = "Exploit enregistré avec succès."
        return response


class ExploitDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exploit.objects.select_related('chomeur')
    serializer_class = ExploitSerializer

    def perform_update(self, serializer):
        modifier = get_authenticated_user(self.request)
        serializer.save(modified_by=modifier)
