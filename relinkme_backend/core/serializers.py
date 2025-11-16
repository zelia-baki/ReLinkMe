# core/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Competence, Utilisateur


class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = [
            'id',
            'code_utilisateur',
            'nom_complet',
            'email',
            'role',
            'photo_profil',
            'telephone',
            'localisation',
            'statut_verifie',
            'date_inscription'
        ]


class LoginSerializer(serializers.Serializer):
    """
    Serializer pour la connexion utilisateur
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Authentifier l'utilisateur
            user = authenticate(
                request=self.context.get('request'),
                username=email,  # Votre EmailBackend utilise email comme username
                password=password
            )

            if not user:
                raise serializers.ValidationError({
                    'general': 'Email ou mot de passe incorrect.'
                })

            if not user.is_active:
                raise serializers.ValidationError({
                    'general': 'Ce compte est désactivé.'
                })

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError({
                'general': 'Email et mot de passe requis.'
            })
            
            
# core/serializers.py

# ... (gardez vos imports et serializers existants) ...

# 🆕 Ajoutez ce serializer
class CompetenceSerializer(serializers.ModelSerializer):
    """
    Serializer pour les compétences globales
    """
    created_by_name = serializers.CharField(
        source='created_by.nom_complet', 
        read_only=True
    )
    
    class Meta:
        model = Competence
        fields = [
            'id',
            'code_competence',
            'libelle',
            'categorie',
            'created_by',
            'created_by_name',
            'modified_by',
            'created_at',
            'updated_at'
        ]
        read_only_fields = (
            'id', 
            'code_competence', 
            'created_at', 
            'updated_at',
            'created_by',
            'modified_by',
            'created_by_name'
        )