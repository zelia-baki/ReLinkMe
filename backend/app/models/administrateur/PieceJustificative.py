from django.db import models
from ..autres.Utilisateur import Utilisateur

class PieceTypeEnum(models.TextChoices):
    PASSEPORT = 'passeport', 'passeport'
    CARTE_IDENTITE = 'carte_identite', 'carte_identite'
    PERMIS_CONDUIRE = 'permis_conduire', 'permis_conduire'
    JUSTIFICATIF_DOMICILE = 'justificatif_domicile', 'justificatif_domicile'
    DIPLOME = 'diplome', 'diplome'
    CERTIFICAT_TRAVAIL = 'certificat_travail', 'certificat_travail'
    AUTRE = 'autre', 'autre'
class PieceStatutEnum(models.TextChoices):
    EN_ATTENTE = 'en_attente', 'en_attente'
    APPROUVE = 'approuve', 'approuve'
    REFUSE = 'refuse', 'refuse'
    EXPIRE = 'expire', 'expire'

class PieceJustificative(models.Model):
    id = models.AutoField(primary_key=True)
    code_piece = models.CharField(max_length=10, unique=True, null=True, blank=True)
    id_utilisateur = models.ForeignKey(Utilisateur, related_name='pieces_justificatives', on_delete=models.CASCADE)
    type_piece = models.CharField(max_length=50, choices=PieceTypeEnum.choices)
    numero_piece = models.CharField(max_length=100, null=True, blank=True)
    fichier_url = models.CharField(max_length=255)
    date_emission = models.DateField(null=True, blank=True)
    date_expiration = models.DateField(null=True, blank=True)
    pays_emission = models.CharField(max_length=100, null=True, blank=True)
    statut_verification = models.CharField(max_length=50, choices=PieceStatutEnum.choices, default=PieceStatutEnum.EN_ATTENTE)

    created_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='piece_created_set', on_delete=models.SET_NULL)
    modified_by = models.ForeignKey(Utilisateur, null=True, blank=True, related_name='piece_modified_set', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'piece_justificative'