// modules/candidatures/pages/MesCandidatures.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send, Eye, Calendar, Coins, Briefcase, Building2,
  CheckCircle, Clock, XCircle, Users, Search, Filter
} from 'lucide-react';
import { getMesCandidatures, getCandidatureStats } from '@/modules/candidatures/api/candidatures.api';

export default function MesCandidatures() {
  const navigate = useNavigate();
  
  const [candidatures, setCandidatures] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidaturesData, statsData] = await Promise.all([
        getMesCandidatures(),
        getCandidatureStats()
      ]);
      
      setCandidatures(candidaturesData);
      setStats(statsData);
      
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError('Impossible de charger vos candidatures');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les candidatures
  const candidaturesFiltrees = candidatures.filter(cand => {
    const matchStatut = filtreStatut === 'tous' || cand.statut === filtreStatut;
    const matchSearch = searchTerm === '' || 
      cand.offre_titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.recruteur_nom?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchStatut && matchSearch;
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
        icon: Users
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos candidatures...</p>
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec statistiques */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Mes candidatures</h1>
          
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

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre ou entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Filtre statut */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
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
        </div>

        {/* Liste des candidatures */}
        {candidaturesFiltrees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm || filtreStatut !== 'tous' 
                ? 'Aucune candidature trouvée' 
                : 'Aucune candidature'}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || filtreStatut !== 'tous'
                ? 'Essayez avec d\'autres filtres'
                : 'Commencez par postuler à des offres d\'emploi'}
            </p>
            {!searchTerm && filtreStatut === 'tous' && (
              <button
                onClick={() => navigate('/offres')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Voir les offres
              </button>
            )}
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
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {cand.offre_titre}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">{cand.recruteur_nom || 'Entreprise'}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm">{cand.offre_code}</span>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statutInfo.color}`}>
                      <StatutIcon className="w-4 h-4" />
                      <span className="font-semibold text-sm">{statutInfo.label}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{cand.offre_type_contrat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Postulé le {formatDate(cand.date_postulation)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span>{cand.jetons_utilises} jetons utilisés</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/chomeur/candidatures/${cand.id}`)}
                    className="w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Voir les détails
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}