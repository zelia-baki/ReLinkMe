from rest_framework import serializers
from .models import Administrateur, DemandeVerification
class AdministrateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrateur
        fields = '__all__'
        read_only_fields = ['id','code_admin','created_at','created_by']

class DemandeVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemandeVerification
        fields = '__all__'