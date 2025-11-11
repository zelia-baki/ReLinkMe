from django.db import models

from .Utilisateur import Utilisateur
from ..chomeur.Chomeur import Chomeur
from ..recruteur.Offre import Offre

class CandidatureStatutEnum(models.TextChoices):
    EN_ATTENTE = 'en_attente', 'en_attente'
    VUE = 'vue', 'vue'
    ACCEPTEE = 'acceptee', 'acceptee'
    REFUSEE = 'refusee', 'refusee'
    ENTRETIEN = 'entretien', 'entretien'

class Candidature(models.Model):
    id = models.AutoField(primary_key=True)
    code_candidature = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_chomeur = models.ForeignKey(Chomeur, related_name='candidatures', on_delete=models.CASCADE)
    id_offre = models.ForeignKey(Offre, related_name='candidatures', on_delete=models.CASCADE)
    lettre_motivation = models.TextField(null=True, blank=True)
    cv_fichier = models.CharField(max_length=255, null=True, blank=True)
    date_postulation = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, choices=CandidatureStatutEnum.choices, default=CandidatureStatutEnum.EN_ATTENTE)
    jetons_utilises = models.IntegerField(default=0)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='candidature_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='candidature_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'candidature'
        constraints = [
            models.UniqueConstraint(fields=['id_chomeur', 'id_offre'], name='unique_candidature')
        ]
