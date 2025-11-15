# chomeur/views.py
from django.db import transaction
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from core.models import Utilisateur
from .models import Chomeur, ChomeurCompetence, Exploit
from .serializers import ChomeurSerializer, ChomeurCompetenceSerializer, ExploitSerializer


class HelloChomeurView(APIView):
    def get(self, request):
        return Response({"message": "Bienvenue dans le module Chômeur !"})


# ============================================================
# 📝 Fonctions utilitaires
# ============================================================
def get_authenticated_user(request):
    """Renvoie l'utilisateur connecté ou None."""
    return request.user if getattr(request, "user", None) and request.user.is_authenticated else None


# ============================================================
# 💼 CHOMEUR - INSCRIPTION PUBLIQUE
# ============================================================
class InscriptionChomeurView(generics.CreateAPIView):
    """
    Vue publique pour l'inscription des chômeurs.
    Crée automatiquement un utilisateur + profil chômeur.
    """
    queryset = Chomeur.objects.all()
    serializer_class = ChomeurSerializer
    permission_classes = [AllowAny]  # Accessible sans authentification

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            headers = self.get_success_headers(serializer.data)
            return Response({
                'message': 'Inscription réussie ! Vous pouvez maintenant vous connecter.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED, headers=headers)
        except ValidationError as e:
            return Response({
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'errors': {'general': str(e)}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================================
# 💼 CHOMEUR - CRUD (gardez votre code existant)
# ============================================================
class ChomeurListCreateView(generics.ListCreateAPIView):
    queryset = Chomeur.objects.select_related('utilisateur').all()
    serializer_class = ChomeurSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['utilisateur__nom_complet', 'profession', 'code_chomeur']

    @transaction.atomic
    def perform_create(self, serializer):
        creator = get_authenticated_user(self.request)
        serializer.save(created_by=creator)

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
# 🧠 CHOMEUR COMPETENCE (gardez votre code existant)
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
# 🏆 EXPLOIT (gardez votre code existant)
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