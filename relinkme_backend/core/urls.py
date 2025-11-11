from django.urls import path
from .views import HelloView, UtilisateurListView

urlpatterns = [
    path('hello/', HelloView.as_view(), name='hello'),
    path('utilisateurs/', UtilisateurListView.as_view(), name='utilisateurs'),
]
