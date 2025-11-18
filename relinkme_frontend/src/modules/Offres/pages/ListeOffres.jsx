// modules/offres/pages/ListeOffres.jsx
// Page PUBLIQUE pour voir toutes les offres (candidats + recruteurs en lecture seule)
import React, { useState, useEffect } from 'react';
import { getOffresPubliques } from '../api/offres.api';
import { Briefcase, Search, MapPin, DollarSign, Calendar, Building2, Clock } from 'lucide-react';
import ChomeurLayout from '@/modules/chomeurs/layouts/ChomeurLayout';


export default function ListeOffres() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOffres, setFilteredOffres] = useState([]);

  // 📥 Charger les offres au montage
  useEffect(() => {
    fetchOffres();
  }, []);

  // 🔍 Filtrer les offres selon la recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOffres(offres);
    } else {
      const filtered = offres.filter(offre =>
        offre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.type_contrat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.recruteur_nom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOffres(filtered);
    }
  }, [searchTerm, offres]);

  const fetchOffres = async () => {
    try {
      setLoading(true);
      const data = await getOffresPubliques();
      setOffres(data);
      setFilteredOffres(data);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur chargement offres:', err);
      setError('Impossible de charger les offres. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // 📅 Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // 💰 Format salaire
  const formatSalaire = (salaire) => {
    if (!salaire) return 'Non précisé';
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(salaire);
  };

  // ⏰ Calculer depuis combien de temps l'offre est publiée
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  // ⏳ État de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement des offres...</p>
        </div>
      </div>
    );
  }

  // ❌ État d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOffres}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChomeurLayout>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* En-tête avec recherche */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Offres d'emploi disponibles
              </h1>
              <p className="text-gray-600 text-lg">
                {filteredOffres.length} offre{filteredOffres.length > 1 ? 's' : ''} active{filteredOffres.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Barre de recherche */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, entreprise, type de contrat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Liste des offres */}
          {filteredOffres.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Aucune offre trouvée</h2>
              <p className="text-gray-600">
                {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Aucune offre n\'est disponible pour le moment'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredOffres.map(offre => (
                <div
                  key={offre.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* Header avec badge temps */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {offre.titre}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">{offre.recruteur_nom || 'Entreprise'}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm">{offre.code_offre}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4" />
                        {getTimeAgo(offre.date_creation)}
                      </div>
                    </div>

                    {/* Informations clés en grille */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                        <Briefcase className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Type de contrat</p>
                          <p className="font-semibold text-gray-800">{offre.type_contrat}</p>
                        </div>
                      </div>

                      {offre.salaire && (
                        <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Salaire</p>
                            <p className="font-semibold text-gray-800">{formatSalaire(offre.salaire)}</p>
                          </div>
                        </div>
                      )}

                      {offre.date_limite && (
                        <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-lg">
                          <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Date limite</p>
                            <p className="font-semibold text-gray-800">{formatDate(offre.date_limite)}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description (tronquée) */}
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {offre.description}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={() => window.location.href = `/offres/${offre.id}`}
                        className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        Voir les détails
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => window.location.href = `/candidatures/${offre.id}`}
                        className="py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Postuler
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ChomeurLayout>
  );
}