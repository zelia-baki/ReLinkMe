from django.db import models
from ..autres.Utilisateur import Utilisateur
from .Chomeur import Chomeur
from .Competence import Competence

class NiveauMaitriseEnum(models.TextChoices):
    DEBUTANT = 'débutant', 'débutant'
    INTERMEDIAIRE = 'intermédiaire', 'intermédiaire'
    AVANCE = 'avancé', 'avancé'
    EXPERT = 'expert', 'expert'

class ChomeurCompetence(models.Model):
    id = models.AutoField(primary_key=True)
    code_liaison = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_chomeur = models.ForeignKey(Chomeur, related_name='competences_liees', on_delete=models.CASCADE)
    id_competence = models.ForeignKey(Competence, related_name='chomeur_competences', on_delete=models.CASCADE)
    niveau_maitrise = models.CharField(max_length=20, choices=NiveauMaitriseEnum.choices, default=NiveauMaitriseEnum.INTERMEDIAIRE)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='chomeur_competence_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='chomeur_competence_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chomeur_competence'
        constraints = [
            models.UniqueConstraint(fields=['id_chomeur', 'id_competence'], name='unique_chomeur_competence')
        ]
