from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Utilisateur, Competence, Candidature, TransactionJeton, Evaluation


@admin.register(Utilisateur)
class UtilisateurAdmin(BaseUserAdmin):
    list_display = ('code_utilisateur', 'nom_complet', 'email', 'role', 'statut_verifie', 'is_staff', 'date_inscription')
    list_filter = ('role', 'statut_verifie', 'is_staff', 'is_active')
    search_fields = ('nom_complet', 'email', 'code_utilisateur')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informations personnelles', {
            'fields': ('nom_complet', 'telephone', 'localisation', 'photo_profil')
        }),
        ('Rôle et permissions', {
            'fields': ('role', 'statut_verifie', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('Dates', {
            'fields': ('date_inscription', 'last_login')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nom_complet', 'password1', 'password2', 'role', 'is_staff', 'is_active')
        }),
    )
    
    readonly_fields = ('code_utilisateur', 'date_inscription', 'last_login')
    filter_horizontal = ('groups', 'user_permissions')


@admin.register(Competence)
class CompetenceAdmin(admin.ModelAdmin):
    list_display = ('code_competence', 'libelle', 'categorie', 'created_at')
    search_fields = ('libelle', 'categorie')
    list_filter = ('categorie',)


@admin.register(Candidature)
class CandidatureAdmin(admin.ModelAdmin):
    list_display = ('code_candidature', 'chomeur', 'offre', 'statut', 'date_postulation')
    list_filter = ('statut', 'date_postulation')
    search_fields = ('code_candidature', 'chomeur__id_utilisateur__nom_complet')


@admin.register(TransactionJeton)
class TransactionJetonAdmin(admin.ModelAdmin):
    list_display = ('code_transaction', 'type_transaction', 'montant', 'chomeur', 'date_transaction')
    list_filter = ('type_transaction', 'date_transaction')
    search_fields = ('code_transaction', 'description')


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('code_evaluation', 'chomeur', 'recruteur', 'note', 'type_evaluation', 'date_evaluation')
    list_filter = ('type_evaluation', 'note')
    search_fields = ('code_evaluation',)