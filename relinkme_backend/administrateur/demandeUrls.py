from django.urls import path
from administrateur.views.demandeverifViews import *

urlpatterns = [
    path('<int:id_utilisateur>',create_demande_verif),
    path('traitement/<int:id_demande_traiter>/<int:id_admin_responsable>',traiter_demande),
    path('liste',lister_demandes)
]
