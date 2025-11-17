from django.urls import path
from administrateur.views.adminViews import *
from administrateur.views.signalementViews import *

urlpatterns= [
    path('create/<int:id_utilisateur>/<int:id_admin>', create_admin ),
    path('delete/<str:code_admin>',delete_admin),
    path('update/<str:code_admin>/<str:code_manipulator>',update_admin),
    path('list',get_list_admin),
    path('list/<str:code_admin>',get_single_administrator),
    path('signalement/create/<int:id_signaleur>/<int:id_utilisateur_signale>',signaler),
    path('signalement/traitement/<int:id_signalement>/<int:id_admin_responsable>',traiter_signalement),
    path('signalement/delete/<int:id_signalement>',delete_admin),
    path('signalement/liste',lister_signalement),
    path('signalement/<int:signalement_id>',single_signal),
    path('users',get_users),
    path('user/<int:id_utilisateur>',get_single_user)


]