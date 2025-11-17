// modules/offres/pages/MesOffres.jsx
import React, { useState, useEffect } from 'react';
import { getMesOffres, deleteOffre } from '../api/offres.api';
import { Briefcase, Plus, Eye, Edit, Trash2, Calendar, DollarSign, MapPin } from 'lucide-react';

export default function MesOffres() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // 📥 Charger les offres au montage
  useEffect(() => {
    fetchOffres();
  }, []);

  const fetchOffres = async () => {
    try {
      setLoading(true);
      const data = await getMesOffres();
      setOffres(data);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur chargement offres:', err);
      setError('Impossible de charger vos offres. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Supprimer une offre
  const handleDelete = async (id) => {
    try {
      await deleteOffre(id);
      setOffres(offres.filter(offre => offre.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Impossible de supprimer cette offre.');
    }
  };

  // 🎨 Badge de statut
  const StatutBadge = ({ statut }) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      closed: 'bg-red-100 text-red-800'
    };

    const labels = {
      active: 'Active',
      inactive: 'Inactive',
      closed: 'Fermée'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[statut] || styles.active}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  // 📅 Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // 💰 Format salaire
  const formatSalaire = (salaire) => {
    if (!salaire) return 'Non précisé';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(salaire);
  };

  // ⏳ État de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos offres...</p>
        </div>
      </div>
    );
  }

  // ❌ État d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
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
    <div className="min-h-screen bg-gray-50 p-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes offres d'emploi</h1>
              <p className="text-gray-600">
                {offres.length} offre{offres.length > 1 ? 's' : ''} publiée{offres.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/offres/publier'}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Nouvelle offre
            </button>
          </div>
        </div>

        {/* Liste des offres */}
        {offres.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucune offre publiée</h2>
            <p className="text-gray-600 mb-6">Commencez par créer votre première offre d'emploi</p>
            <button
              onClick={() => window.location.href = '/offres/publier'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Publier une offre
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {offres.map(offre => (
              <div key={offre.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Ligne 1: Titre et statut */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{offre.titre}</h3>
                      <p className="text-sm text-gray-500">
                        Publiée le {formatDate(offre.date_creation)} • Code: {offre.code_offre}
                      </p>
                    </div>
                    <StatutBadge statut={offre.statut} />
                  </div>

                  {/* Ligne 2: Informations clés */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{offre.type_contrat}</span>
                    </div>
                    {offre.salaire && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatSalaire(offre.salaire)}</span>
                      </div>
                    )}
                    {offre.date_limite && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Limite: {formatDate(offre.date_limite)}</span>
                      </div>
                    )}
                  </div>

                  {/* Ligne 3: Description (tronquée) */}
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {offre.description}
                  </p>

                  {/* Ligne 4: Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => window.location.href = `/offres/${offre.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Voir détails
                    </button>
                    <button
                      onClick={() => window.location.href = `/offres/${offre.id}/modifier`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(offre.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
                <p className="text-gray-600">
                  Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}