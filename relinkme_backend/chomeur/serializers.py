from rest_framework import serializers
from core.models import Utilisateur
from .models import Chomeur, ChomeurCompetence, Exploit


class ChomeurSerializer(serializers.ModelSerializer):
    # --- Champs pour affichage frontend ---
    utilisateur_nom = serializers.CharField(source='utilisateur.nom_complet', read_only=True)

    # --- Champs utilisés pour la création automatique d'un utilisateur ---
    email = serializers.EmailField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    nom_complet = serializers.CharField(write_only=True, required=False)

    # --- Champ FK filtré : n'affiche que les utilisateurs sans profil chômeur ---
    utilisateur = serializers.PrimaryKeyRelatedField(
        queryset=Utilisateur.objects.filter(profil_chomeur__isnull=True),
        required=False, allow_null=True
    )

    class Meta:
        model = Chomeur
        fields = [
            'id', 'code_chomeur',
            'utilisateur', 'utilisateur_nom',
            'email', 'password', 'nom_complet',
            'profession', 'description', 'niveau_expertise', 'solde_jetons',
            'created_by', 'modified_by', 'created_at', 'updated_at',
        ]
        read_only_fields = (
            'id', 'code_chomeur', 'created_at', 'updated_at',
            'created_by', 'modified_by', 'utilisateur_nom',
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


class ExploitSerializer(serializers.ModelSerializer):
    chomeur_nom = serializers.CharField(source='chomeur.utilisateur.nom_complet', read_only=True)

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
        )
