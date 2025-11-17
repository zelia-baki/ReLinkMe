# core/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Utilisateur, Competence, Candidature, TransactionJeton, Evaluation


# ============================================
# ADMIN EXISTANTS (garder tel quel)
# ============================================

@admin.register(Utilisateur)
class UtilisateurAdmin(BaseUserAdmin):
    list_display = ['email', 'nom_complet', 'role', 'statut_verifie', 'date_inscription']
    list_filter = ['role', 'statut_verifie', 'date_inscription']
    search_fields = ['email', 'nom_complet']
    ordering = ['-date_inscription']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informations personnelles', {'fields': ('nom_complet', 'telephone', 'localisation', 'photo_profil')}),
        ('Permissions', {'fields': ('role', 'statut_verifie', 'is_active', 'is_staff', 'is_superuser')}),
        ('Dates importantes', {'fields': ('date_inscription', 'last_login')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nom_complet', 'password1', 'password2', 'role'),
        }),
    )


@admin.register(Competence)
class CompetenceAdmin(admin.ModelAdmin):
    list_display = ['code_competence', 'libelle', 'categorie', 'created_at']
    list_filter = ['categorie', 'created_at']
    search_fields = ['libelle', 'code_competence']
    readonly_fields = ['code_competence', 'created_at', 'updated_at']


@admin.register(TransactionJeton)
class TransactionJetonAdmin(admin.ModelAdmin):
    list_display = ['code_transaction', 'chomeur', 'montant', 'type_transaction', 'date_transaction']
    list_filter = ['type_transaction', 'date_transaction']
    search_fields = ['code_transaction', 'chomeur__utilisateur__nom_complet']
    readonly_fields = ['code_transaction', 'date_transaction']


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ['code_evaluation', 'chomeur', 'recruteur', 'note', 'type_evaluation', 'date_evaluation']
    list_filter = ['type_evaluation', 'note', 'date_evaluation']
    search_fields = ['code_evaluation', 'chomeur__utilisateur__nom_complet', 'recruteur__utilisateur__nom_complet']
    readonly_fields = ['code_evaluation', 'date_evaluation']


# ============================================
# 🆕 NOUVEL ADMIN POUR CANDIDATURES
# ============================================

@admin.register(Candidature)
class CandidatureAdmin(admin.ModelAdmin):
    list_display = [
        'code_candidature', 
        'get_chomeur_nom',
        'get_offre_titre',
        'statut', 
        'date_postulation',
        'jetons_utilises'
    ]
    list_filter = ['statut', 'date_postulation']
    search_fields = [
        'code_candidature', 
        'chomeur__utilisateur__nom_complet',
        'offre__titre'
    ]
    readonly_fields = [
        'code_candidature', 
        'date_postulation', 
        'created_at', 
        'updated_at'
    ]
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('code_candidature', 'chomeur', 'offre', 'statut')
        }),
        ('Candidature', {
            'fields': ('lettre_motivation', 'cv_fichier', 'jetons_utilises')
        }),
        ('Métadonnées', {
            'fields': ('date_postulation', 'created_by', 'modified_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_chomeur_nom(self, obj):
        return obj.chomeur.utilisateur.nom_complet
    get_chomeur_nom.short_description = 'Chômeur'
    get_chomeur_nom.admin_order_field = 'chomeur__utilisateur__nom_complet'
    
    def get_offre_titre(self, obj):
        return obj.offre.titre
    get_offre_titre.short_description = 'Offre'
    get_offre_titre.admin_order_field = 'offre__titre'
    
    # Filtres avancés
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('chomeur__utilisateur', 'offre__recruteur')
    
    # Actions personnalisées
    actions = ['accepter_candidatures', 'refuser_candidatures', 'marquer_vue']
    
    def accepter_candidatures(self, request, queryset):
        updated = queryset.update(statut='acceptee')
        self.message_user(request, f'{updated} candidature(s) acceptée(s).')
    accepter_candidatures.short_description = "✅ Accepter les candidatures sélectionnées"
    
    def refuser_candidatures(self, request, queryset):
        updated = queryset.update(statut='refusee')
        self.message_user(request, f'{updated} candidature(s) refusée(s).')
    refuser_candidatures.short_description = "❌ Refuser les candidatures sélectionnées"
    
    def marquer_vue(self, request, queryset):
        updated = queryset.update(statut='vue')
        self.message_user(request, f'{updated} candidature(s) marquée(s) comme vue(s).')
    marquer_vue.short_description = "👁️ Marquer comme vues"