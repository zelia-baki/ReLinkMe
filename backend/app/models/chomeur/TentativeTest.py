from django.db import models
from .Chomeur import Chomeur
from ..recruteur.TestCompetence import TestCompetence


class TentativeTest(models.Model):
    id = models.AutoField(primary_key=True)
    code_tentative = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_chomeur = models.ForeignKey(Chomeur, related_name='tentatives', on_delete=models.CASCADE)
    id_test = models.ForeignKey(TestCompetence, related_name='tentatives', on_delete=models.CASCADE)
    reussi = models.BooleanField(default=False)
    temps_ecoule_minutes = models.IntegerField(null=True, blank=True)
    date_tentative = models.DateTimeField(auto_now_add=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tentative_test'