# chomeur/urls.py
from django.urls import path
from .views import (
    HelloChomeurView,
    InscriptionChomeurView,  # 👈 Nouvelle route
    ChomeurListCreateView,
    ChomeurDetailView,
    ChomeurCompetenceListCreateView,
    ChomeurCompetenceDetailView,
    ExploitListCreateView,
    ExploitDetailView,
    ProfilChomeurView,
    MesCompetencesView,
    MesExploitsView,
    BulkCompetencesView,
    BulkDeleteCompetencesView,
)

urlpatterns = [
    path('hello/', HelloChomeurView.as_view(), name='hello-chomeur'),
    
    # 🆕 Route d'inscription publique
    path('inscription/', InscriptionChomeurView.as_view(), name='inscription-chomeur'),
    
    # Routes CRUD existantes
    path('chomeurs/', ChomeurListCreateView.as_view(), name='chomeur-list-create'),
    path('chomeurs/<int:pk>/', ChomeurDetailView.as_view(), name='chomeur-detail'),
    
    path('competences/', ChomeurCompetenceListCreateView.as_view(), name='chomeur-competence-list'),
    path('competences/<int:pk>/', ChomeurCompetenceDetailView.as_view(), name='chomeur-competence-detail'),
    
    path('exploits/', ExploitListCreateView.as_view(), name='exploit-list'),
    path('exploits/<int:pk>/', ExploitDetailView.as_view(), name='exploit-detail'),
    path('mon-profil/', ProfilChomeurView.as_view(), name='mon-profil'),
    path('mes-competences/', MesCompetencesView.as_view(), name='mes-competences'),
    path('mes-exploits/', MesExploitsView.as_view(), name='mes-exploits'),
      path('mes-competences/bulk/', BulkCompetencesView.as_view(), name='bulk-competences'),
    path('mes-competences/bulk-delete/', BulkDeleteCompetencesView.as_view(), name='bulk-delete-competences'),
]