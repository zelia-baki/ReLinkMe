from django.db import transaction
from datetime import datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.utils import timezone

from administrateur.models import Signalement, Administrateur, HistoriqueValidation
from administrateur.serializers import SignalementSerializer
from chomeur.models import Exploit
from core.models import Utilisateur
from recruteur.models import Offre


@api_view(['POST'])
def signaler(request,id_signaleur, id_utilisateur_signale):
    try:
        id_offre = request.data.get('id_offre')
        id_exploit = request.data.get('id_exploit')
        type_signalement = request.data.get('type_signalement')
        description = request.data.get('description')
        preuves_url = request.data.get('preuves_url')
        statut = request.data.get('statut')

        signaleur = Utilisateur.objects.get(id=id_signaleur)
        if id_offre != None:
            offre=  Offre.objects.get(id=id_offre)
        else:
            offre = None
        if id_exploit != None:
            exploit = Exploit.objects.get(id=id_exploit)
        else:
            exploit = None
        signale = Utilisateur.objects.get(id=id_utilisateur_signale)
        created_by = signaleur
        signalement = Signalement(
            id_signaleur = signaleur,
            id_utilisateur_signale=signale,
            id_offre=offre,
            id_exploit=exploit,
            type_signalement=type_signalement,
            description=description,
            preuves_url=preuves_url,
            statut=statut,
            created_by=created_by
        )
        signalement.save()
        return Response({
            "success": True,
            "message": "Signalement envoyé avec succès",
            "data": SignalementSerializer(signalement).data
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
def lister_signalement(request):
    try:
        statut= request.query_params.get('statut')
        code_admin = request.data.get('code_admin')
        admin_role = Administrateur.objects.get(code_admin=code_admin).niveau_autorisation

        if admin_role == "admin_validation":
            return Response({
                "success": False,
                "message": "Cet utilisateur n'est pas autorisé à consulter",
                "data": []
            }, status=status.HTTP_401_UNAUTHORIZED)

        match statut:
            case 'all':
                list = Signalement.objects.all()
            case 'en_cours':
                list = Signalement.objects.filter(statut='en_cours')
            case 'approuvee':
                list = Signalement.objects.filter(statut='traite')
            case ' refusee':
                list = Signalement.objects.filter(statut='rejete')
            case _:
                list = Signalement.objects.filter(statut='en_attente')

        return Response({
            "success": True,
            "message": "",
            "data": Signalement(list,many=True).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def delete_signalement(request,id_signalement):
    try:
        signalement = Signalement.objects.get(id=id_signalement)
        signalement.delete()
        return Response({
            "success": True,
            "message": "",
            "data": Signalement(list, many=True).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def traiter_signalement(request,id_signalement,id_admin_responsable):
    try:
        signalement = Signalement.objects.get(id=id_signalement)
        statut= request.data.get("statut")
        id_admin_responsable = Administrateur.objects.get(id=id_admin_responsable)
        decision = request.data.get("decision")
        date_traitement = timezone.now()
        modified_by = id_admin_responsable
        type_signalement= signalement.type_signalement

        signalement.statut=statut
        signalement.id_admin_responsable=id_admin_responsable
        signalement.decision = decision
        signalement.date_traitement=date_traitement
        signalement.modified_by = modified_by

        action = {
            "approuvee": ["suspension"],
            "refusee": "reactivation"
        }

        with transaction.atomic():
            signalement.save()

            history_data = {
                'id_admin': id_admin_responsable,
                'id_utilisateur_cible': signalement.id_utilisateur_signale.id,
                'type_action': action[statut],
                'table_concernee': Signalement._meta.db_table,
                'id_enregistrement': signalement.id,
                'details': f"{action[statut]} de signalement pour {type_signalement}"
            }

            history = HistoriqueValidation()
            history.create_history_object(history_data)

        return Response({
            "success": True,
            "message": "",
            "data": Signalement(list, many=True).data
        }, status=status.HTTP_200_OK)

    except Administrateur.DoesNotExist:
        return Response({
            "success": False,
            "message": "Administrateur inexistant"
        }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def single_loc(request,signalement_id):
    try:
        code_admin = request.data.get('code_admin')
        admin_role = Administrateur.objects.get(code_admin=code_admin).niveau_autorisation

        if admin_role == "admin_validation":
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