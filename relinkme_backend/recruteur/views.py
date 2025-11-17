# recruteur/views.py
from django.db import transaction
from rest_framework import viewsets, generics, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from .models import Recruteur, Offre, OffreCompetence, TestCompetence
from .serializers import (
    RecruteurSerializer, 
    OffreSerializer, 
    OffreCompetenceSerializer,
    TestCompetenceSerializer
)


# ============================================================
# 🔧 Fonctions utilitaires
# ============================================================
def get_authenticated_user(request):
    """Renvoie l'utilisateur connecté ou None."""
    return request.user if getattr(request, "user", None) and request.user.is_authenticated else None


# ============================================================
# 🏢 RECRUTEUR - INSCRIPTION PUBLIQUE
# ============================================================
class InscriptionRecruteurView(generics.CreateAPIView):
    """
    Vue publique pour l'inscription des recruteurs.
    Crée automatiquement un utilisateur + profil recruteur.
    """
    queryset = Recruteur.objects.all()
    serializer_class = RecruteurSerializer
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
# 🏢 RECRUTEUR - VIEWSET
# ============================================================
# recruteur/views.py

class RecruteurViewSet(viewsets.ModelViewSet):
    queryset = Recruteur.objects.select_related('utilisateur').all()
    serializer_class = RecruteurSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom_entreprise', 'secteur_activite', 'code_recruteur']

    # ... (tes autres méthodes perform_create, perform_update)

    # 👇 AJOUTE CETTE MÉTHODE ICI
    @action(detail=False, methods=['get'], url_path='me')
    def mon_profil(self, request):
        """
        Retourne le profil complet du recruteur connecté avec statistiques.
        Accessible à : /api/recruteur/recruteurs/me/
        """
        user = request.user
        
        # Vérifier que l'utilisateur a un profil recruteur
        if not hasattr(user, 'profil_recruteur'):
            return Response(
                {'error': 'Aucun profil recruteur associé à cet utilisateur'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        recruteur = user.profil_recruteur
        
        # Récupérer les offres du recruteur
        offres = Offre.objects.filter(recruteur=recruteur)
        
        # Calculer les statistiques
        stats = {
            'offres_total': offres.count(),
            'offres_actives': offres.filter(statut='active').count(),
            'offres_inactives': offres.filter(statut='inactive').count(),
            'offres_fermees': offres.filter(statut='closed').count(),
        }
        
        # Sérialiser le profil
        serializer = self.get_serializer(recruteur)
        
        # Récupérer les dernières offres
        dernieres_offres = OffreSerializer(
            offres.order_by('-date_creation')[:5], 
            many=True
        ).data
        
        return Response({
            'profil': serializer.data,
            'statistiques': stats,
            'offres': dernieres_offres
        })


# ============================================================
# 💼 OFFRE - VIEWSET
# ============================================================
class OffreViewSet(viewsets.ModelViewSet):
    serializer_class = OffreSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['titre', 'description', 'code_offre', 'type_contrat']

    def get_queryset(self):
        """
        Logique d'accès intelligente :
        - ADMIN : voit toutes les offres
        - RECRUTEUR (list) : voit SEULEMENT ses offres
        - RECRUTEUR (retrieve) : voit toutes les offres actives
        - CANDIDAT : voit toutes les offres actives
        """
        user = self.request.user
        action = self.action

        # 1️⃣ ADMIN : Accès total
        if user.is_staff:
            return Offre.objects.all().select_related('recruteur__utilisateur')

        # 2️⃣ DETAIL (retrieve) : Tout le monde peut voir une offre active
        if action == 'retrieve':
            return Offre.objects.filter(statut='active').select_related('recruteur__utilisateur')

        # 3️⃣ RECRUTEUR (list) : Voit SEULEMENT ses propres offres
        if hasattr(user, 'profil_recruteur'):
            return Offre.objects.filter(
                recruteur=user.profil_recruteur
            ).select_related('recruteur__utilisateur')

        # 4️⃣ CANDIDAT (list) : Voit toutes les offres actives
        return Offre.objects.filter(
            statut='active'
        ).select_related('recruteur__utilisateur')

    def perform_create(self, serializer):
        """
        Création d'offre : SEULEMENT pour les recruteurs
        Le champ 'recruteur' est ajouté automatiquement
        """
        user = self.request.user
        
        # Logs de debug
        print(f"\n{'='*50}")
        print(f"🔍 DEBUG - Création d'offre")
        print(f"{'='*50}")
        print(f"User: {user.email}")
        print(f"Is authenticated: {user.is_authenticated}")
        print(f"Has profil_recruteur: {hasattr(user, 'profil_recruteur')}")
        
        # Vérifier que l'utilisateur a un profil recruteur
        if not hasattr(user, 'profil_recruteur'):
            print(f"❌ Utilisateur n'a pas de profil recruteur")
            raise PermissionDenied("Vous devez être un recruteur pour publier une offre.")
        
        recruteur = user.profil_recruteur
        print(f"✅ Recruteur trouvé: {recruteur.nom_entreprise} (ID: {recruteur.id})")
        print(f"Données reçues: {serializer.validated_data}")
        
        # Lier automatiquement l'offre au recruteur connecté
        offre = serializer.save(recruteur=recruteur)
        
        print(f"✅ Offre créée: {offre.titre} (ID: {offre.id}, Code: {offre.code_offre})")
        print(f"{'='*50}\n")

    def perform_update(self, serializer):
        """
        Modification : SEULEMENT le recruteur propriétaire
        """
        user = self.request.user
        offre = self.get_object()

        # Admin peut tout modifier
        if user.is_staff:
            serializer.save()
            return

        # Vérifier que c'est bien SON offre
        if not hasattr(user, 'profil_recruteur') or offre.recruteur != user.profil_recruteur:
            raise PermissionDenied("Vous ne pouvez modifier que vos propres offres.")

        serializer.save()

    def perform_destroy(self, instance):
        """
        Suppression : SEULEMENT le recruteur propriétaire
        """
        user = self.request.user

        # Admin peut tout supprimer
        if user.is_staff:
            instance.delete()
            return

        # Vérifier que c'est bien SON offre
        if not hasattr(user, 'profil_recruteur') or instance.recruteur != user.profil_recruteur:
            raise PermissionDenied("Vous ne pouvez supprimer que vos propres offres.")

        instance.delete()

    @action(detail=False, methods=['get'], url_path='publiques')
    def offres_publiques(self, request):
        """
        Endpoint spécifique pour les offres publiques (candidats)
        Accessible à : /api/recruteur/offres/publiques/
        """
        offres = Offre.objects.filter(
            statut='active'
        ).select_related('recruteur__utilisateur')
        
        serializer = self.get_serializer(offres, many=True)
        return Response(serializer.data)

@action(detail=False, methods=['get'], url_path='me')
def mon_profil(self, request):
    """
    Retourne le profil complet du recruteur connecté avec statistiques.
    Accessible à : /api/recruteur/recruteurs/me/
    """
    user = request.user
    
    # Vérifier que l'utilisateur a un profil recruteur
    if not hasattr(user, 'profil_recruteur'):
        return Response(
            {'error': 'Aucun profil recruteur associé à cet utilisateur'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    recruteur = user.profil_recruteur
    
    # Récupérer les offres du recruteur
    offres = Offre.objects.filter(recruteur=recruteur)
    
    # Calculer les statistiques
    stats = {
        'offres_total': offres.count(),
        'offres_actives': offres.filter(statut='active').count(),
        'offres_inactives': offres.filter(statut='inactive').count(),
        'offres_fermees': offres.filter(statut='closed').count(),
    }
    
    # Sérialiser le profil
    serializer = self.get_serializer(recruteur)
    
    # Récupérer les dernières offres
    dernieres_offres = OffreSerializer(
        offres.order_by('-date_creation')[:5], 
        many=True
    ).data
    
    return Response({
        'profil': serializer.data,
        'statistiques': stats,
        'offres': dernieres_offres
    })
# ============================================================
# 🧠 OFFRE COMPETENCE - VIEWSET
# ============================================================
class OffreCompetenceViewSet(viewsets.ModelViewSet):
    queryset = OffreCompetence.objects.select_related('offre', 'competence').all()
    serializer_class = OffreCompetenceSerializer
    permission_classes = [IsAuthenticated]


# ============================================================
# 📝 TEST COMPETENCE - VIEWSET
# ============================================================
class TestCompetenceViewSet(viewsets.ModelViewSet):
    queryset = TestCompetence.objects.select_related('offre', 'competence').all()
    serializer_class = TestCompetenceSerializer
    permission_classes = [IsAuthenticated]