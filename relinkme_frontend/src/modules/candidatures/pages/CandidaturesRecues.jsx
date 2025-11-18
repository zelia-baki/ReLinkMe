// modules/candidatures/pages/CandidaturesRecues.jsx (RECRUTEUR)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Eye, Calendar, Mail, Phone, Briefcase, Award,
  CheckCircle, Clock, XCircle, Filter, Search, UserCheck
} from 'lucide-react';
import { getCandidaturesRecues, getCandidatureStats, updateStatutCandidature } from '@/modules/candidatures/api/candidatures.api';
import { getMesOffres } from '@/modules/offres/api/offres.api';
import RecruteurLayout from '@/modules/recruteur/layouts/RecruteurLayout';


export default function CandidaturesRecues() {
  const navigate = useNavigate();

  const [candidatures, setCandidatures] = useState([]);
  const [offres, setOffres] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtreOffre, setFiltreOffre] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');

  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filtreOffre, filtreStatut]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const filters = {};
      if (filtreOffre) filters.offre = filtreOffre;
      if (filtreStatut !== 'tous') filters.statut = filtreStatut;

      const [candidaturesData, offresData, statsData] = await Promise.all([
        getCandidaturesRecues(filters),
        getMesOffres(),
        getCandidatureStats()
      ]);

      setCandidatures(candidaturesData);
      setOffres(offresData);
      setStats(statsData);

    } catch (err) {
      console.error('❌ Erreur:', err);
      setError('Impossible de charger les candidatures');
    } finally {
      setLoading(false);
    }
  };

  const handleChangerStatut = async (candidatureId, nouveauStatut) => {
    try {
      setActionLoading(candidatureId);

      await updateStatutCandidature(candidatureId, nouveauStatut);

      // Mettre à jour l'affichage
      setCandidatures(prev =>
        prev.map(cand =>
          cand.id === candidatureId ? { ...cand, statut: nouveauStatut } : cand
        )
      );

      // Rafraîchir les stats
      const statsData = await getCandidatureStats();
      setStats(statsData);

    } catch (err) {
      console.error('❌ Erreur changement statut:', err);
      alert('Impossible de changer le statut');
    } finally {
      setActionLoading(null);
    }
  };

  // Filtrer par recherche
  const candidaturesFiltrees = candidatures.filter(cand => {
    if (!searchTerm) return true;

    const search = searchTerm.toLowerCase();
    return (
      cand.chomeur_nom.toLowerCase().includes(search) ||
      cand.chomeur_email.toLowerCase().includes(search) ||
      cand.chomeur_profession?.toLowerCase().includes(search)
    );
  });

  const getStatutInfo = (statut) => {
    const configs = {
      en_attente: {
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Clock
      },
      vue: {
        label: 'Vue',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Eye
      },
      acceptee: {
        label: 'Acceptée',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle
      },
      refusee: {
        label: 'Refusée',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle
      },
      entretien: {
        label: 'Entretien',
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: UserCheck
      }
    };
    return configs[statut] || configs.en_attente;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
          <p className="text-gray-600">Chargement des candidatures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <RecruteurLayout>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header avec statistiques */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Candidatures reçues</h1>

            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-800">{stats.en_attente}</p>
                  <p className="text-sm text-yellow-700">En attente</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-800">{stats.vue}</p>
                  <p className="text-sm text-blue-700">Vues</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-800">{stats.acceptee}</p>
                  <p className="text-sm text-green-700">Acceptées</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-800">{stats.entretien}</p>
                  <p className="text-sm text-purple-700">Entretiens</p>
                </div>
              </div>
            )}
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un candidat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filtre par offre */}
              <select
                value={filtreOffre}
                onChange={(e) => setFiltreOffre(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les offres</option>
                {offres.map(offre => (
                  <option key={offre.id} value={offre.id}>
                    {offre.titre}
                  </option>
                ))}
              </select>

              {/* Filtre par statut */}
              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="tous">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="vue">Vue</option>
                <option value="acceptee">Acceptée</option>
                <option value="refusee">Refusée</option>
                <option value="entretien">Entretien</option>
              </select>
            </div>
          </div>

          {/* Liste des candidatures */}
          {candidaturesFiltrees.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Aucune candidature
              </h2>
              <p className="text-gray-600">
                {searchTerm || filtreOffre || filtreStatut !== 'tous'
                  ? 'Aucune candidature ne correspond à vos critères'
                  : 'Vous n\'avez pas encore reçu de candidatures'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidaturesFiltrees.map(cand => {
                const statutInfo = getStatutInfo(cand.statut);
                const StatutIcon = statutInfo.icon;

                return (
                  <div
                    key={cand.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {cand.chomeur_photo ? (
                          <img src={cand.chomeur_photo} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          getInitials(cand.chomeur_nom)
                        )}
                      </div>

                      <div className="flex-1">
                        {/* Nom et statut */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {cand.chomeur_nom}
                            </h3>
                            <p className="text-gray-600">{cand.chomeur_profession || 'Profession non renseignée'}</p>
                          </div>

                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statutInfo.color}`}>
                            <StatutIcon className="w-4 h-4" />
                            <span className="font-semibold text-sm">{statutInfo.label}</span>
                          </div>
                        </div>

                        {/* Infos de contact */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{cand.chomeur_email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{cand.offre_titre}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Postulé le {formatDate(cand.date_postulation)}</span>
                          </div>
                        </div>

                        {/* Actions rapides */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => navigate(`/recruteur/candidatures/${cand.id}`)}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            Voir détails
                          </button>

                          {cand.statut === 'en_attente' && (
                            <>
                              <button
                                onClick={() => handleChangerStatut(cand.id, 'entretien')}
                                disabled={actionLoading === cand.id}
                                className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium disabled:opacity-50"
                              >
                                Convoquer entretien
                              </button>
                              <button
                                onClick={() => handleChangerStatut(cand.id, 'acceptee')}
                                disabled={actionLoading === cand.id}
                                className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium disabled:opacity-50"
                              >
                                Accepter
                              </button>
                              <button
                                onClick={() => handleChangerStatut(cand.id, 'refusee')}
                                disabled={actionLoading === cand.id}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50"
                              >
                                Refuser
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </RecruteurLayout>
  );
}