from _decimal import Decimal
from django.db import models
from django.utils import timezone

from chomeur.models import Exploit
from core.models import Utilisateur
from recruteur.models import Offre


class Administrateur(models.Model):
    id = models.BigAutoField(primary_key=True)
    code_admin = models.CharField(max_length=10, unique=True, null=True, blank=True)
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='profil_admin')
    niveau_autorisation = models.CharField(
        max_length=30,
        choices=[
            ('super_admin', 'Super Admin'),
            ('admin_validation', 'Admin Validation'),
            ('admin_moderation', 'Admin Modération')
        ],
        default='admin_moderation'
    )
    departement = models.CharField(max_length=100, null=True, blank=True)
    created_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='admins_crees')
    modified_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='admins_modifies')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'administrateur'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_admin:
            self.code_admin = f"ADM{str(self.id).zfill(5)}"
            super().save(update_fields=['code_admin'])

    def __str__(self):
        return f"{self.utilisateur.nom_complet} ({self.niveau_autorisation})"


class VerificationTypeEnum(models.TextChoices):
    IDENTITE = 'identite', 'identite'
    LOCALISATION = 'localisation', 'localisation'
    COMPETENCES = 'competences', 'competences'
    ENTREPRISE = 'entreprise', 'entreprise'
    COMPLETE = 'complete', 'complete'

class DemandeStatutEnum(models.TextChoices):
    EN_ATTENTE = 'en_attente', 'en_attente'
    EN_COURS = 'en_cours', 'en_cours'
    APPROUVEE = 'approuvee', 'approuvee'
    REFUSEE = 'refusee', 'refusee'

class DemandeVerification(models.Model):
    id = models.AutoField(primary_key=True)
    code_demande = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_utilisateur = models.ForeignKey(Utilisateur, related_name='demandes_verification', on_delete=models.CASCADE)
    type_verification = models.CharField(max_length=50, choices=VerificationTypeEnum.choices)
    statut = models.CharField(max_length=50, choices=DemandeStatutEnum.choices, default=DemandeStatutEnum.EN_ATTENTE)
    id_admin_responsable = models.ForeignKey(Administrateur, null=True, blank=True, related_name='demandes_responsable', on_delete=models.SET_NULL)
    motif_refus = models.TextField(null=True, blank=True)
    date_soumission = models.DateTimeField(auto_now_add=True)
    date_traitement = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='demande_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='demande_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'demande_verification'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_demande:
            self.code_demande = f"DMD{str(self.id).zfill(5)}"
            super().save(update_fields=['code_demande'])

class HistoriqueActionEnum(models.TextChoices):
    VALIDATION_COMPTE = 'validation_compte', 'validation_compte'
    REFUS_COMPTE = 'refus_compte', 'refus_compte'
    SUSPENSION = 'suspension', 'suspension'
    REACTIVATION = 'reactivation', 'reactivation'
    MODIFICATION_PROFIL = 'modification_profil', 'modification_profil'
    SUPPRESSION_CONTENU = 'suppression_contenu', 'suppression_contenu'

class HistoriqueValidation(models.Model):
    id = models.AutoField(primary_key=True)
    code_historique = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_admin = models.ForeignKey(Administrateur, related_name='historique_admin', on_delete=models.CASCADE)
    id_utilisateur_cible = models.ForeignKey(Utilisateur, related_name='historique_cible', on_delete=models.CASCADE)
    type_action = models.CharField(max_length=50, choices=HistoriqueActionEnum.choices)
    table_concernee = models.CharField(max_length=50, null=True, blank=True)
    id_enregistrement = models.IntegerField(null=True, blank=True)
    details = models.TextField(null=True, blank=True)
    date_action = models.DateTimeField(auto_now_add=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'historique_validation'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_historique:
            self.code_historique = f"HIST{str(self.id).zfill(5)}"
            super().save(update_fields=['code_historique'])

    def create_history_object(self,data):
        try:
            self.id_admin = Administrateur.objects.get(id=data['id_admin'])
            self.id_utilisateur_cible = Utilisateur.objects.get(id=data['id_utilisateur_cible'])
        except (Administrateur.DoesNotExist, Utilisateur.DoesNotExist) as e:
            raise ValueError(f"Related object not found: {str(e)}")

        self.type_action = data['type_action']
        self.table_concernee = data['table_concernee']
        self.id_enregistrement = data['id_enregistrement']
        self.details = data['details']
        self.save()

class PieceTypeEnum(models.TextChoices):
    PASSEPORT = 'passeport', 'passeport'
    CARTE_IDENTITE = 'carte_identite', 'carte_identite'
    PERMIS_CONDUIRE = 'permis_conduire', 'permis_conduire'
    JUSTIFICATIF_DOMICILE = 'justificatif_domicile', 'justificatif_domicile'
    DIPLOME = 'diplome', 'diplome'
    CERTIFICAT_TRAVAIL = 'certificat_travail', 'certificat_travail'
    AUTRE = 'autre', 'autre'
class PieceStatutEnum(models.TextChoices):
    EN_ATTENTE = 'en_attente', 'en_attente'
    APPROUVE = 'approuve', 'approuve'
    REFUSE = 'refuse', 'refuse'
    EXPIRE = 'expire', 'expire'

class PieceJustificative(models.Model):
    id = models.AutoField(primary_key=True)
    code_piece = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_utilisateur = models.ForeignKey(Utilisateur, related_name='pieces_justificatives', on_delete=models.CASCADE)
    type_piece = models.CharField(max_length=50, choices=PieceTypeEnum.choices)
    numero_piece = models.CharField(max_length=100, null=True, blank=True)
    fichier_url = models.CharField(max_length=255)
    date_emission = models.DateField(null=True, blank=True)
    date_expiration = models.DateField(null=True, blank=True)
    pays_emission = models.CharField(max_length=100, null=True, blank=True)
    statut_verification = models.CharField(max_length=50, choices=PieceStatutEnum.choices, default=PieceStatutEnum.EN_ATTENTE)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='piece_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='piece_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'piece_justificative'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_piece :
            self.code_piece = f"PC{str(self.id).zfill(5)}"
            super().save(update_fields=['code_piece'])

class SignalementTypeEnum(models.TextChoices):
    PROFIL_FRAUDULEUX = 'profil_frauduleux', 'profil_frauduleux'
    CONTENU_INAPPROPRIE = 'contenu_inapproprie', 'contenu_inapproprie'
    SPAM = 'spam', 'spam'
    HARCELEMENT = 'harcelement', 'harcelement'
    FAUSSE_OFFRE = 'fausse_offre', 'fausse_offre'
    AUTRE = 'autre', 'autre'

class SignalementStatutEnum(models.TextChoices):
    EN_ATTENTE = 'en_attente', 'en_attente'
    EN_COURS = 'en_cours', 'en_cours'
    TRAITE = 'traite', 'traite'
    REJETE = 'rejete', 'rejete'

class Signalement(models.Model):
    id = models.AutoField(primary_key=True)
    code_signalement = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_signaleur = models.ForeignKey(Utilisateur, related_name='signalements_signaleur', on_delete=models.CASCADE)
    id_utilisateur_signale = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='signalements_utilisateur', on_delete=models.CASCADE)
    id_offre = models.ForeignKey(Offre, null=True, blank=True, related_name='signalements_offre', on_delete=models.CASCADE)
    id_exploit = models.ForeignKey(Exploit, null=True, blank=True, related_name='signalements_exploit', on_delete=models.CASCADE)
    type_signalement = models.CharField(max_length=50, choices=SignalementTypeEnum.choices)
    description = models.TextField()
    preuves_url = models.CharField(max_length=255, null=True, blank=True)
    statut = models.CharField(max_length=50, choices=SignalementStatutEnum.choices, default=SignalementStatutEnum.EN_ATTENTE)
    id_admin_responsable = models.ForeignKey(Administrateur, null=True, blank=True, related_name='signalement_admin_responsable', on_delete=models.SET_NULL)
    decision = models.TextField(null=True, blank=True)
    date_signalement = models.DateTimeField(auto_now_add=True)
    date_traitement = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='signalement_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='signalement_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'signalement'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_signalement:
            self.code_signalement = f"SIG{str(self.id).zfill(5)}"
            super().save(update_fields=['code_signalement'])

class VerificationStatutEnum(models.TextChoices):
    EN_ATTENTE = 'en_attente', 'en_attente'
    VERIFIE = 'verifie', 'verifie'
    REFUSE = 'refuse', 'refuse'

import requests
class VerificationLocalisation(models.Model):
    id = models.AutoField(primary_key=True)
    code_verification = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_utilisateur = models.ForeignKey(Utilisateur, related_name='verifications_localisation', on_delete=models.CASCADE)
    adresse_complete = models.TextField()
    ville = models.CharField(max_length=100)
    code_postal = models.CharField(max_length=20, null=True, blank=True)
    pays = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    justificatif_url = models.CharField(max_length=255, null=True, blank=True)
    statut = models.CharField(max_length=50, choices=VerificationStatutEnum.choices, default=VerificationStatutEnum.EN_ATTENTE)
    id_admin_verificateur = models.ForeignKey(Administrateur, null=True, blank=True, related_name='verifloc_admin', on_delete=models.SET_NULL)
    date_verification = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='verifloc_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='verifloc_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'verification_localisation'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_verification:
            self.code_verification = f"VRF{str(self.id).zfill(5)}"
            super().save(update_fields=['code_verification'])


    def get_location(self):
        """Gets approximate user location based on public IP."""
        try:
            response = requests.get("https://ipinfo.io", timeout=5)
            response.raise_for_status()

            data = response.json()
            location = data.get("loc")
            lat, long = location.split(",")

            return {
                    "ville": data.get("city"),
                    "region": data.get("region"),
                    "pays": data.get("country"),
                    "latitude": lat,
                    "longitude": long
                }

        except Exception as e:
            # best: log it
            return {"error": str(e)}

    def create_verif_loc(self, user_data):
        """Links location to an utilisateur and stores it."""
        try:
            self.id_utilisateur_id = Utilisateur.objects.get(id=user_data['id_utilisateur']).id
        except Utilisateur.DoesNotExist:
            raise ValueError("Utilisateur non existant")

        # Get location data
        location = self.get_location()
        if not location or "error" in location:
            raise ValueError("Impossible de recueillir les informations de localisation")

        self.ville = location['ville']
        self.pays = location['pays']
        self.latitude = Decimal(location['latitude'])
        self.longitude = Decimal(location['longitude'])
        self.justificatif_url= f"https://www.google.com/maps?q={Decimal(location['latitude'])},{Decimal(location['longitude'])}"
        self.statut = user_data['statut']
        self.created_by = Utilisateur.objects.get(id=user_data['id_utilisateur'])

        self.save()

