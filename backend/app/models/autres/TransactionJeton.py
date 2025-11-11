from django.db import models

from .Candidature import Candidature
from .Utilisateur import Utilisateur
from ..chomeur.Chomeur import Chomeur
from ..recruteur.Recruteur import Recruteur

class TypeTransactionEnum(models.TextChoices):
    ACHAT = 'achat', 'achat'
    GAIN_TEST = 'gain_test', 'gain_test'
    POSTULATION = 'postulation', 'postulation'
    REMBOURSEMENT = 'remboursement', 'remboursement'
    BONUS = 'bonus', 'bonus'
    DEPENSE_SERVICE = 'depense_service', 'depense_service'

class TransactionJeton(models.Model):
    id = models.AutoField(primary_key=True)
    code_transaction = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_chomeur = models.ForeignKey(Chomeur, null=True, blank=True, related_name='transactions', on_delete=models.CASCADE)
    id_recruteur = models.ForeignKey(Recruteur, null=True, blank=True, related_name='transactions', on_delete=models.SET_NULL)
    montant = models.IntegerField()
    type_transaction = models.CharField(max_length=50, choices=TypeTransactionEnum.choices)
    id_candidature = models.ForeignKey(Candidature, null=True, blank=True, related_name='transactions', on_delete=models.SET_NULL)
    description = models.CharField(max_length=255, null=True, blank=True)
    date_transaction = models.DateTimeField(auto_now_add=True)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='tx_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='tx_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transaction_jeton'