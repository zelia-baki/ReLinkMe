from django.shortcuts import render
from administrateur.models import Administrateur
from core.models import Utilisateur
from administrateur.serializers import AdministrateurSerializer, UtilisateurSerializers, \
    UtilisateurVerificationSerializers
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone


CUSTOM_ERROR_MESSAGES = {
    'DoesNotExist': "Cet utilisateur n'existe pas",
    'IntegrityError': "Conflit de données dans la base.",
    'ValidationError': "Les données fournies sont invalides.",
}

#create/<int:id_utilisateur>/<int:id_admin>
@api_view(['POST'])
def create_admin(request, id_utilisateur, id_admin=0):
    try:
        print("TIMEZONE NOW:", timezone.now(), type(timezone))
        utilisateur = Utilisateur.objects.get(id=id_utilisateur)
        is_admin = Administrateur.objects.filter(utilisateur=utilisateur).first()

        if is_admin:
            return Response({
                "success": False,
                "message": "Cet utilisateur est déjà un administrateur",
            }, status=status.HTTP_200_OK)

        niveau_autorisation = request.data.get('niveau_autorisation')
        departement = request.data.get('departement')

        if id_admin != 0:
            admin = Utilisateur.objects.get(id=id_admin)
            created_by = admin
            modified_by = admin
        else:
            created_by = utilisateur
            modified_by = utilisateur

        administrateur = Administrateur.objects.create(
            utilisateur=utilisateur,
            niveau_autorisation=niveau_autorisation,
            departement=departement,
            created_by=created_by,
            modified_by=modified_by
        )

        return Response({
            "success": True,
            "message": "Administrateur créé avec succès",
        }, status=status.HTTP_201_CREATED)

    except Utilisateur.DoesNotExist:
        return Response({
            "success": False,
            "message": "Utilisateur introuvable"
        }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#delete/<str:code_admin>
@api_view(['POST'])
def delete_admin(request,code_admin):
    try:
        admin = Administrateur.objects.get(code_admin=code_admin)
        admin.delete()
        return Response({"success":True, "message":"Administrateur supprimé"},status=status.HTTP_200_OK)

    except Exception as e:
        error_type = e.__class__.__name__
        message = CUSTOM_ERROR_MESSAGES.get(error_type, str(e))
        return Response({"success": False, "message": message, "error": error_type},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#update/<str:code_admin>/<str:code_manipulator>
@api_view(['POST'])
def update_admin(request, code_admin, code_manipulator):
    try:
        # Get the manipulator (user making the change)
        manipulator = Utilisateur.objects.get(code_utilisateur=code_manipulator)

        # Get the admin to update
        admin = Administrateur.objects.get(code_admin=code_admin)
        user = Utilisateur.objects.get(id=admin.utilisateur_id)

        ###### Admin section #########
        admin_fields = ['niveau_autorisation', 'departement']
        updated_admin_fields = []
        for field in admin_fields:
            new_value = request.data.get(field)
            if new_value is not None and getattr(admin, field) != new_value:
                setattr(admin, field, new_value)
                updated_admin_fields.append(field)

        if updated_admin_fields:
            admin.modified_by = manipulator
            updated_admin_fields.append('modified_by')
            admin.save(update_fields=updated_admin_fields)

        ###### User section #########
        user_fields = ['nom_complet', 'email', 'role', 'photo_profil', 'telephone']
        updated_user_fields = []
        for field in user_fields:
            new_value = request.data.get(field)
            if new_value is not None and getattr(user, field) != new_value:
                setattr(user, field, new_value)
                updated_user_fields.append(field)

        if updated_user_fields:
            user.save(update_fields=updated_user_fields)

        return Response(
            {"success": True, "message": "Administrateur modifié avec succès"},
            status=status.HTTP_200_OK
        )

    except Administrateur.DoesNotExist:
        return Response({"success": False, "message": "Administrateur non trouvé", "error": "NotFound"},
                        status=status.HTTP_404_NOT_FOUND)
    except Utilisateur.DoesNotExist:
        return Response({"success": False, "message": "Utilisateur non trouvé", "error": "NotFound"},
                        status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        error_type = e.__class__.__name__
        message = CUSTOM_ERROR_MESSAGES.get(error_type, str(e))
        return Response({"success": False, "message": message, "error": error_type},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#list
@api_view(['GET'])
def get_list_admin(request):
    try:
        list_admin = Administrateur.objects.all().order_by('updated_at').reverse()

        return Response({"success":True,"message":'',"list": AdministrateurSerializer(list_admin,many=True).data},status=status.HTTP_200_OK)

    except Exception as e:
        error_type = e.__class__.__name__
        message = CUSTOM_ERROR_MESSAGES.get(error_type, str(e))
        return Response({"success": False, "message": message, "error": error_type},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#<str:code_admin>
@api_view(['GET'])
def get_single_administrator(request,code_admin):
    try:
        admin = Administrateur.objects.get(code_admin=code_admin)
        return Response({"success": True, "message": '', "list": AdministrateurSerializer(admin).data},
                    status=status.HTTP_200_OK)

    except Exception as e:
        error_type = e.__class__.__name__
        message = CUSTOM_ERROR_MESSAGES.get(error_type, str(e))
        return Response({"success": False, "message": message, "error": error_type},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_users(request):
    try:
        list_user = Utilisateur.objects.values('id','nom_complet','photo_profil')
        return Response({"success": True, "message": '', "list": UtilisateurSerializers(list_user,many=True).data},
                    status=status.HTTP_200_OK)

    except Exception as e:
        error_type = e.__class__.__name__
        message = CUSTOM_ERROR_MESSAGES.get(error_type, str(e))
        return Response({"success": False, "message": message, "error": error_type},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_single_user(request,id_utilisateur):
    try:
        user= Utilisateur.objects.filter(id=id_utilisateur).values('code_utilisateur','nom_complet','email','localisation')

        return Response({
            "success": True,
            "message": "",
            "list": UtilisateurVerificationSerializers(user,many=True).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)