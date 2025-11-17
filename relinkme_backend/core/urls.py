# core/urls.py
from django.urls import path
from .views import (
    HelloView, 
    UtilisateurListView,
    LoginView,
    LogoutView,
    CurrentUserView,
      # 🆕 Ajoutez ces imports
    CompetenceListCreateView,
    CompetenceDetailView,
    competences_disponibles_pour_chomeur,
)

urlpatterns = [
    path('hello/', HelloView.as_view(), name='hello'),
    path('utilisateurs/', UtilisateurListView.as_view(), name='utilisateurs'),
    
    # 🔐 Routes d'authentification
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
     # 🆕 Routes pour les compétences globales
    path('competences/', CompetenceListCreateView.as_view(), name='competence-list-create'),
    path('competences/<int:pk>/', CompetenceDetailView.as_view(), name='competence-detail'),
    path('competences/disponibles/', competences_disponibles_pour_chomeur, name='competences-disponibles'),  # 🆕 Nouvelle route

]
