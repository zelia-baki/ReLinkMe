# core/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Competence, Utilisateur
from .models import Competence, Utilisateur, Candidature

# ============================================

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
        
        

# SERIALIZERS EXISTANTS (garder tel quel)
# ============================================

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
            user = authenticate(
                request=self.context.get('request'),
                username=email,
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


# ============================================
# 🆕 NOUVEAUX SERIALIZERS POUR CANDIDATURES
# ============================================

class CandidatureListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des candidatures (vue simplifiée)"""
    
    # Informations du chômeur
    chomeur_nom = serializers.CharField(source='chomeur.utilisateur.nom_complet', read_only=True)
    chomeur_email = serializers.EmailField(source='chomeur.utilisateur.email', read_only=True)
    chomeur_photo = serializers.CharField(source='chomeur.utilisateur.photo_profil', read_only=True)
    chomeur_profession = serializers.CharField(source='chomeur.profession', read_only=True)
    
    # Informations de l'offre
    offre_titre = serializers.CharField(source='offre.titre', read_only=True)
    offre_code = serializers.CharField(source='offre.code_offre', read_only=True)
    offre_type_contrat = serializers.CharField(source='offre.type_contrat', read_only=True)
    
    # Informations du recruteur
    recruteur_nom = serializers.CharField(source='offre.recruteur.nom_entreprise', read_only=True)
    
    class Meta:
        model = Candidature
        fields = [
            'id',
            'code_candidature',
            'chomeur',
            'chomeur_nom',
            'chomeur_email',
            'chomeur_photo',
            'chomeur_profession',
            'offre',
            'offre_titre',
            'offre_code',
            'offre_type_contrat',
            'recruteur_nom',
            'statut',
            'date_postulation',
            'jetons_utilises',
        ]


class CandidatureDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une candidature"""
    
    # Profil complet du chômeur
    chomeur_profil = serializers.SerializerMethodField()
    
    # Détails complets de l'offre
    offre_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidature
        fields = [
            'id',
            'code_candidature',
            'chomeur',
            'chomeur_profil',
            'offre',
            'offre_details',
            'lettre_motivation',
            'cv_fichier',
            'date_postulation',
            'statut',
            'jetons_utilises',
            'created_at',
            'updated_at',
        ]
    
    def get_chomeur_profil(self, obj):
        chomeur = obj.chomeur
        utilisateur = chomeur.utilisateur
        
        # Récupérer les compétences du chômeur
        from chomeur.models import ChomeurCompetence
        competences = ChomeurCompetence.objects.filter(chomeur=chomeur).select_related('competence')
        competences_data = [
            {
                'id': cc.competence.id,
                'libelle': cc.competence.libelle,
                'niveau_maitrise': cc.niveau_maitrise,
            }
            for cc in competences
        ]
        
        return {
            'id': chomeur.id,
            'code_chomeur': chomeur.code_chomeur,
            'nom_complet': utilisateur.nom_complet,
            'email': utilisateur.email,
            'telephone': utilisateur.telephone,
            'localisation': utilisateur.localisation,
            'photo_profil': utilisateur.photo_profil,
            'profession': chomeur.profession,
            'niveau_expertise': chomeur.niveau_expertise,
            'description': chomeur.description,
            'competences': competences_data,
        }
    
    def get_offre_details(self, obj):
        offre = obj.offre
        recruteur = offre.recruteur
        
        return {
            'id': offre.id,
            'code_offre': offre.code_offre,
            'titre': offre.titre,
            'description': offre.description,
            'type_contrat': offre.type_contrat,
            'salaire': str(offre.salaire) if offre.salaire else None,
            'date_limite': offre.date_limite,
            'recruteur': {
                'id': recruteur.id,
                'nom_entreprise': recruteur.nom_entreprise,
                'type_recruteur': recruteur.type_recruteur,
            }
        }


class CandidatureCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer une candidature"""
    
    class Meta:
        model = Candidature
        fields = [
            'offre',
            'lettre_motivation',
            'cv_fichier',
            'jetons_utilises',
        ]
    
    def validate(self, attrs):
        # Vérifier que le chômeur ne postule pas deux fois à la même offre
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Vous devez être authentifié.")
        
        try:
            chomeur = request.user.profil_chomeur
        except:
            raise serializers.ValidationError("Vous devez avoir un profil de chômeur.")
        
        offre = attrs.get('offre')
        
        # Vérifier si une candidature existe déjà
        if Candidature.objects.filter(chomeur=chomeur, offre=offre).exists():
            raise serializers.ValidationError("Vous avez déjà postulé à cette offre.")
        
        # Vérifier le solde de jetons
        jetons_requis = attrs.get('jetons_utilises', 0)
        if chomeur.solde_jetons < jetons_requis:
            raise serializers.ValidationError(
                f"Jetons insuffisants. Solde actuel: {chomeur.solde_jetons}, requis: {jetons_requis}"
            )
        
        return attrs
    
    def create(self, validated_data):
        request = self.context.get('request')
        chomeur = request.user.profil_chomeur
        
        # Créer la candidature
        candidature = Candidature.objects.create(
            chomeur=chomeur,
            created_by=request.user,
            **validated_data
        )
        
        # Déduire les jetons
        jetons_utilises = validated_data.get('jetons_utilises', 0)
        if jetons_utilises > 0:
            chomeur.solde_jetons -= jetons_utilises
            chomeur.save()
        
        return candidature


class CandidatureUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour mettre à jour le statut d'une candidature (recruteur)"""
    
    class Meta:
        model = Candidature
        fields = ['statut']
    
    def validate_statut(self, value):
        valid_statuts = ['en_attente', 'vue', 'acceptee', 'refusee', 'entretien']
        if value not in valid_statuts:
            raise serializers.ValidationError(f"Statut invalide. Valeurs autorisées: {', '.join(valid_statuts)}")
        return value
        
