from django.db import models
from ..administrateur.Administrateur import Administrateur
from ..autres.Utilisateur import Utilisateur

class HistoriqueActionEnum(models.TextChoices):
    VALIDATION_COMPTE = 'validation_compte', 'validation_compte'
    REFUS_COMPTE = 'refus_compte', 'refus_compte'
    SUSPENSION = 'suspension', 'suspension'
    REACTIVATION = 'reactivation', 'reactivation'
    MODIFICATION_PROFIL = 'modification_profil', 'modification_profil'
    SUPPRESSION_CONTENU = 'suppression_contenu', 'suppression_contenu'

class HistoriqueValidation(models.Model):
    id = models.AutoField(primary_key=True)
    code_historique = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_admin = models.ForeignKey(Administrateur, related_name='historique_admin', on_delete=models.CASCADE)
    id_utilisateur_cible = models.ForeignKey(Utilisateur, related_name='historique_cible', on_delete=models.CASCADE)
    type_action = models.CharField(max_length=50, choices=HistoriqueActionEnum.choices)
    table_concernee = models.CharField(max_length=50, null=True, blank=True)
    id_enregistrement = models.IntegerField(null=True, blank=True)
    details = models.TextField(null=True, blank=True)
    date_action = models.DateTimeField(auto_now_add=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'historique_validation'