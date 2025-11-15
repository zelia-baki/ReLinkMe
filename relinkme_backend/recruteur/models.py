from django.db import models
from django.utils import timezone
from core.models import Utilisateur, Competence

class Recruteur(models.Model):
    id = models.BigAutoField(primary_key=True)
    code_recruteur = models.CharField(max_length=10, unique=True, null=True, blank=True)
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='profil_recruteur')
    type_recruteur = models.CharField(
        max_length=20,
        choices=[('individuel', 'Individuel'), ('entreprise', 'Entreprise')],
        default='entreprise'
    )
    nom_entreprise = models.CharField(max_length=150, null=True, blank=True)
    site_web = models.CharField(max_length=150, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    secteur_activite = models.CharField(max_length=100, null=True, blank=True)
    nombre_employes = models.IntegerField(null=True, blank=True)
    solde_jetons = models.IntegerField(default=0)
    created_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='recruteurs_crees')
    modified_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='recruteurs_modifies')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'recruteur'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_recruteur:
            prefix = 'ENT' if self.type_recruteur == 'entreprise' else 'IND'
            self.code_recruteur = f"{prefix}{str(self.id).zfill(5)}"
            super().save(update_fields=['code_recruteur'])
    def __str__(self):
        return self.nom_entreprise or self.utilisateur.nom_complet


class Offre(models.Model):
    id = models.BigAutoField(primary_key=True)
    code_offre = models.CharField(max_length=10, unique=True, null=True, blank=True)
    recruteur = models.ForeignKey(Recruteur, on_delete=models.CASCADE)
    titre = models.CharField(max_length=150)
    description = models.TextField()
    type_contrat = models.CharField(max_length=50)
    salaire = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    date_limite = models.DateField(null=True, blank=True)
    
    # ⭐ MODIFICATION ICI
    STATUT_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('closed', 'Fermée'),
    ]
    
    statut = models.CharField(
        max_length=30, 
        choices=STATUT_CHOICES,
        default='active'
    )
    
    date_creation = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'offre'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_offre:
            self.code_offre = f"OFF{str(self.id).zfill(5)}"
            super().save(update_fields=['code_offre'])

    def __str__(self):
        return self.titre


class OffreCompetence(models.Model):
    id = models.BigAutoField(primary_key=True)
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE)
    competence = models.ForeignKey(Competence, on_delete=models.CASCADE)
    niveau_requis = models.CharField(
        max_length=20,
        choices=[('débutant', 'Débutant'), ('intermédiaire', 'Intermédiaire'), ('expert', 'Expert')],
        default='intermédiaire'
    )

    class Meta:
        db_table = 'offre_competence'
        unique_together = ('offre', 'competence')

    def __str__(self):
        return f"{self.offre} - {self.competence}"


class TestCompetence(models.Model):
    id = models.BigAutoField(primary_key=True)
    code_test = models.CharField(max_length=10, unique=True, null=True, blank=True)
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE)
    competence = models.ForeignKey(Competence, on_delete=models.CASCADE)
    question = models.TextField()
    reponse_correcte = models.TextField()
    score = models.IntegerField(default=0)
    date_creation = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'test_competence'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_test:
            self.code_test = f"TST{str(self.id).zfill(5)}"
            super().save(update_fields=['code_test'])

    def __str__(self):
        return f"Test {self.competence} ({self.offre})"
