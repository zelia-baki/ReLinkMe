from django.db import models

from ..autres.Utilisateur import Utilisateur

class AdminNiveauEnum(models.TextChoices):
    SUPER_ADMIN = 'super_admin', 'super_admin'
    ADMIN_VALIDATION = 'admin_validation', 'admin_validation'
    ADMIN_MODERATION = 'admin_moderation', 'admin_moderation'

class Administrateur(models.Model):
    id = models.AutoField(primary_key=True)
    code_admin = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_utilisateur = models.OneToOneField(Utilisateur, related_name='administrateur', on_delete=models.CASCADE)
    niveau_autorisation = models.CharField(max_length=50, choices=AdminNiveauEnum.choices, default=AdminNiveauEnum.ADMIN_MODERATION)
    departement = models.CharField(max_length=100, null=True, blank=True)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='admin_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='admin_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'administrateur'