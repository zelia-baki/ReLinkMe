from django.db import models
from django.utils import timezone
from core.models import Utilisateur, Competence


# ============================================================
# 🧩 BaseModel - Gestion automatique des champs d'audit
# ============================================================
class BaseModel(models.Model):
    created_by = models.ForeignKey(
        Utilisateur, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="%(class)s_created"
    )
    modified_by = models.ForeignKey(
        Utilisateur, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="%(class)s_modified"
    )
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# ============================================================
# 💼 CHOMEUR
# ============================================================
class Chomeur(BaseModel):
    id = models.BigAutoField(primary_key=True)
    code_chomeur = models.CharField(max_length=10, unique=True, null=True, blank=True)
    utilisateur = models.OneToOneField(
        Utilisateur, on_delete=models.CASCADE, related_name='profil_chomeur'
    )
    profession = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    niveau_expertise = models.CharField(
        max_length=20,
        choices=[
            ('débutant', 'Débutant'),
            ('intermédiaire', 'Intermédiaire'),
            ('expert', 'Expert')
        ],
        default='débutant'
    )
    solde_jetons = models.IntegerField(default=0)

    class Meta:
        db_table = 'chomeur'

    def save(self, *args, **kwargs):
        """Simule le trigger SQL trig_chomeur_code."""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.code_chomeur:
            self.code_chomeur = f"CHOM{str(self.id).zfill(5)}"
            super().save(update_fields=['code_chomeur'])

    def __str__(self):
        return f"{self.utilisateur.nom_complet} ({self.profession or 'Sans profession'})"


# ============================================================
# 🧠 CHOMEUR_COMPETENCE
# ============================================================
class ChomeurCompetence(BaseModel):
    id = models.BigAutoField(primary_key=True)
    code_liaison = models.CharField(max_length=10, unique=True, null=True, blank=True)
    chomeur = models.ForeignKey(Chomeur, on_delete=models.CASCADE)
    competence = models.ForeignKey(Competence, on_delete=models.CASCADE)
    niveau_maitrise = models.CharField(
        max_length=20,
        choices=[
            ('débutant', 'Débutant'),
            ('intermédiaire', 'Intermédiaire'),
            ('avancé', 'Avancé'),
            ('expert', 'Expert')
        ],
        default='intermédiaire'
    )

    class Meta:
        db_table = 'chomeur_competence'
        unique_together = ('chomeur', 'competence')

    def save(self, *args, **kwargs):
        """Simule le trigger trig_chomeur_comp_code."""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.code_liaison:
            self.code_liaison = f"CC{str(self.id).zfill(6)}"
            super().save(update_fields=['code_liaison'])

    def __str__(self):
        return f"{self.chomeur} - {self.competence} ({self.niveau_maitrise})"


# ============================================================
# 🏆 EXPLOIT
# ============================================================
class Exploit(BaseModel):
    id = models.BigAutoField(primary_key=True)
    code_exploit = models.CharField(max_length=10, unique=True, null=True, blank=True)
    chomeur = models.ForeignKey(Chomeur, on_delete=models.CASCADE)
    titre = models.CharField(max_length=150)
    description = models.TextField(null=True, blank=True)
    lien = models.CharField(max_length=255, null=True, blank=True)
    fichiers = models.JSONField(null=True, blank=True)  # JSON dans ta BDD ✅
    date_publication = models.DateTimeField(default=timezone.now)
    visible = models.BooleanField(default=True)

    class Meta:
        db_table = 'exploit'

    def save(self, *args, **kwargs):
        """Simule le trigger trig_exploit_code."""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.code_exploit:
            self.code_exploit = f"EXPL{str(self.id).zfill(5)}"
            super().save(update_fields=['code_exploit'])

    def __str__(self):
        return f"{self.titre} ({self.chomeur})"
