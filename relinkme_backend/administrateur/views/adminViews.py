from datetime import datetime

from django.db.models import Count
from django.db.models.functions import ExtractMonth
from django.shortcuts import render

from administrateur.AdminLoginSerializer import AdminLoginSerializer
from administrateur.models import Administrateur, HistoriqueValidation, VerificationLocalisation, DemandeVerification, \
    Signalement
from core.models import Utilisateur, Candidature
from administrateur.serializers import AdministrateurSerializer, UtilisateurSerializers, \
    UtilisateurVerificationSerializers, HistoriqueSerializer, AdminUserSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone

from core.serializers import UtilisateurSerializer
from recruteur.models import Offre

CUSTOM_ERROR_MESSAGES = {
    'DoesNotExist': "Cet utilisateur n'existe pas",
    'IntegrityError': "Conflit de données dans la base.",
    'ValidationError': "Les données fournies sont invalides.",
}

@api_view(['POST'])
def admin_login(request):
    serializer = AdminLoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data["user"]
        admin_profile = serializer.validated_data["admin"]

        return Response({
            "success": True,
            "id": admin_profile.id,
            "code_admin": admin_profile.code_admin,
            "nom_complet": user.nom_complet,
            "email": user.email,
            "role":admin_profile.niveau_autorisation
        }, status=status.HTTP_200_OK)

    return Response({
        "success": False,
        "message": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

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

@api_view(['GET'])
def get_list_admin_user(request,id_admin=0):
    try:


        if id_admin != 0:
            list_admin = Administrateur.objects.select_related('utilisateur').get(id=id_admin)
            return Response(
                {"success": True, "message": '', "list": AdminUserSerializer(list_admin).data},
                status=status.HTTP_200_OK)
        else:
            list_admin = Administrateur.objects.select_related('utilisateur').all()
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
def get_non_admin_users(request):
    try:
        list_user = Utilisateur.objects.values('id','nom_complet','photo_profil').exclude(role="admin")
        return Response({"success": True, "message": '', "list": UtilisateurSerializers(list_user,many=True).data},
                    status=status.HTTP_200_OK)

    except Exception as e:
        error_type = e.__class__.__name__
        message = CUSTOM_ERROR_MESSAGES.get(error_type, str(e))
        return Response({"success": False, "message": message, "error": error_type},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_all_users(request):
    try:
        list_user = Utilisateur.objects.all()
        role = request.query_params.get('role')

        if role != "all":
            list_user = Utilisateur.objects.filter(role=role)

        return Response({"success": True, "message": '', "list": UtilisateurSerializer(list_user,many=True).data},
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

@api_view(['GET'])
def get_all_history(request,code_admin):
    try:
        role= Administrateur.objects.get(code_admin=code_admin).niveau_autorisation
        user_admin = request.query_params.get("admin")
        if (role != "super_admin"):
            return Response({
                "success": False,
                "message": "Cet utilisateur n'est pas autorisé à consulter",
                "data": []
            }, status=status.HTTP_401_UNAUTHORIZED)

        liste = HistoriqueValidation.objects.all()

        if user_admin is not None and user_admin != "0" and user_admin != "":
            liste = HistoriqueValidation.objects.filter(id_admin=(int) (user_admin))

        return Response({
            "success": True,
            "message": "",
            "list": HistoriqueSerializer(liste,many=True).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_offre_count_per_month(request):
    try:
        current_year = datetime.now().year
        liste = Offre.objects\
            .filter(date_creation__year=current_year)\
            .annotate(month=ExtractMonth('date_creation')) \
            .values('month') \
            .annotate(count=Count('id')) \
            .order_by('month')

        return Response({
            "success": True,
            "message": "",
            "list": liste
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_candidature_count_per_month(request):
    try:
        current_year = datetime.now().year
        liste = Candidature.objects\
            .filter(created_at__year=current_year)\
            .annotate(month=ExtractMonth('created_at')) \
            .values('month') \
            .annotate(count=Count('id')) \
            .order_by('month')

        return Response({
            "success": True,
            "message": "",
            "list": liste
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user_statistics(request):
    try:
        chom = Utilisateur.objects.filter(role="chomeur").count()
        recruteur = Utilisateur.objects.filter(role="recruteur").count()
        localisation = VerificationLocalisation.objects.filter(statut="en_attente").count()
        identite = DemandeVerification.objects.filter(statut__in=["en_attente","en_cours"]).count()
        signalement = Signalement.objects.filter(statut__in=["en_attente","en_cours"]).count()

        liste=[{
            "chomeur":chom,
            "recruteur":recruteur,
            "localisation":localisation,
            "identite":identite,
            "signalement":signalement
        }]

        return Response({
            "success": True,
            "message": "",
            "list": liste
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)