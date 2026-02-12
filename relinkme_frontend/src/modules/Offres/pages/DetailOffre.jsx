// modules/offres/pages/DetailOffre.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOffreById, deleteOffre } from '../api/offres.api';
import { getRecruteurProfile } from '@/modules/recruteur/api/recruteur.api';
import {
  Briefcase, Building2, Calendar, DollarSign,
  Edit, Trash2, ArrowLeft, CheckCircle, Send
} from 'lucide-react';
import ChomeurLayout from '@/modules/chomeurs/layouts/ChomeurLayout';

export default function DetailOffre() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isRecruteur, setIsRecruteur] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchOffre();
    checkOwnership();
  }, [id]);

  const fetchOffre = async () => {
    try {
      setLoading(true);
      const data = await getOffreById(id);
      setOffre(data);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur chargement offre:', err);
      setError('Impossible de charger cette offre.');
    } finally {
      setLoading(false);
    }
  };

  const checkOwnership = async () => {
    try {
      const recruteurData = await getRecruteurProfile();
      setIsRecruteur(true);
      const offreData = await getOffreById(id);
      setIsOwner(offreData.recruteur === recruteurData.id);
    } catch {
      setIsRecruteur(false);
      setIsOwner(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOffre(id);
      navigate('/recruteur/offres');
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Impossible de supprimer cette offre.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const formatSalaire = (salaire) => {
    if (!salaire) return 'À négocier';
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency', currency: 'MGA', minimumFractionDigits: 0
    }).format(salaire);
  };

  if (loading) {
    return (
      <ChomeurLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Chargement de l'offre...</p>
          </div>
        </div>
      </ChomeurLayout>
    );
  }

  if (error || !offre) {
    return (
      <ChomeurLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Offre introuvable</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retour
            </button>
          </div>
        </div>
      </ChomeurLayout>
    );
  }

  return (
    <ChomeurLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4">

          {/* Bouton retour */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour</span>
          </button>

          {/* Carte principale */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{offre.titre}</h1>
                  <div className="flex items-center gap-3 text-blue-100">
                    <Building2 className="w-5 h-5" />
                    <span className="text-lg font-medium">{offre.recruteur_nom || 'Entreprise'}</span>
                  </div>
                </div>
                {isOwner && (
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Votre offre</span>
                  </div>
                )}
              </div>
              <p className="text-blue-100 text-sm">
                Code: {offre.code_offre} • Publiée le {formatDate(offre.date_creation)}
              </p>
            </div>

            {/* Informations clés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Type de contrat</p>
                  <p className="font-semibold text-gray-800 text-lg">{offre.type_contrat}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Salaire</p>
                  <p className="font-semibold text-gray-800 text-lg">{formatSalaire(offre.salaire)}</p>
                </div>
              </div>

              {offre.date_limite && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date limite</p>
                    <p className="font-semibold text-gray-800 text-lg">{formatDate(offre.date_limite)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description du poste</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {offre.description}
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 bg-gray-50 border-t">
              {isOwner ? (
                // Propriétaire de l'offre
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(`/recruteur/offres/modifier/${offre.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Edit className="w-5 h-5" />
                    Modifier l'offre
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center justify-center gap-2 py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    <Trash2 className="w-5 h-5" />
                    Supprimer
                  </button>
                </div>
              ) : isRecruteur ? (
                // Autre recruteur
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-blue-800">
                    📋 Vous consultez une offre publiée par un autre recruteur
                  </p>
                </div>
              ) : (
                // Chômeur → ✅ Bonne URL : /offres/:id/postuler
                <button
                  onClick={() => navigate(`/offres/${offre.id}/postuler`)}
                  className="w-full py-4 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Postuler à cette offre
                </button>
              )}
            </div>
          </div>

          {/* Modal suppression */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
                  <p className="text-gray-600">
                    Êtes-vous sûr de vouloir supprimer l'offre <strong>"{offre.titre}"</strong> ?
                    Cette action est irréversible.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ChomeurLayout>
  );
}