from django.db import models
from django.utils import timezone
from core.models import Utilisateur

class Administrateur(models.Model):
    id = models.BigAutoField(primary_key=True)
    code_admin = models.CharField(max_length=10, unique=True, null=True, blank=True)
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='profil_admin')
    niveau_autorisation = models.CharField(
        max_length=30,
        choices=[
            ('super_admin', 'Super Admin'),
            ('admin_validation', 'Admin Validation'),
            ('admin_moderation', 'Admin Modération')
        ],
        default='admin_moderation'
    )
    departement = models.CharField(max_length=100, null=True, blank=True)
    created_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='admins_crees')
    modified_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='admins_modifies')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'administrateur'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_admin:
            self.code_admin = f"ADM{str(self.id).zfill(5)}"
            super().save(update_fields=['code_admin'])

    def __str__(self):
        return f"{self.utilisateur.nom_complet} ({self.niveau_autorisation})"

