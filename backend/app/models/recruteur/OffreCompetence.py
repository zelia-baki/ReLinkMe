from django.db import models
from ..chomeur.Competence import Competence
from .Offre import Offre

class NiveauMaitriseEnum(models.TextChoices):
    DEBUTANT = 'débutant', 'débutant'
    INTERMEDIAIRE = 'intermédiaire', 'intermédiaire'
    AVANCE = 'avancé', 'avancé'
    EXPERT = 'expert', 'expert'

class OffreCompetence(models.Model):
    id = models.AutoField(primary_key=True)
    id_offre = models.ForeignKey(Offre, related_name='offre_competences', on_delete=models.CASCADE)
    id_competence = models.ForeignKey(Competence, related_name='offre_competences', on_delete=models.CASCADE)
    niveau_requis = models.CharField(max_length=20, choices=NiveauMaitriseEnum.choices, default=NiveauMaitriseEnum.INTERMEDIAIRE)
    obligatoire = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'offre_competence'
        constraints = [
            models.UniqueConstraint(fields=['id_offre', 'id_competence'], name='unique_offre_competence')
        ]

