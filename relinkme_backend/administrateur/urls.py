from django.urls import path
from administrateur.views.adminViews import *

urlpatterns= [
    path('create/<int:id_utilisateur>/<int:id_admin>', create_admin ),
    path('delete/<str:code_admin>',delete_admin),
    path('update/<str:code_admin>/<str:code_manipulator>',update_admin),
    path('list',get_list_admin),
    path('<str:code_admin>',get_single_administrator),
]