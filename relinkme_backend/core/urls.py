# core/urls.py
from django.urls import path
from .views import (
    HelloView, 
    UtilisateurListView,
    LoginView,
    LogoutView,
    CurrentUserView
)

urlpatterns = [
    path('hello/', HelloView.as_view(), name='hello'),
    path('utilisateurs/', UtilisateurListView.as_view(), name='utilisateurs'),
    
    # 🔐 Routes d'authentification
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]