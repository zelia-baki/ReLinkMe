from django.db import models
from ..recruteur.Recruteur import Recruteur
from ..autres.Candidature import Candidature
from ..autres.Utilisateur import Utilisateur

class CommissionStatutEnum(models.TextChoices):
    EN_ATTENTE = 'en_attente', 'en_attente'
    PAYEE = 'payee', 'payee'
    ANNULEE = 'annulee', 'annulee'

class Commission(models.Model):
    id = models.AutoField(primary_key=True)
    code_commission = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_recruteur = models.ForeignKey(Recruteur, related_name='commissions', on_delete=models.CASCADE)
    id_candidature = models.ForeignKey(Candidature, related_name='commissions', on_delete=models.CASCADE)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    pourcentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    statut = models.CharField(max_length=50, choices=CommissionStatutEnum.choices, default=CommissionStatutEnum.EN_ATTENTE)
    date_generation = models.DateTimeField(auto_now_add=True)
    date_paiement = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='commission_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='commission_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'commission'
