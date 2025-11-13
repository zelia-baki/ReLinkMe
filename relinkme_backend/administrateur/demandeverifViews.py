from datetime import datetime

from core.models import Utilisateur
from .models import DemandeVerification, Administrateur
from .serializers import DemandeVerificationSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def create_demande_verif(request,id_utilisateur):
    try:
        utilisateur = Utilisateur.objects.get(id=id_utilisateur)
        type_verification = request.data.get('type_verification')
        statut = request.data.get('status')
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
            "demande" : DemandeVerificationSerializer(demande).data
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
        utilisateur_responsable = Utilisateur.objects.get(id=id_admin_responsable)
        demande_traiter = DemandeVerification.objects.get(id=id_demande_traiter)

        statut = request.data.get('statut')
        motif_refus = request.data.get('motif_refus')
        modified_by = utilisateur_responsable

        demande_traiter.id_admin_responsable = utilisateur_responsable
        demande_traiter.statut = statut
        demande_traiter.motif_refus = motif_refus
        demande_traiter.modified_by = modified_by

        if demande_traiter.date_traitement is None:
            date_traitement = datetime.now()
            demande_traiter.date_traitement = date_traitement

        demande_traiter.save()

        return Response({
            "success": True,
            "message": "Demande envoyé avec succès",
            "demande": DemandeVerificationSerializer(demande_traiter).data
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
        admin_role = Administrateur.objects.get(code=code_admin).niveau_autorisation

        if admin_role == "admin_moderation":
            return Response({
                "success": False,
                "message": "Cet utilisateur n'est pas autorisé à consulter",
                "demande": []
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
            "demande": DemandeVerificationSerializer(list_demande,many=True).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e),
            "error": e.__class__.__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



