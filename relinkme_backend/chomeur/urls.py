# chomeur/urls.py
from django.urls import path
from .views import (
    HelloChomeurView,
    ChomeurListCreateView, ChomeurDetailView,
    ChomeurCompetenceListCreateView, ChomeurCompetenceDetailView,
    ExploitListCreateView, ExploitDetailView,
)

urlpatterns = [
    path('hello/', HelloChomeurView.as_view(), name='hello-chomeur'),

    # --- Chomeur CRUD ---
    path('chomeurs/', ChomeurListCreateView.as_view(), name='chomeur-list-create'),
    path('chomeurs/<int:pk>/', ChomeurDetailView.as_view(), name='chomeur-detail'),

    # --- ChomeurCompetence CRUD ---
    path('competences/', ChomeurCompetenceListCreateView.as_view(), name='chomeur-competence-list-create'),
    path('competences/<int:pk>/', ChomeurCompetenceDetailView.as_view(), name='chomeur-competence-detail'),

    # --- Exploit CRUD ---
    path('exploits/', ExploitListCreateView.as_view(), name='exploit-list-create'),
    path('exploits/<int:pk>/', ExploitDetailView.as_view(), name='exploit-detail'),
]
