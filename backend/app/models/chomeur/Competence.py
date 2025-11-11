from django.db import models
from ..autres.Utilisateur import Utilisateur

class Competence(models.Model):
    id = models.AutoField(primary_key=True)
    code_competence = models.CharField(max_length=10, unique=True, null=True, blank=True)
    libelle = models.CharField(max_length=100, unique=True)
    categorie = models.CharField(max_length=50, null=True, blank=True)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='competence_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='competence_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'competence'

