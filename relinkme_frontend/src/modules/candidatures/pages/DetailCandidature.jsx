// modules/candidatures/pages/DetailCandidature.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Award,
  Calendar, Coins, FileText, ExternalLink, CheckCircle,
  Clock, XCircle, UserCheck, Building2, DollarSign
} from 'lucide-react';
import { getMaCandidatureDetail, getCandidatureRecueDetail, updateStatutCandidature } from '@/modules/candidatures/api/candidatures.api';

export default function DetailCandidature() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [candidature, setCandidature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(null); // 'chomeur' ou 'recruteur'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCandidature();
  }, [id]);

  const fetchCandidature = async () => {
    try {
      setLoading(true);
      
      // Essayer de charger en tant que chômeur
      try {
        const data = await getMaCandidatureDetail(id);
        setCandidature(data);
        setUserType('chomeur');
      } catch {
        // Si échec, essayer en tant que recruteur
        const data = await getCandidatureRecueDetail(id);
        setCandidature(data);
        setUserType('recruteur');
      }
      
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError('Impossible de charger cette candidature');
    } finally {
      setLoading(false);
    }
  };

  const handleChangerStatut = async (nouveauStatut) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir changer le statut en "${nouveauStatut}" ?`)) {
      return;
    }
    
    try {
      setActionLoading(true);
      await updateStatutCandidature(id, nouveauStatut);
      
      // Recharger la candidature
      await fetchCandidature();
      
    } catch (err) {
      console.error('❌ Erreur:', err);
      alert('Impossible de changer le statut');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatutInfo = (statut) => {
    const configs = {
      en_attente: {
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Clock,
        description: 'Votre candidature est en cours d\'examen'
      },
      vue: {
        label: 'Vue',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: CheckCircle,
        description: 'Le recruteur a consulté votre candidature'
      },
      acceptee: {
        label: 'Acceptée',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
        description: 'Félicitations ! Votre candidature a été acceptée'
      },
      refusee: {
        label: 'Refusée',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle,
        description: 'Votre candidature n\'a pas été retenue'
      },
      entretien: {
        label: 'Entretien',
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: UserCheck,
        description: 'Vous êtes convoqué à un entretien'
      }
    };
    return configs[statut] || configs.en_attente;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSalaire = (salaire) => {
    if (!salaire) return 'Non précisé';
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(salaire);
  };

  const getInitials = (nom) => {
    return nom
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !candidature) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const statutInfo = getStatutInfo(candidature.statut);
  const StatutIcon = statutInfo.icon;
  const profil = candidature.chomeur_profil;
  const offre = candidature.offre_details;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        {/* Statut de la candidature */}
        <div className={`rounded-xl border-2 p-6 mb-6 ${statutInfo.color}`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <StatutIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{statutInfo.label}</h2>
              <p className="opacity-90">{statutInfo.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche: Profil candidat */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {profil.photo_profil ? (
                    <img src={profil.photo_profil} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(profil.nom_complet)
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{profil.nom_complet}</h3>
                <p className="text-gray-600">{profil.profession || 'Profession non renseignée'}</p>
                {profil.niveau_expertise && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {profil.niveau_expertise}
                  </span>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{profil.email}</span>
                </div>
                {profil.telephone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{profil.telephone}</span>
                  </div>
                )}
                {profil.localisation && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{profil.localisation}</span>
                  </div>
                )}
              </div>

              {profil.description && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-gray-800 mb-2">À propos</h4>
                  <p className="text-sm text-gray-600">{profil.description}</p>
                </div>
              )}
            </div>

            {/* Compétences */}
            {profil.competences && profil.competences.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Compétences
                </h4>
                <div className="space-y-2">
                  {profil.competences.map(comp => (
                    <div key={comp.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{comp.libelle}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {comp.niveau_maitrise}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite: Détails candidature + Offre */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations candidature */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Détails de la candidature</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <div>
                    <p className="text-xs text-gray-500">Date de postulation</p>
                    <p className="font-medium text-gray-800">{formatDate(candidature.date_postulation)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-500">Jetons utilisés</p>
                    <p className="font-medium text-gray-800">{candidature.jetons_utilises}</p>
                  </div>
                </div>
              </div>

              {candidature.lettre_motivation && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Lettre de motivation
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">{candidature.lettre_motivation}</p>
                  </div>
                </div>
              )}

              {candidature.cv_fichier && (
                <div className="mt-4">
                  <a
                    href={candidature.cv_fichier}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir le CV
                  </a>
                </div>
              )}
            </div>

            {/* Informations offre */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">L'offre</h3>
              
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{offre.titre}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{offre.recruteur.nom_entreprise}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{offre.type_contrat}</span>
                </div>
                {offre.salaire && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">{formatSalaire(offre.salaire)}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm">{offre.description}</p>

              <button
                onClick={() => navigate(`/offres/${offre.id}`)}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Voir l'offre complète
              </button>
            </div>

            {/* Actions recruteur */}
            {userType === 'recruteur' && candidature.statut === 'en_attente' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleChangerStatut('entretien')}
                    disabled={actionLoading}
                    className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                  >
                    Convoquer entretien
                  </button>
                  <button
                    onClick={() => handleChangerStatut('acceptee')}
                    disabled={actionLoading}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => handleChangerStatut('refusee')}
                    disabled={actionLoading}
                    className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}