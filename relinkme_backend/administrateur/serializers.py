from rest_framework import serializers

from core.models import Utilisateur
from core.serializers import UtilisateurSerializer
from .models import Administrateur, DemandeVerification, HistoriqueValidation, VerificationLocalisation, Signalement, \
    PieceJustificative


class AdministrateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrateur
        fields = '__all__'
        read_only_fields = ['id','code_admin','created_at','created_by']

class AdminUserSerializer(serializers.ModelSerializer):
    utilisateur = UtilisateurSerializer()
    class Meta:
        model = Administrateur
        fields = '__all__'
        read_only_fields = ['id','code_admin','created_at','created_by']


class DemandeVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemandeVerification
        fields = '__all__'
        read_only_fields = ['id', 'code_demande', 'created_at', 'created_by']
class HistoriqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriqueValidation
        fields= '__all__'
        read_only_fields= '__all__'

class VerifLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationLocalisation
        fields = '__all__'
        read_only_fields = ['id','code_verification','date_verification']

class SignalementSerializer(serializers.ModelSerializer):
    class Meta:
        model= Signalement
        fields = '__all__'
        read_only_fields = ['id','code_signalement','created_at']

class PieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PieceJustificative
        fields = '__all__'

class UtilisateurSerializers(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'nom_complet', 'photo_profil','localisation']

class UtilisateurVerificationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['code_utilisateur', 'nom_complet', 'email']

class HistoriqueSerializer(serializers.ModelSerializer):
    class Meta:
        model= HistoriqueValidation
        fields= '__all__'
