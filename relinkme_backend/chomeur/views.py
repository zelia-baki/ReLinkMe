# chomeur/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction

from .models import Chomeur, ChomeurCompetence, Exploit
from .serializers import (
    ChomeurSerializer,
    ChomeurCompetenceSerializer,
    ExploitSerializer,
)
from core.models import Competence, Candidature
from core.serializers import CandidatureListSerializer


# ============================================================
# HELLO
# ============================================================
class HelloChomeurView(APIView):
    def get(self, request):
        return Response({"message": "App Chomeur OK ✅"})


# ============================================================
# INSCRIPTION PUBLIQUE (sans auth)
# ============================================================
class InscriptionChomeurView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ChomeurSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            chomeur = serializer.save()
            return Response({
                "message": "Inscription réussie",
                "chomeur": ChomeurSerializer(chomeur, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# PROFIL COMPLET DU CHÔMEUR CONNECTÉ
# ============================================================
class ProfilChomeurView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retourne le profil complet avec compétences, exploits, candidatures et statistiques"""
        try:
            chomeur = request.user.profil_chomeur
        except Exception:
            return Response(
                {"error": "Profil chômeur introuvable pour cet utilisateur"},
                status=status.HTTP_404_NOT_FOUND
            )

        utilisateur = request.user

        # Compétences
        competences = ChomeurCompetence.objects.filter(chomeur=chomeur).select_related('competence')
        competences_data = ChomeurCompetenceSerializer(competences, many=True).data

        # Exploits
        exploits = Exploit.objects.filter(chomeur=chomeur).order_by('-date_publication')
        exploits_data = ExploitSerializer(exploits, many=True).data

        # Candidatures (5 dernières)
        candidatures = Candidature.objects.filter(chomeur=chomeur).select_related(
            'offre__recruteur'
        ).order_by('-date_postulation')[:5]
        candidatures_data = CandidatureListSerializer(candidatures, many=True).data

        # Statistiques
        all_candidatures = Candidature.objects.filter(chomeur=chomeur)
        statistiques = {
            'total_competences': competences.count(),
            'total_exploits': exploits.count(),
            'total_candidatures': all_candidatures.count(),
        }

        # Profil complet avec les données utilisateur imbriquées
        profil_data = ChomeurSerializer(chomeur, context={'request': request}).data
        profil_data['utilisateur'] = {
            'id': utilisateur.id,
            'nom_complet': utilisateur.nom_complet,
            'email': utilisateur.email,
            'telephone': utilisateur.telephone or '',
            'localisation': utilisateur.localisation or '',
            'photo_profil': utilisateur.photo_profil or '',
            'role': utilisateur.role,
            'date_inscription': str(utilisateur.date_inscription),
        }

        return Response({
            "profil": profil_data,
            "competences": competences_data,
            "exploits": exploits_data,
            "candidatures": candidatures_data,
            "statistiques": statistiques,
        })

    def patch(self, request):
        """Mise à jour du profil chômeur (profession, description, niveau_expertise)
           + champs utilisateur (nom_complet, telephone, localisation)"""
        try:
            chomeur = request.user.profil_chomeur
        except Exception:
            return Response(
                {"error": "Profil chômeur introuvable"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Champs Utilisateur modifiables
        utilisateur = request.user
        user_fields = ['nom_complet', 'telephone', 'localisation']
        for field in user_fields:
            if field in request.data:
                setattr(utilisateur, field, request.data[field])
        utilisateur.save(update_fields=[f for f in user_fields if f in request.data] or ['updated_at'])

        # Champs Chomeur modifiables
        chomeur_fields = ['profession', 'description', 'niveau_expertise']
        for field in chomeur_fields:
            if field in request.data:
                setattr(chomeur, field, request.data[field])
        chomeur.save()

        return Response({
            "message": "Profil mis à jour avec succès",
            "profil": ChomeurSerializer(chomeur, context={'request': request}).data
        })


# ============================================================
# CRUD CHOMEUR (admin)
# ============================================================
class ChomeurListCreateView(generics.ListCreateAPIView):
    queryset = Chomeur.objects.all().select_related('utilisateur')
    serializer_class = ChomeurSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ChomeurDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chomeur.objects.all()
    serializer_class = ChomeurSerializer

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)


# ============================================================
# COMPÉTENCES DU CHÔMEUR CONNECTÉ
# ============================================================
class MesCompetencesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chomeur = request.user.profil_chomeur
        competences = ChomeurCompetence.objects.filter(chomeur=chomeur).select_related('competence')
        return Response(ChomeurCompetenceSerializer(competences, many=True).data)

    def post(self, request):
        """Ajouter UNE compétence"""
        try:
            chomeur = request.user.profil_chomeur
        except Exception:
            return Response({"error": "Profil chômeur introuvable"}, status=404)

        # Vérifier la limite de 20
        if ChomeurCompetence.objects.filter(chomeur=chomeur).count() >= 20:
            return Response(
                {"error": "Limite de 20 compétences atteinte"},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data.copy()
        data['chomeur'] = chomeur.id
        serializer = ChomeurCompetenceSerializer(data=data)
        if serializer.is_valid():
            serializer.save(chomeur=chomeur, created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# BULK COMPÉTENCES
# ============================================================
class BulkCompetencesView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        """Ajouter plusieurs compétences en une seule requête"""
        try:
            chomeur = request.user.profil_chomeur
        except Exception:
            return Response({"error": "Profil chômeur introuvable"}, status=404)

        competences_data = request.data.get('competences', [])
        if not competences_data:
            return Response({"error": "Aucune compétence fournie"}, status=400)

        current_count = ChomeurCompetence.objects.filter(chomeur=chomeur).count()
        remaining = 20 - current_count

        if remaining <= 0:
            return Response({"error": "Limite de 20 compétences atteinte"}, status=400)

        # Limiter au nombre de places restantes
        competences_data = competences_data[:remaining]

        created = []
        errors = []

        for comp_data in competences_data:
            comp_id = comp_data.get('competence')
            niveau = comp_data.get('niveau_maitrise', 'intermédiaire')

            try:
                competence = Competence.objects.get(id=comp_id)
                # Vérifier que la compétence n'existe pas déjà
                if ChomeurCompetence.objects.filter(chomeur=chomeur, competence=competence).exists():
                    errors.append(f"Compétence '{competence.libelle}' déjà ajoutée")
                    continue

                cc = ChomeurCompetence.objects.create(
                    chomeur=chomeur,
                    competence=competence,
                    niveau_maitrise=niveau,
                    created_by=request.user
                )
                created.append(ChomeurCompetenceSerializer(cc).data)
            except Competence.DoesNotExist:
                errors.append(f"Compétence ID {comp_id} introuvable")

        return Response({
            "message": f"{len(created)} compétence(s) ajoutée(s)",
            "created": created,
            "errors": errors
        }, status=status.HTTP_201_CREATED)


class BulkDeleteCompetencesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Supprimer plusieurs compétences"""
        try:
            chomeur = request.user.profil_chomeur
        except Exception:
            return Response({"error": "Profil chômeur introuvable"}, status=404)

        ids = request.data.get('ids', [])
        if not ids:
            return Response({"error": "Aucun ID fourni"}, status=400)

        deleted_count, _ = ChomeurCompetence.objects.filter(
            chomeur=chomeur, id__in=ids
        ).delete()

        return Response({
            "message": f"{deleted_count} compétence(s) supprimée(s)",
            "deleted_count": deleted_count
        })


# ============================================================
# CRUD COMPÉTENCES INDIVIDUELLES
# ============================================================
class ChomeurCompetenceListCreateView(generics.ListCreateAPIView):
    serializer_class = ChomeurCompetenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChomeurCompetence.objects.filter(
            chomeur=self.request.user.profil_chomeur
        ).select_related('competence')

    def perform_create(self, serializer):
        chomeur = self.request.user.profil_chomeur
        serializer.save(chomeur=chomeur, created_by=self.request.user)


class ChomeurCompetenceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChomeurCompetenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            return ChomeurCompetence.objects.filter(
                chomeur=self.request.user.profil_chomeur
            )
        except Exception:
            return ChomeurCompetence.objects.none()

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)


# ============================================================
# EXPLOITS DU CHÔMEUR CONNECTÉ
# ============================================================
class MesExploitsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chomeur = request.user.profil_chomeur
        exploits = Exploit.objects.filter(chomeur=chomeur).order_by('-date_publication')
        return Response(ExploitSerializer(exploits, many=True).data)

    def post(self, request):
        try:
            chomeur = request.user.profil_chomeur
        except Exception:
            return Response({"error": "Profil chômeur introuvable"}, status=404)

        serializer = ExploitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(chomeur=chomeur, created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# CRUD EXPLOITS INDIVIDUELS
# ============================================================
class ExploitListCreateView(generics.ListCreateAPIView):
    serializer_class = ExploitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            return Exploit.objects.filter(
                chomeur=self.request.user.profil_chomeur
            ).order_by('-date_publication')
        except Exception:
            return Exploit.objects.none()

    def perform_create(self, serializer):
        chomeur = self.request.user.profil_chomeur
        serializer.save(chomeur=chomeur, created_by=self.request.user)


class ExploitDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExploitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            return Exploit.objects.filter(
                chomeur=self.request.user.profil_chomeur
            )
        except Exception:
            return Exploit.objects.none()

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)