// modules/offres/pages/MesOffres.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMesOffres, deleteOffre } from '../api/offres.api';
import { Briefcase, Plus, Eye, Edit, Trash2, Calendar, DollarSign, MapPin, Loader2, AlertCircle } from 'lucide-react';
import RecruteurLayout from '@/modules/recruteur/layouts/RecruteurLayout';
import { STATUT_OFFRE_CONFIG } from '@/modules/recruteur/utils/constants';
import { formatDate } from '@/modules/recruteur/utils/helpers';

export default function MesOffres() {
  const navigate = useNavigate();
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

  // 🎨 Badge de statut avec configuration centralisée
  const StatutBadge = ({ statut }) => {
    const config = STATUT_OFFRE_CONFIG[statut] || STATUT_OFFRE_CONFIG.active;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.icon} {config.label}
      </span>
    );
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
      <RecruteurLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement de vos offres...</p>
            </div>
          </div>
        </div>
      </RecruteurLayout>
    );
  }

  // ❌ État d'erreur
  if (error) {
    return (
      <RecruteurLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchOffres}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Réessayer
            </button>
          </div>
        </div>
      </RecruteurLayout>
    );
  }

  return (
    <RecruteurLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes offres d'emploi</h1>
              <p className="text-gray-600">
                {offres.length} offre{offres.length > 1 ? 's' : ''} publiée{offres.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => navigate('/recruteur/offres/nouvelle')}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Nouvelle offre
            </button>
          </div>
        </div>

        {/* Liste des offres */}
        {offres.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucune offre publiée</h2>
            <p className="text-gray-600 mb-6">Commencez par créer votre première offre d'emploi</p>
            <button
              onClick={() => navigate('/recruteur/offres/nouvelle')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Publier une offre
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {offres.map(offre => (
              <div key={offre.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/recruteur/offres/${offre.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Voir détails
                    </button>
                    <button
                      onClick={() => navigate(`/recruteur/offres/modifier/${offre.id}`)}
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
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
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
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RecruteurLayout>
  );
}