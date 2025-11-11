from django.db import models
from ..autres.Utilisateur import Utilisateur
from .Recruteur import Recruteur

class TypeOffreEnum(models.TextChoices):
    EMPLOI = 'emploi', 'emploi'
    SERVICE = 'service', 'service'
    MISSION = 'mission', 'mission'

class TypeContratEnum(models.TextChoices):
    CDI = 'CDI', 'CDI'
    CDD = 'CDD', 'CDD'
    FREELANCE = 'freelance', 'freelance'
    STAGE = 'stage', 'stage'
    ALTERNANCE = 'alternance', 'alternance'


class OffreStatutEnum(models.TextChoices):
    OUVERTE = 'ouverte', 'ouverte'
    FERMEE = 'fermée', 'fermée'
    POURVUE = 'pourvue', 'pourvue'

class Offre(models.Model):
    id = models.AutoField(primary_key=True)
    code_offre = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_recruteur = models.ForeignKey(Recruteur, related_name='offres', on_delete=models.CASCADE)
    titre = models.CharField(max_length=200)
    description = models.TextField()
    type_offre = models.CharField(max_length=20, choices=TypeOffreEnum.choices)
    localisation = models.CharField(max_length=150, null=True, blank=True)
    fourchette_salaire = models.CharField(max_length=100, null=True, blank=True)
    type_contrat = models.CharField(max_length=20, choices=TypeContratEnum.choices, null=True, blank=True)
    date_limite = models.DateField(null=True, blank=True)
    statut = models.CharField(max_length=20, choices=OffreStatutEnum.choices, default=OffreStatutEnum.OUVERTE)
    jetons_requis = models.IntegerField(default=0)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='offre_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='offre_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'offre'
