# chomeur/views.py
from django.db import transaction
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated  # ✅ Ajoutez IsAuthenticated
from core.models import Utilisateur
from .models import Chomeur, ChomeurCompetence, Exploit
from .serializers import ChomeurSerializer, ChomeurCompetenceSerializer, ExploitSerializer
from rest_framework.decorators import action


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
        
        
# Ajoutez ces imports en haut du fichier
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from core.models import Candidature, Evaluation
# chomeur/views.py

# ============================================================
# 📊 PROFIL COMPLET DU CHÔMEUR CONNECTÉ
# ============================================================
class ProfilChomeurView(APIView):
    """
    Récupère le profil complet du chômeur connecté avec toutes ses données
    GET /chomeur/mon-profil/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Récupérer le profil du chômeur connecté
            chomeur = Chomeur.objects.select_related('utilisateur').get(
                utilisateur=request.user
            )
            
            # Sérialiser les données principales
            chomeur_data = ChomeurSerializer(chomeur).data
            
            # Ajouter les compétences
            competences = ChomeurCompetence.objects.filter(
                chomeur=chomeur
            ).select_related('competence')
            competences_data = ChomeurCompetenceSerializer(competences, many=True).data
            
            # Ajouter les exploits
            exploits = Exploit.objects.filter(chomeur=chomeur).order_by('-date_publication')
            exploits_data = ExploitSerializer(exploits, many=True).data
            
            # Ajouter les candidatures
            from core.models import Candidature
            candidatures = Candidature.objects.filter(
                chomeur=chomeur
            ).select_related('offre', 'offre__recruteur').order_by('-date_postulation')
            
            candidatures_data = []
            for cand in candidatures:
                candidatures_data.append({
                    'id': cand.id,
                    'code_candidature': cand.code_candidature,
                    'offre': {
                        'id': cand.offre.id,
                        'titre': cand.offre.titre,
                        'entreprise': cand.offre.recruteur.nom_entreprise or cand.offre.recruteur.utilisateur.nom_complet,
                        'type_contrat': cand.offre.type_contrat
                    },
                    'statut': cand.statut,
                    'date_postulation': cand.date_postulation,
                    'jetons_utilises': cand.jetons_utilises,
                    'lettre_motivation': cand.lettre_motivation,
                    'cv_fichier': cand.cv_fichier
                })
            
            # Calculer les statistiques
            total_candidatures = candidatures.count()
            candidatures_acceptees = candidatures.filter(statut='acceptee').count()
            candidatures_entretien = candidatures.filter(statut='entretien').count()
            
            taux_reussite = 0
            if total_candidatures > 0:
                taux_reussite = (candidatures_acceptees / total_candidatures * 100)
            
            # Récupérer la note moyenne des évaluations
            from core.models import Evaluation
            from django.db.models import Avg
            
            evaluations = Evaluation.objects.filter(
                chomeur=chomeur,
                type_evaluation='recruteur_vers_chomeur'
            )
            note_moyenne = evaluations.aggregate(Avg('note'))['note__avg'] or 0
            
            statistiques = {
                'candidatures_total': total_candidatures,
                'candidatures_acceptees': candidatures_acceptees,
                'candidatures_entretien': candidatures_entretien,
                'candidatures_refusees': candidatures.filter(statut='refusee').count(),
                'candidatures_en_attente': candidatures.filter(statut='en_attente').count(),
                'taux_reussite': round(taux_reussite, 1),
                'note_moyenne': round(float(note_moyenne), 1),
                'exploits_publies': exploits.filter(visible=True).count(),
                'exploits_total': exploits.count(),
                'competences_total': competences.count()
            }
            
            return Response({
                'profil': chomeur_data,
                'competences': competences_data,
                'exploits': exploits_data,
                'candidatures': candidatures_data,
                'statistiques': statistiques
            }, status=status.HTTP_200_OK)
            
        except Chomeur.DoesNotExist:
            return Response({
                'errors': {'general': 'Profil chômeur non trouvé pour cet utilisateur'}
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'errors': {'general': str(e)}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================================
# 🎯 COMPÉTENCES DU CHÔMEUR CONNECTÉ
# ============================================================
# Ajoutez ces imports en haut
from rest_framework.decorators import action

# Modifiez la classe MesCompetencesView
class MesCompetencesView(generics.ListCreateAPIView):
    """
    Liste et ajoute des compétences pour le chômeur connecté
    """
    serializer_class = ChomeurCompetenceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['competence__libelle', 'competence__categorie', 'niveau_maitrise']
    
    # 🔹 Limite maximale
    MAX_COMPETENCES = 20
    
    def get_queryset(self):
        try:
            chomeur = Chomeur.objects.get(utilisateur=self.request.user)
            return ChomeurCompetence.objects.filter(
                chomeur=chomeur
            ).select_related('competence').order_by('-created_at')
        except Chomeur.DoesNotExist:
            return ChomeurCompetence.objects.none()
    
    @transaction.atomic
    def perform_create(self, serializer):
        try:
            chomeur = Chomeur.objects.get(utilisateur=self.request.user)
            
            # ✅ Vérifier la limite
            current_count = ChomeurCompetence.objects.filter(chomeur=chomeur).count()
            if current_count >= self.MAX_COMPETENCES:
                raise ValidationError({
                    "general": f"Limite de {self.MAX_COMPETENCES} compétences atteinte"
                })
            
            serializer.save(chomeur=chomeur, created_by=self.request.user)
        except Chomeur.DoesNotExist:
            raise ValidationError({"general": "Profil chômeur non trouvé"})
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['message'] = "Compétence ajoutée avec succès."
        return response


# 🆕 Ajoutez cette nouvelle vue pour l'ajout en masse
class BulkCompetencesView(APIView):
    """
    Ajoute plusieurs compétences en une seule requête
    POST /chomeur/mes-competences/bulk/
    """
    permission_classes = [IsAuthenticated]
    MAX_COMPETENCES = 20
    
    @transaction.atomic
    def post(self, request):
        try:
            chomeur = Chomeur.objects.get(utilisateur=request.user)
            competences_data = request.data.get('competences', [])
            
            if not competences_data:
                return Response({
                    'errors': {'general': 'Aucune compétence fournie'}
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Vérifier la limite
            current_count = ChomeurCompetence.objects.filter(chomeur=chomeur).count()
            remaining_slots = self.MAX_COMPETENCES - current_count
            
            if len(competences_data) > remaining_slots:
                return Response({
                    'errors': {
                        'general': f'Vous ne pouvez ajouter que {remaining_slots} compétence(s) supplémentaire(s)'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Créer les compétences
            created_competences = []
            errors = []
            
            for comp_data in competences_data:
                try:
                    # Vérifier si déjà existante
                    if ChomeurCompetence.objects.filter(
                        chomeur=chomeur,
                        competence_id=comp_data.get('competence')
                    ).exists():
                        errors.append({
                            'competence': comp_data.get('competence'),
                            'error': 'Compétence déjà ajoutée'
                        })
                        continue
                    
                    # Créer la compétence
                    chomeur_competence = ChomeurCompetence.objects.create(
                        chomeur=chomeur,
                        competence_id=comp_data.get('competence'),
                        niveau_maitrise=comp_data.get('niveau_maitrise', 'intermédiaire'),
                        created_by=request.user
                    )
                    created_competences.append(chomeur_competence)
                    
                except Exception as e:
                    errors.append({
                        'competence': comp_data.get('competence'),
                        'error': str(e)
                    })
            
            # Sérialiser les compétences créées
            serializer = ChomeurCompetenceSerializer(created_competences, many=True)
            
            return Response({
                'message': f'{len(created_competences)} compétence(s) ajoutée(s) avec succès',
                'created': len(created_competences),
                'errors': errors if errors else None,
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Chomeur.DoesNotExist:
            return Response({
                'errors': {'general': 'Profil chômeur non trouvé'}
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'errors': {'general': str(e)}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 🆕 Suppression en masse
class BulkDeleteCompetencesView(APIView):
    """
    Supprime plusieurs compétences en une seule requête
    POST /chomeur/mes-competences/bulk-delete/
    """
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        try:
            chomeur = Chomeur.objects.get(utilisateur=request.user)
            ids = request.data.get('ids', [])
            
            if not ids:
                return Response({
                    'errors': {'general': 'Aucun ID fourni'}
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Supprimer
            deleted_count = ChomeurCompetence.objects.filter(
                chomeur=chomeur,
                id__in=ids
            ).delete()[0]
            
            return Response({
                'message': f'{deleted_count} compétence(s) supprimée(s)',
                'deleted': deleted_count
            }, status=status.HTTP_200_OK)
            
        except Chomeur.DoesNotExist:
            return Response({
                'errors': {'general': 'Profil chômeur non trouvé'}
            }, status=status.HTTP_404_NOT_FOUND)

# ============================================================
# 🏆 EXPLOITS DU CHÔMEUR CONNECTÉ
# ============================================================
class MesExploitsView(generics.ListCreateAPIView):
    """
    Liste et ajoute des exploits pour le chômeur connecté
    GET/POST /chomeur/mes-exploits/
    """
    serializer_class = ExploitSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['titre', 'description']
    
    def get_queryset(self):
        try:
            chomeur = Chomeur.objects.get(utilisateur=self.request.user)
            return Exploit.objects.filter(
                chomeur=chomeur
            ).order_by('-date_publication')
        except Chomeur.DoesNotExist:
            return Exploit.objects.none()
    
    @transaction.atomic
    def perform_create(self, serializer):
        try:
            chomeur = Chomeur.objects.get(utilisateur=self.request.user)
            serializer.save(chomeur=chomeur, created_by=self.request.user)
        except Chomeur.DoesNotExist:
            raise ValidationError({"general": "Profil chômeur non trouvé"})
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['message'] = "Exploit ajouté avec succès."
        return response