# chomeur/admin.py
from django.contrib import admin
from .models import Chomeur, ChomeurCompetence, Exploit


@admin.register(Chomeur)
class ChomeurAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'code_chomeur',
        'utilisateur',
        'profession',
        'niveau_expertise',
        'solde_jetons',
        'created_at',
    )
    search_fields = ('code_chomeur', 'utilisateur__nom_complet', 'profession')
    list_filter = ('niveau_expertise',)
    ordering = ('-created_at',)


@admin.register(ChomeurCompetence)
class ChomeurCompetenceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'chomeur',
        'competence',
        'niveau_maitrise',  # ✅ mis à jour
        'created_at',
    )
    list_filter = ('niveau_maitrise',)  # ✅ mis à jour
    search_fields = (
        'chomeur__utilisateur__nom_complet',
        'competence__libelle',
    )
    ordering = ('-created_at',)


@admin.register(Exploit)
class ExploitAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'code_exploit',
        'chomeur',
        'titre',
        'date_publication',  # ✅ mis à jour
        'visible',
    )
    search_fields = ('titre', 'chomeur__utilisateur__nom_complet')
    list_filter = ('visible',)
    ordering = ('-date_publication',)  # ✅ mis à jour
