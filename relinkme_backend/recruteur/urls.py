# recruteur/urls.py
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    InscriptionRecruteurView,
    RecruteurViewSet, 
    OffreViewSet,
    OffreCompetenceViewSet,
    TestCompetenceViewSet
)

# Router pour les ViewSets
router = DefaultRouter()
router.register(r'recruteurs', RecruteurViewSet, basename='recruteur')
router.register(r'offres', OffreViewSet, basename='offre')
router.register(r'offres-competences', OffreCompetenceViewSet, basename='offre-competence')
router.register(r'tests-competences', TestCompetenceViewSet, basename='test-competence')

# URLs personnalisées
urlpatterns = [
    # 🆕 Route d'inscription publique
    path('inscription/', InscriptionRecruteurView.as_view(), name='inscription-recruteur'),
]

# Ajouter les routes du router
urlpatterns += router.urls