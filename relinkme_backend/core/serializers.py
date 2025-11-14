from rest_framework import serializers
from .models import Utilisateur

class UtilisateurSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

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
            'date_inscription',
            'password',
        ]
        read_only_fields = ['code_utilisateur', 'statut_verifie', 'date_inscription']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Utilisateur.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
