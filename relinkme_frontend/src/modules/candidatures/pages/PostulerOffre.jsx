// modules/candidatures/pages/PostulerOffre.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send, Coins, FileText, ArrowLeft, CheckCircle,
  Briefcase, Building2, DollarSign, Calendar, AlertCircle
} from 'lucide-react';
import { getOffreById } from '@/modules/offres/api/offres.api';
import { postulerOffre } from '@/modules/candidatures/api/candidatures.api';
import { getMonProfil } from '@/modules/chomeurs/api/chomeur.api';
import ChomeurLayout from '@/modules/chomeurs/layouts/ChomeurLayout';

export default function PostulerOffre() {
  const { offreId } = useParams();
  const navigate = useNavigate();

  const [offre, setOffre] = useState(null);
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    lettre_motivation: '',
    cv_fichier: '',
    jetons_utilises: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, [offreId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [offreData, profilData] = await Promise.all([
        getOffreById(offreId),
        getMonProfil()
      ]);

      setOffre(offreData);
      setProfil(profilData.profil);

      // Pré-remplir les jetons si l'offre en demande
      if (offreData.jetons_requis) {
        setFormData(prev => ({ ...prev, jetons_utilises: offreData.jetons_requis }));
      }

    } catch (err) {
      console.error('❌ Erreur:', err);
      setError('Impossible de charger les informations nécessaires');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.lettre_motivation.trim()) {
      newErrors.lettre_motivation = 'La lettre de motivation est requise';
    } else if (formData.lettre_motivation.length < 100) {
      newErrors.lettre_motivation = 'La lettre doit contenir au moins 100 caractères';
    }

    const jetons = parseInt(formData.jetons_utilises) || 0;
    if (jetons < 0) {
      newErrors.jetons_utilises = 'Le nombre de jetons ne peut pas être négatif';
    }

    if (profil && jetons > profil.solde_jetons) {
      newErrors.jetons_utilises = `Jetons insuffisants. Solde: ${profil.solde_jetons}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        offre: parseInt(offreId),
        lettre_motivation: formData.lettre_motivation,
        cv_fichier: formData.cv_fichier || null,
        jetons_utilises: parseInt(formData.jetons_utilises) || 0,
      };

      await postulerOffre(payload);
      setSuccess(true);

      setTimeout(() => {
        navigate('/chomeur/candidatures');
      }, 2000);

    } catch (err) {
      console.error('❌ Erreur postulation:', err);

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Erreur lors de la postulation');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatSalaire = (salaire) => {
    if (!salaire) return 'Non précisé';
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(salaire);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
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

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Candidature envoyée !</h2>
          <p className="text-gray-600">Votre candidature a été transmise au recruteur.</p>
          <p className="text-gray-500 text-sm mt-2">Redirection...</p>
        </div>
      </div>
    );
  }

  if (error && !offre) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
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

  return (
    <ChomeurLayout>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          {/* Carte de l'offre */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{offre?.titre}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span>{offre?.recruteur_nom || 'Entreprise'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{offre?.type_contrat}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>{formatSalaire(offre?.salaire)}</span>
              </div>
              {offre?.date_limite && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Limite: {formatDate(offre?.date_limite)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Solde jetons */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Coins className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-gray-800">Votre solde de jetons</p>
                <p className="text-sm text-gray-600">
                  {profil?.solde_jetons || 0} jetons disponibles
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire de candidature */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Send className="w-6 h-6 text-blue-600" />
              Postuler à cette offre
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lettre de motivation *
                </label>
                <textarea
                  name="lettre_motivation"
                  value={formData.lettre_motivation}
                  onChange={handleChange}
                  rows="10"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none ${errors.lettre_motivation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                />
                {errors.lettre_motivation && (
                  <p className="text-red-500 text-sm mt-1">{errors.lettre_motivation}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.lettre_motivation.length} / 100 caractères minimum
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lien vers votre CV (optionnel)
                </label>
                <input
                  type="url"
                  name="cv_fichier"
                  value={formData.cv_fichier}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://mon-cv.pdf"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lien vers votre CV en ligne (Google Drive, Dropbox, etc.)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jetons à utiliser
                </label>
                <input
                  type="number"
                  name="jetons_utilises"
                  value={formData.jetons_utilises}
                  onChange={handleChange}
                  min="0"
                  max={profil?.solde_jetons || 0}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.jetons_utilises ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.jetons_utilises && (
                  <p className="text-red-500 text-sm mt-1">{errors.jetons_utilises}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Certaines offres peuvent nécessiter des jetons pour postuler
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer ma candidature
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ChomeurLayout>
  );
}