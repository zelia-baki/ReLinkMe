from django.apps import AppConfig


class RecruteurConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'recruteur'

def ready(self):
    import recruteur.signals

