from django.db import models
from ..autres.Utilisateur import Utilisateur

class TypeRecruteurEnum(models.TextChoices):
    INDIVIDUEL = 'individuel', 'individuel'
    ENTREPRISE = 'entreprise', 'entreprise'

class Recruteur(models.Model):
    id = models.AutoField(primary_key=True)
    code_recruteur = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_utilisateur = models.OneToOneField(Utilisateur, related_name='recruteur', on_delete=models.CASCADE)
    type_recruteur = models.CharField(max_length=20, choices=TypeRecruteurEnum.choices)
    nom_entreprise = models.CharField(max_length=150, null=True, blank=True)
    site_web = models.CharField(max_length=150, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    secteur_activite = models.CharField(max_length=100, null=True, blank=True)
    nombre_employes = models.IntegerField(null=True, blank=True)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='recruteur_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='recruteur_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'recruteur'
