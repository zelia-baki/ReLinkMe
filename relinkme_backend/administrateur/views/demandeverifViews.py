from datetime import datetime
from django.db import transaction
from django.utils import timezone

from core.models import Utilisateur
from administrateur.models import DemandeVerification, Administrateur, HistoriqueValidation, VerificationLocalisation, \
    PieceJustificative
from administrateur.serializers import DemandeVerificationSerializer, VerifLocationSerializer, \
    UtilisateurVerificationSerializers, PieceSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def create_demande_verif(request,id_utilisateur):
    try:
        utilisateur = Utilisateur.objects.get(id=id_utilisateur)
        type_verification = request.data.get('type_verification')
        statut = request.data.get('statut')
        created_by = utilisateur
        demande = DemandeVerification.objects.create(
            id_utilisateur= utilisateur,
            type_verification= type_verification,
            statut= statut,
            created_by=created_by
        )

        return Response({
            "success": True,
            "message": "Demande envoyé avec succès",
            "data" : DemandeVerificationSerializer(demande).data
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

@api_view(['POST'])
def traiter_demande(request,id_demande_traiter,id_admin_responsable):
    try:
        admin_responsable = Administrateur.objects.get(id=id_admin_responsable)
        admin_id = admin_responsable.utilisateur_id

        utilisateur_responsable = Utilisateur.objects.get(id=admin_id)
        demande_traiter = DemandeVerification.objects.get(id=id_demande_traiter)
        type_verification = demande_traiter.type_verification

        statut = request.data.get('statut')
        motif_refus = request.data.get('motif_refus')
        modified_by = utilisateur_responsable

        demande_traiter.id_admin_responsable = admin_responsable
        demande_traiter.statut = statut
        demande_traiter.motif_refus = motif_refus
        demande_traiter.modified_by = modified_by

        if demande_traiter.date_traitement is None:
            date_traitement = datetime.now()
            demande_traiter.date_traitement = date_traitement
        action={
            "approuvee": "validation_compte",
            "refusee":"refus_compte"
        }

        with transaction.atomic():
            demande_traiter.save()

            history_data = {
                'id_admin': id_admin_responsable,
                'id_utilisateur_cible': demande_traiter.id_utilisateur.id,
                'type_action': action[statut],
                'table_concernee': DemandeVerification._meta.db_table,
                'id_enregistrement': demande_traiter.id,
                'details': f"{action[statut]} de vérification {type_verification}"
            }

            print(history_data)
            history = HistoriqueValidation()
            history.create_history_object(history_data)

        return Response({
            "success": True,
            "message": "Demande traité avec succès",
            "data": DemandeVerificationSerializer(demande_traiter).data
        }, status=status.HTTP_200_OK)

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

@api_view(['POST'])
def lister_demandes(request):
    try:
        statut= request.query_params.get('statut')
        code_admin = request.data.get('code_admin')
        admin_role = Administrateur.objects.get(code_admin=code_admin).niveau_autorisation

        if admin_role == "admin_moderation":
            return Response({
                "success": False,
                "message": "Cet utilisateur n'est pas autorisé à consulter",
                "data": []
            }, status=status.HTTP_401_UNAUTHORIZED)

        match statut:
            case 'all':
                list_demande = DemandeVerification.objects.all()
            case 'en_cours':
                list_demande = DemandeVerification.objects.filter(statut='en_cours')
            case 'approuvee':
                list_demande = DemandeVerification.objects.filter(statut='approuvee')
            case ' refusee':
                list_demande = DemandeVerification.objects.filter(statut='refusee')
            case _:
                list_demande = DemandeVerification.objects.filter(statut='en_attente')

        return Response({
            "success": True,
            "message": "",
            "list": DemandeVerificationSerializer(list_demande,many=True).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def single_demande(request,demande_id):
    try:
        code_admin = request.data.get('code_admin')
        admin_role = Administrateur.objects.get(code_admin=code_admin).niveau_autorisation

        if admin_role == "admin_moderation":
            return Response({
                "success": False,
                "message": "Cet utilisateur n'est pas autorisé à consulter",
                "data": []
            }, status=status.HTTP_401_UNAUTHORIZED)

        list_demande = DemandeVerification.objects.get(id=demande_id)

        return Response({
            "success": True,
            "message": "",
            "list": DemandeVerificationSerializer(list_demande).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==========================
#   DEMANDE VERIFICATION LOCALISATION
# ==========================
@api_view(['GET'])
def list_verif_location(request, code_admin):
    try:
        statut = request.query_params.get('statut')
        admin_role = Administrateur.objects.get(code_admin=code_admin).niveau_autorisation


        if admin_role == "admin_moderation":
            return Response({
                "success": False,
                "message": "Cet utilisateur n'est pas autorisé à consulter",
                "demande": []
            }, status=status.HTTP_401_UNAUTHORIZED)

        match statut:
            case 'all':
                list_loc = VerificationLocalisation.objects.all()
            case 'verifie':
                list_loc = VerificationLocalisation.objects.filter(statut='verifie')
            case 'refuse':
                list_loc = VerificationLocalisation.objects.filter(statut='refuse')
            case _:
                list_loc = VerificationLocalisation.objects.filter(statut='en_attente')

        return Response({
            "success": True,
            "message": "",
            "list": VerifLocationSerializer(list_loc, many=True).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def single_loc(request,demande_id):
    try:
        code_admin = request.data.get('code_admin')
        admin_role = Administrateur.objects.get(code_admin=code_admin).niveau_autorisation

        if admin_role == "admin_moderation":
            return Response({
                "success": False,
                "message": "Cet utilisateur n'est pas autorisé à consulter",
                "data": []
            }, status=status.HTTP_401_UNAUTHORIZED)

        list_demande = VerificationLocalisation.objects.get(id=demande_id)

        return Response({
            "success": True,
            "message": "",
            "list": VerifLocationSerializer(list_demande).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_location(request, id_utilisateur):
    try:
        user_data= {
            'id_utilisateur': id_utilisateur,
            'statut': 'en_attente'
        }
        location = VerificationLocalisation()
        location.create_verif_loc(user_data)
        return Response({
            "success": True,
            "message": "",
            "data": VerifLocationSerializer(location).data
        }, status=status.HTTP_200_OK)


    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def update_verif_loc(request, id_verif_loc, id_admin_verif):
    try:
        # --- Fetch main objects ---
        admin_verif = Administrateur.objects.get(id=id_admin_verif)
        verif_loc = VerificationLocalisation.objects.get(id=id_verif_loc)

        # --- Permissions ---
        if admin_verif.niveau_autorisation == "admin_moderation":
            return Response({
                "success": False,
                "message": "Cet utilisateur n'est pas autorisé à effectuer cette action"
            }, status=status.HTTP_403_FORBIDDEN)

        # --- Validate statut ---
        statut = request.data.get("statut")

        # Mapping statut → action stored in history
        action_map = {
            "verifie": "validation_compte",
            "refuse": "refus_compte"
        }
        action = action_map.get(statut)
        # --- Update verif_loc object ---
        verif_loc.statut = statut
        verif_loc.modified_by = admin_verif.utilisateur
        verif_loc.date_verification=timezone.now()
        # --- Atomic operation ---
        with transaction.atomic():
            verif_loc.save()

            history_data = {
                'id_admin': admin_verif.id,
                'id_utilisateur_cible': verif_loc.id_utilisateur.id,
                'type_action': action_map[statut],
                'table_concernee': VerificationLocalisation._meta.db_table,
                'id_enregistrement': verif_loc.id,
                'details': f"{action_map[statut]} de localisation"
            }

            history = HistoriqueValidation()
            history.create_history_object(history_data)

        return Response({
            "success": True,
            "message": "Vérification effectuée avec succès",
            "data": VerifLocationSerializer(verif_loc).data
        }, status=status.HTTP_200_OK)

    except Administrateur.DoesNotExist:
        return Response({
            "success": False,
            "message": "Administrateur introuvable"
        }, status=status.HTTP_404_NOT_FOUND)

    except VerificationLocalisation.DoesNotExist:
        return Response({
            "success": False,
            "message": "Demande de vérification introuvable"
        }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        # Final fallback for unexpected errors
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_pièce_jusitificative(request,utilisateur_id):
    try:
        piece = PieceJustificative.objects.get(id_utilisateur=utilisateur_id)

        return Response({
            "success": True,
            "message": "",
            "list": PieceSerializer(piece).data
        }, status=status.HTTP_200_OK)


    except Exception as e:
        # Final fallback for unexpected errors
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)