from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HelloView, UtilisateurViewSet

router = DefaultRouter()
router.register(r'utilisateurs', UtilisateurViewSet, basename='utilisateurs')

urlpatterns = [
    path('hello/', HelloView.as_view(), name='hello'),
    path('', include(router.urls)),
]
