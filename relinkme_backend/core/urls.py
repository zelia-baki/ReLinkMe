# core/urls.py
from django.urls import path
from .views import (
    # Views existantes
    HelloView, 
    UtilisateurListView,
    LoginView,
    LogoutView,
    CurrentUserView,
    CompetenceListCreateView,
    CompetenceDetailView,
<<<<<<< HEAD
    competences_disponibles_pour_chomeur,
=======
    
    # 🆕 Nouvelles views pour candidatures
    # Chômeur
    MesCandidaturesListView,
    CandidatureCreateView,
    MaCandidatureDetailView,
    
    # Recruteur
    CandidaturesRecuesListView,
    CandidatureRecueDetailView,
    
    # Stats
    CandidatureStatsView,
>>>>>>> 8ad9ac1453190eadc16f4f645feb97f7200b1a8d
)

urlpatterns = [
    # ========================================
    # ROUTES EXISTANTES
    # ========================================
    path('hello/', HelloView.as_view(), name='hello'),
    path('utilisateurs/', UtilisateurListView.as_view(), name='utilisateurs'),
    
    # 🔐 Routes d'authentification
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    
    # Routes pour les compétences globales
    path('competences/', CompetenceListCreateView.as_view(), name='competence-list-create'),
    path('competences/<int:pk>/', CompetenceDetailView.as_view(), name='competence-detail'),
<<<<<<< HEAD
    path('competences/disponibles/', competences_disponibles_pour_chomeur, name='competences-disponibles'),  # 🆕 Nouvelle route

]
=======
    
    # ========================================
    # 🆕 NOUVELLES ROUTES CANDIDATURES
    # ========================================
    
    # CHÔMEUR - Mes candidatures
    path('candidatures/mes-candidatures/', MesCandidaturesListView.as_view(), name='mes-candidatures'),
    path('candidatures/postuler/', CandidatureCreateView.as_view(), name='postuler'),
    path('candidatures/mes-candidatures/<int:pk>/', MaCandidatureDetailView.as_view(), name='ma-candidature-detail'),
    
    # RECRUTEUR - Candidatures reçues
    path('candidatures/recues/', CandidaturesRecuesListView.as_view(), name='candidatures-recues'),
    path('candidatures/recues/<int:pk>/', CandidatureRecueDetailView.as_view(), name='candidature-recue-detail'),
    
    # STATISTIQUES
    path('candidatures/stats/', CandidatureStatsView.as_view(), name='candidatures-stats'),
]
>>>>>>> 8ad9ac1453190eadc16f4f645feb97f7200b1a8d
