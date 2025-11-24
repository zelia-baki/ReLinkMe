from django.urls import path
from administrateur.views.demandeverifViews import *

urlpatterns = [
    path('create/<int:id_utilisateur>',create_demande_verif),
    path('traitement/<int:id_demande_traiter>/<int:id_admin_responsable>',traiter_demande),
    path('liste',lister_demandes),
    path('<int:demande_id>',single_demande),
    path('localisation/liste/<str:code_admin>',list_verif_location),
    path('localisation/<int:demande_id>',single_loc),
    path('localisation/create/<int:id_utilisateur>',create_location),
    path('localisation/traitement/<int:id_verif_loc>/<int:id_admin_verif>', update_verif_loc),
    path('justificatif/<int:utilisateur_id>',get_pièce_jusitificative)
]
