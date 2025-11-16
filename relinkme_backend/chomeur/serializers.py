# chomeur/serializers.py
from rest_framework import serializers
from django.db import transaction
from core.models import Utilisateur
from .models import Chomeur, ChomeurCompetence, Exploit


class ChomeurSerializer(serializers.ModelSerializer):
    # --- Champs pour affichage frontend ---
    utilisateur_nom = serializers.CharField(source='utilisateur.nom_complet', read_only=True)

    # --- Champs utilisés pour la création automatique d'un utilisateur ---
    email = serializers.EmailField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    nom_complet = serializers.CharField(write_only=True, required=False)
    telephone = serializers.CharField(write_only=True, required=False)
    localisation = serializers.CharField(write_only=True, required=False)

    # --- Champ FK filtré : n'affiche que les utilisateurs sans profil chômeur ---
    utilisateur = serializers.PrimaryKeyRelatedField(
        queryset=Utilisateur.objects.filter(profil_chomeur__isnull=True),
        required=False, allow_null=True
    )
    
    competences = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        allow_empty=True
    )

    class Meta:
        model = Chomeur
        fields = [
            'id', 'code_chomeur',
            'utilisateur', 'utilisateur_nom',
            'email', 'password', 'nom_complet', 'telephone', 'localisation',
            'profession', 'description', 'niveau_expertise', 'solde_jetons',
            'competences',  # 🆕 Ajoutez ici
            'created_by', 'modified_by', 'created_at', 'updated_at',
        ]
        read_only_fields = (
            'id', 'code_chomeur', 'created_at', 'updated_at',
            'created_by', 'modified_by', 'utilisateur_nom', 'solde_jetons',
        )

    def __init__(self, *args, **kwargs):
        """
        Masquer le champ 'utilisateur' pour les utilisateurs non-admins.
        """
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and not request.user.is_staff:
            self.fields.pop('utilisateur', None)

    def validate(self, attrs):
        """
        Vérifie que les bons champs sont fournis.
        """
        if not self.instance:  # en création
            if not attrs.get('utilisateur'):
                email = self.initial_data.get('email')
                password = self.initial_data.get('password')
                nom = self.initial_data.get('nom_complet')
                if not (email and password and nom):
                    raise serializers.ValidationError(
                        "Si vous ne fournissez pas 'utilisateur', indiquez 'email', 'password' et 'nom_complet'."
                    )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        """
        Crée automatiquement un utilisateur et ses compétences
        """
        # 🆕 Extraire les compétences avant création
        competences_ids = validated_data.pop('competences', [])
        
        # Extraire les données utilisateur
        email = validated_data.pop('email', None)
        password = validated_data.pop('password', None)
        nom_complet = validated_data.pop('nom_complet', None)
        telephone = validated_data.pop('telephone', None)
        localisation = validated_data.pop('localisation', None)

        # Si un utilisateur existe déjà, l'utiliser
        if 'utilisateur' in validated_data and validated_data['utilisateur']:
            chomeur = super().create(validated_data)
        else:
            # Créer un nouvel utilisateur
            if email and password and nom_complet:
                if Utilisateur.objects.filter(email=email).exists():
                    raise serializers.ValidationError({"email": "Cet email est déjà utilisé."})

                utilisateur = Utilisateur.objects.create_user(
                    email=email,
                    nom_complet=nom_complet,
                    password=password,
                    role='chomeur',
                    telephone=telephone or '',
                    localisation=localisation or ''
                )
                validated_data['utilisateur'] = utilisateur

            # Créer le profil chômeur
            chomeur = super().create(validated_data)

        # 🆕 Créer les compétences si fournies
        if competences_ids:
            from .models import ChomeurCompetence
            from core.models import Competence
            
            # Limiter à 20 compétences maximum
            competences_ids = competences_ids[:20]
            
            for comp_id in competences_ids:
                try:
                    competence = Competence.objects.get(id=comp_id)
                    ChomeurCompetence.objects.create(
                        chomeur=chomeur,
                        competence=competence,
                        niveau_maitrise='intermédiaire'  # Niveau par défaut
                    )
                except Competence.DoesNotExist:
                    continue  # Ignorer les IDs invalides

        return chomeur


# Gardez les autres serializers inchangés
class ChomeurCompetenceSerializer(serializers.ModelSerializer):
    chomeur_nom = serializers.CharField(source='chomeur.utilisateur.nom_complet', read_only=True)
    competence_nom = serializers.CharField(source='competence.libelle', read_only=True)

    class Meta:
        model = ChomeurCompetence
        fields = [
            'id', 'code_liaison',
            'chomeur', 'chomeur_nom',
            'competence', 'competence_nom',
            'niveau_maitrise',
            'created_by', 'modified_by', 'created_at', 'updated_at',
        ]
        read_only_fields = (
            'id', 'code_liaison', 'created_at', 'updated_at',
            'created_by', 'modified_by', 'chomeur_nom', 'competence_nom',
        )


# chomeur/serializers.py

class ExploitSerializer(serializers.ModelSerializer):
    chomeur_nom = serializers.CharField(source='chomeur.utilisateur.nom_complet', read_only=True)
    
    # 🆕 Ajoutez cette ligne pour rendre chomeur optionnel en écriture
    chomeur = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Exploit
        fields = [
            'id', 'code_exploit', 'chomeur', 'chomeur_nom',
            'titre', 'description', 'lien', 'fichiers',
            'visible', 'date_publication',
            'created_by', 'modified_by', 'created_at', 'updated_at',
        ]
        read_only_fields = (
            'id', 'code_exploit', 'date_publication',
            'created_at', 'updated_at', 'created_by',
            'modified_by', 'chomeur_nom',
            'chomeur',  # 🆕 Ajoutez chomeur en read_only
        )