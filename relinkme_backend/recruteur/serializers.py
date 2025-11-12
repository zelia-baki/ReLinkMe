# ce fichier sert a convertir les objets django pour le cote recruteur
from rest_framework import serializers
from .models import Recruteur, Offre, OffreCompetence, TestCompetence

class RecruteurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruteur
        fields = '__all__'

class OffreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offre
        fields = '__all__'

class OffreCompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OffreCompetence
        fields = '__all__'

class TestCompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCompetence
        fields = '__all__'
