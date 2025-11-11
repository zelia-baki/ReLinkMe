from django.db import models
from django.utils import timezone
from core.models import Utilisateur, Competence

class Chomeur(models.Model):
    id = models.BigAutoField(primary_key=True)
    code_chomeur = models.CharField(max_length=10, unique=True, null=True, blank=True)
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='profil_chomeur')
    profession = models.CharField(max_length=150, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    niveau_expertise = models.CharField(
        max_length=20,
        choices=[('débutant', 'Débutant'), ('intermédiaire', 'Intermédiaire'), ('expert', 'Expert')],
        default='débutant'
    )
    solde_jetons = models.IntegerField(default=0)
    created_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='chomeurs_crees')
    modified_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='chomeurs_modifies')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chomeur'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_chomeur:
            self.code_chomeur = f"CHOM{str(self.id).zfill(5)}"
            super().save(update_fields=['code_chomeur'])

    def __str__(self):
        return f"{self.utilisateur.nom_complet} ({self.profession or 'Sans profession'})"


class ChomeurCompetence(models.Model):
    id = models.BigAutoField(primary_key=True)
    chomeur = models.ForeignKey(Chomeur, on_delete=models.CASCADE)
    competence = models.ForeignKey(Competence, on_delete=models.CASCADE)
    niveau = models.CharField(
        max_length=20,
        choices=[('débutant', 'Débutant'), ('intermédiaire', 'Intermédiaire'), ('expert', 'Expert')],
        default='débutant'
    )

    class Meta:
        db_table = 'chomeur_competence'
        unique_together = ('chomeur', 'competence')

    def __str__(self):
        return f"{self.chomeur} - {self.competence}"


class Exploit(models.Model):
    id = models.BigAutoField(primary_key=True)
    code_exploit = models.CharField(max_length=10, unique=True, null=True, blank=True)
    chomeur = models.ForeignKey(Chomeur, on_delete=models.CASCADE)
    titre = models.CharField(max_length=150)
    description = models.TextField(null=True, blank=True)
    lien = models.CharField(max_length=255, null=True, blank=True)
    date_creation = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'exploit'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_exploit:
            self.code_exploit = f"EXP{str(self.id).zfill(5)}"
            super().save(update_fields=['code_exploit'])

    def __str__(self):
        return f"{self.titre} ({self.chomeur})"
