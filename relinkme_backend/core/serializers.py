from rest_framework import serializers
from .models import Utilisateur


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
