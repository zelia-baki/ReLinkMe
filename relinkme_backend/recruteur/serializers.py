# recruteur/serializers.py
from rest_framework import serializers
from django.db import transaction
from core.models import Utilisateur
from .models import Recruteur, Offre, OffreCompetence, TestCompetence


class RecruteurSerializer(serializers.ModelSerializer):
    # --- Champs pour affichage frontend ---
    utilisateur_nom = serializers.CharField(source='utilisateur.nom_complet', read_only=True)
    utilisateur_email = serializers.CharField(source='utilisateur.email', read_only=True)

    # --- Champs utilisés pour la création automatique d'un utilisateur ---
    email = serializers.EmailField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    telephone = serializers.CharField(write_only=True, required=False)
    adresse = serializers.CharField(write_only=True, required=False)
    
    # --- Champs supplémentaires du formulaire frontend ---
    taille_entreprise = serializers.CharField(write_only=True, required=False)

    # --- Champ FK filtré : n'affiche que les utilisateurs sans profil recruteur ---
    utilisateur = serializers.PrimaryKeyRelatedField(
        queryset=Utilisateur.objects.filter(profil_recruteur__isnull=True),
        required=False, 
        allow_null=True
    )

    class Meta:
        model = Recruteur
        fields = [
            'id', 'code_recruteur',
            'utilisateur', 'utilisateur_nom', 'utilisateur_email',
            'email', 'password', 'telephone', 'adresse',
            'type_recruteur', 'nom_entreprise', 'site_web', 
            'description', 'secteur_activite', 'nombre_employes',
            'taille_entreprise', 'solde_jetons',
            'created_by', 'modified_by', 'created_at', 'updated_at',
        ]
        read_only_fields = (
            'id', 'code_recruteur', 'created_at', 'updated_at',
            'created_by', 'modified_by', 'utilisateur_nom', 
            'utilisateur_email', 'solde_jetons',
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
                nom_entreprise = attrs.get('nom_entreprise')
                if not (email and password and nom_entreprise):
                    raise serializers.ValidationError(
                        "Si vous ne fournissez pas 'utilisateur', indiquez 'email', 'password' et 'nom_entreprise'."
                    )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        """
        Crée automatiquement un utilisateur si les champs email/password sont fournis.
        """
        # Extraire les données utilisateur
        email = validated_data.pop('email', None)
        password = validated_data.pop('password', None)
        telephone = validated_data.pop('telephone', None)
        adresse = validated_data.pop('adresse', None)
        taille_entreprise = validated_data.pop('taille_entreprise', None)
        
        # Mapper taille_entreprise vers nombre_employes
        if taille_entreprise:
            taille_map = {
                'TPE': 5,
                'PME': 50,
                'ETI': 1000,
                'GE': 5000
            }
            validated_data['nombre_employes'] = taille_map.get(taille_entreprise, 50)

        # Si un utilisateur existe déjà, l'utiliser
        if 'utilisateur' in validated_data and validated_data['utilisateur']:
            return super().create(validated_data)

        # Sinon, créer un nouvel utilisateur
        if email and password:
            # Vérifier si l'email existe déjà
            if Utilisateur.objects.filter(email=email).exists():
                raise serializers.ValidationError({"email": "Cet email est déjà utilisé."})

            # Utiliser nom_entreprise comme nom_complet pour l'utilisateur
            nom_complet = validated_data.get('nom_entreprise', 'Recruteur')

            # Créer l'utilisateur
            utilisateur = Utilisateur.objects.create_user(
                email=email,
                nom_complet=nom_complet,
                password=password,
                role='recruteur',
                telephone=telephone or '',
                localisation=adresse or ''
            )
            validated_data['utilisateur'] = utilisateur

        # Créer le profil recruteur
        return super().create(validated_data)


class OffreSerializer(serializers.ModelSerializer):
    """
    Serializer pour les offres d'emploi.
    Le champ 'recruteur' est géré automatiquement par perform_create() dans la vue.
    """
    # Champs en lecture seule pour affichage
    recruteur_nom = serializers.CharField(source='recruteur.nom_entreprise', read_only=True)
    recruteur_id = serializers.IntegerField(source='recruteur.id', read_only=True)

    class Meta:
        model = Offre
        fields = [
            'id', 'code_offre', 'recruteur_id', 'recruteur_nom',
            'titre', 'description', 'type_contrat', 'salaire',
            'date_limite', 'statut', 'date_creation'
        ]
        read_only_fields = (
            'id', 'code_offre', 'date_creation', 
            'recruteur_id', 'recruteur_nom'
        )


class OffreCompetenceSerializer(serializers.ModelSerializer):
    offre_titre = serializers.CharField(source='offre.titre', read_only=True)
    competence_nom = serializers.CharField(source='competence.libelle', read_only=True)

    class Meta:
        model = OffreCompetence
        fields = [
            'id', 'offre', 'offre_titre', 
            'competence', 'competence_nom',
            'niveau_requis'
        ]
        read_only_fields = ('id', 'offre_titre', 'competence_nom')


class TestCompetenceSerializer(serializers.ModelSerializer):
    offre_titre = serializers.CharField(source='offre.titre', read_only=True)
    competence_nom = serializers.CharField(source='competence.libelle', read_only=True)

    class Meta:
        model = TestCompetence
        fields = [
            'id', 'code_test', 'offre', 'offre_titre',
            'competence', 'competence_nom',
            'question', 'reponse_correcte', 'score', 'date_creation'
        ]
        read_only_fields = ('id', 'code_test', 'date_creation', 'offre_titre', 'competence_nom')