from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from ..autres.Utilisateur import Utilisateur

class NiveauExpertiseEnum(models.TextChoices):
    DEBUTANT = 'débutant', 'débutant'
    INTERMEDIAIRE = 'intermédiaire', 'intermédiaire'
    EXPERT = 'expert', 'expert'

class Chomeur(models.Model):
    id = models.AutoField(primary_key=True)
    code_chomeur = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_utilisateur = models.OneToOneField(Utilisateur, related_name='chomeur', on_delete=models.CASCADE)
    profession = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    niveau_expertise = models.CharField(max_length=20, choices=NiveauExpertiseEnum.choices, default=NiveauExpertiseEnum.DEBUTANT)
    solde_jetons = models.IntegerField(default=0)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='chomeur_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='chomeur_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chomeur'