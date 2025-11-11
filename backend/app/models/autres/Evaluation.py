from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from .Candidature import Candidature
from .Utilisateur import Utilisateur
from ..chomeur.Chomeur import Chomeur
from ..recruteur.Recruteur import Recruteur

class EvaluationTypeEnum(models.TextChoices):
    RECRUTEUR_VERS_CHOMEUR = 'recruteur_vers_chomeur', 'recruteur_vers_chomeur'
    CHOMEUR_VERS_RECRUTEUR = 'chomeur_vers_recruteur', 'chomeur_vers_recruteur'

class Evaluation(models.Model):
    id = models.AutoField(primary_key=True)
    code_evaluation = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_chomeur = models.ForeignKey(Chomeur, related_name='evaluations', on_delete=models.CASCADE)
    id_recruteur = models.ForeignKey(Recruteur, related_name='evaluations', on_delete=models.CASCADE)
    id_candidature = models.ForeignKey(Candidature, null=True, blank=True, related_name='evaluations', on_delete=models.SET_NULL)
    note = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    commentaire = models.TextField(null=True, blank=True)
    type_evaluation = models.CharField(max_length=50, choices=EvaluationTypeEnum.choices)
    date_evaluation = models.DateTimeField(auto_now_add=True)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='evaluation_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='evaluation_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'evaluation'