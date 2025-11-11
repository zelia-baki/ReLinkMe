from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class RoleEnum(models.TextChoices):
    ADMIN = 'admin', 'admin'
    RECRUTEUR = 'recruteur', 'recruteur'
    CHOMEUR = 'chomeur', 'chomeur'

class Utilisateur(models.Model):
    id = models.AutoField(primary_key=True)
    code_utilisateur = models.CharField(max_length=10, unique=True, null=True, blank=True)
    nom_complet = models.CharField(max_length=150)
    email = models.EmailField(max_length=150, unique=True)
    mot_de_passe = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=RoleEnum.choices)
    photo_profil = models.CharField(max_length=255, null=True, blank=True)
    telephone = models.CharField(max_length=30, null=True, blank=True)
    localisation = models.CharField(max_length=150, null=True, blank=True)
    statut_verifie = models.BooleanField(default=False)
    date_inscription = models.DateTimeField(auto_now_add=True)

    created_by = models.ForeignKey('self', null=True, blank=True, related_name='utilisateur_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey('self', null=True, blank=True, related_name='utilisateur_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'utilisateur'