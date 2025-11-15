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
