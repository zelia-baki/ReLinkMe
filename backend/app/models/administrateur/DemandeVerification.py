from django.db import models
from .Administrateur import Administrateur
from ..autres.Utilisateur import Utilisateur

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
