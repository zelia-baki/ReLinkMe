from rest_framework import serializers
from .models import Administrateur, DemandeVerification, HistoriqueValidation


class AdministrateurSerializer(serializers.ModelSerializer):
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
        read_only_fields= ['id','code_historique','id_admin','id_utilisateur_cible', 'type_action','table_concernee','id_enregistrement','details','date_action','created_at']