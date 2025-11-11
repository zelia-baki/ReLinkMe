from django.db import models
from .Administrateur import Administrateur
from ..autres.Utilisateur import Utilisateur
from ..chomeur.Exploit import Exploit
from ..recruteur.Offre import Offre

class SignalementTypeEnum(models.TextChoices):
    PROFIL_FRAUDULEUX = 'profil_frauduleux', 'profil_frauduleux'
    CONTENU_INAPPROPRIE = 'contenu_inapproprie', 'contenu_inapproprie'
    SPAM = 'spam', 'spam'
    HARCELEMENT = 'harcelement', 'harcelement'
    FAUSSE_OFFRE = 'fausse_offre', 'fausse_offre'
    AUTRE = 'autre', 'autre'

class SignalementStatutEnum(models.TextChoices):
    EN_ATTENTE = 'en_attente', 'en_attente'
    EN_COURS = 'en_cours', 'en_cours'
    TRAITE = 'traite', 'traite'
    REJETE = 'rejete', 'rejete'

class Signalement(models.Model):
    id = models.AutoField(primary_key=True)
    code_signalement = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_signaleur = models.ForeignKey(Utilisateur, related_name='signalements_signaleur', on_delete=models.CASCADE)
    id_utilisateur_signale = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='signalements_utilisateur', on_delete=models.CASCADE)
    id_offre = models.ForeignKey(Offre, null=True, blank=True, related_name='signalements_offre', on_delete=models.CASCADE)
    id_exploit = models.ForeignKey(Exploit, null=True, blank=True, related_name='signalements_exploit', on_delete=models.CASCADE)
    type_signalement = models.CharField(max_length=50, choices=SignalementTypeEnum.choices)
    description = models.TextField()
    preuves_url = models.CharField(max_length=255, null=True, blank=True)
    statut = models.CharField(max_length=50, choices=SignalementStatutEnum.choices, default=SignalementStatutEnum.EN_ATTENTE)
    id_admin_responsable = models.ForeignKey(Administrateur, null=True, blank=True, related_name='signalement_admin_responsable', on_delete=models.SET_NULL)
    decision = models.TextField(null=True, blank=True)
    date_signalement = models.DateTimeField(auto_now_add=True)
    date_traitement = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='signalement_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='signalement_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'signalement'

