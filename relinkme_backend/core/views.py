# core/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Utilisateur
from .serializers import UtilisateurSerializer, LoginSerializer


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

# core/views.py

# ... (gardez tout votre code existant) ...

# 🆕 Ajoutez ces imports en haut
from rest_framework import generics, filters
from .models import Competence
from .serializers import CompetenceSerializer

# 🆕 Ajoutez ces vues à la fin


# ==========================
#   GESTION DES COMPÉTENCES
# ==========================
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