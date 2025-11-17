# core/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from .models import Competence
from .serializers import CompetenceSerializer
from .models import Utilisateur
from .serializers import UtilisateurSerializer, LoginSerializer
from rest_framework import generics, filters
from .models import Competence
from .serializers import CompetenceSerializer

class HelloView(APIView):
    def get(self, request):
        return Response({"message": "Backend Django connecté à React 🚀"})


class UtilisateurListView(APIView):
    def get(self, request):
        utilisateurs = Utilisateur.objects.all()
        serializer = UtilisateurSerializer(utilisateurs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LoginView(APIView):
    """
    Vue pour la connexion utilisateur avec JWT
    """
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data, context={'request': request})
            
            if not serializer.is_valid():
                return Response({
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            user = serializer.validated_data['user']

            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            # Sérialiser les données utilisateur
            user_data = UtilisateurSerializer(user).data

            return Response({
                'message': 'Connexion réussie',
                'access': access_token,
                'refresh': refresh_token,
                'user': user_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'errors': {'general': str(e)}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    """
    Vue pour la déconnexion (blacklist le refresh token)
    """
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({
                'message': 'Déconnexion réussie'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'errors': {'general': 'Token invalide'}
            }, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView):
    """
    Récupère les informations de l'utilisateur connecté
    """
    def get(self, request):
        if request.user.is_authenticated:
            serializer = UtilisateurSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({
            'errors': {'general': 'Non authentifié'}
        }, status=status.HTTP_401_UNAUTHORIZED)


class CompetenceListCreateView(generics.ListCreateAPIView):
    """
    Liste toutes les compétences disponibles ou en crée une nouvelle
    GET/POST /core/competences/
    """
    queryset = Competence.objects.all().order_by('categorie', 'libelle')
    serializer_class = CompetenceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['libelle', 'categorie']
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(created_by=self.request.user)
        else:
            serializer.save()


class CompetenceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Récupère, modifie ou supprime une compétence
    GET/PUT/DELETE /core/competences/{id}/
    """
    queryset = Competence.objects.all()
    serializer_class = CompetenceSerializer
    
    def perform_update(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(modified_by=self.request.user)
        else:
            serializer.save()

class CompetenceViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les compétences.
    - GET /api/core/competences/ : Liste toutes les compétences (accessible à tous)
    - GET /api/core/competences/{id}/ : Détails d'une compétence
    - POST : Créer une compétence (admin uniquement)
    - PATCH : Modifier une compétence (admin uniquement)
    - DELETE : Supprimer une compétence (admin uniquement)
    """
    queryset = Competence.objects.all().order_by('libelle')
    serializer_class = CompetenceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['libelle', 'categorie']
    ordering_fields = ['libelle', 'categorie', 'created_at']

    def get_permissions(self):
        """
        Permissions personnalisées :
        - Liste et détails : accessible à tous les utilisateurs connectés
        - Création, modification, suppression : admin uniquement
        """
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]  # Pour plus tard, ajouter IsAdminUser() si besoin

    def perform_create(self, serializer):
        """Enregistre qui a créé la compétence"""
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        """Enregistre qui a modifié la compétence"""
        serializer.save(modified_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='par-categorie')
    def par_categorie(self, request):
        """
        Retourne les compétences groupées par catégorie
        GET /api/core/competences/par-categorie/
        """
        competences = self.get_queryset()
        categories = {}
        
        for comp in competences:
            cat = comp.categorie or 'Autre'
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(CompetenceSerializer(comp).data)
        
        return Response(categories)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def competences_disponibles_pour_chomeur(request):
    """
    Récupère toutes les compétences SAUF celles déjà liées au chômeur connecté
    GET /api/core/competences/disponibles/
    """
    try:
        # Récupérer le chômeur lié à l'utilisateur connecté
        # Adaptez 'chomeur' au nom du related_name dans votre modèle
        chomeur = request.user.chomeur  # ou request.user.profil_chomeur selon votre modèle
        
        # Récupérer les IDs des compétences déjà liées au chômeur
        competences_liees_ids = chomeur.competences.values_list('id', flat=True)
        
        # Récupérer toutes les compétences SAUF celles déjà liées
        competences_disponibles = Competence.objects.exclude(
            id__in=competences_liees_ids
        ).order_by('libelle')
        
        serializer = CompetenceSerializer(competences_disponibles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Erreur lors de la récupération des compétences: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# core/views.py

class CompetenceListCreateView(generics.ListCreateAPIView):
    """
    Liste TOUTES les compétences disponibles dans le système
    GET/POST /core/competences/
    """
    queryset = Competence.objects.all().order_by('categorie', 'libelle')
    serializer_class = CompetenceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['libelle', 'categorie']
    permission_classes = [AllowAny]  # 🔓 Accessible sans authentification
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(created_by=self.request.user)
        else:
            serializer.save()