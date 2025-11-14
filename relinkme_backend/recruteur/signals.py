from django.db.models.signals import post_save
from django.dispatch import receiver
from core.models import Utilisateur
from .models import Recruteur

@receiver(post_save, sender=Utilisateur)
def create_recruteur_profile(sender, instance, created, **kwargs):
    """
    Crée automatiquement un profil Recruteur
    lorsqu'un Utilisateur avec rôle 'recruteur' est créé.
    """
    if created and instance.role == 'recruteur':
        Recruteur.objects.create(utilisateur=instance)
