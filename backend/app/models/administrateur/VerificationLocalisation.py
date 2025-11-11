from django.db import models

from .Administrateur import Administrateur
from ..autres.Utilisateur import Utilisateur

class VerificationStatutEnum(models.TextChoices):
    EN_ATTENTE = 'en_attente', 'en_attente'
    VERIFIE = 'verifie', 'verifie'
    REFUSE = 'refuse', 'refuse'

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
