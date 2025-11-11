from django.db import models

from ..autres.Utilisateur import Utilisateur
from .Recruteur import Recruteur

class NiveauDifficulteEnum(models.TextChoices):
    FACILE = 'facile', 'facile'
    MOYEN = 'moyen', 'moyen'
    DIFFICILE = 'difficile', 'difficile'

class TestCompetence(models.Model):
    id = models.AutoField(primary_key=True)
    code_test = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_recruteur = models.ForeignKey(Recruteur, related_name='tests_competence', on_delete=models.CASCADE)
    titre = models.CharField(max_length=150)
    description = models.TextField(null=True, blank=True)
    code_test = models.TextField()  # note: original SQL had 'code_test' as TEXT content of the test
    langage_programmation = models.CharField(max_length=50, null=True, blank=True)
    niveau_difficulte = models.CharField(max_length=20, choices=NiveauDifficulteEnum.choices, default=NiveauDifficulteEnum.MOYEN)
    jetons_recompense = models.IntegerField(default=10)
    temps_limite_minutes = models.IntegerField(null=True, blank=True)
    actif = models.BooleanField(default=True)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='test_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='test_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'test_competence'
