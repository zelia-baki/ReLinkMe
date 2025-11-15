// modules/offres/pages/PublierOffre.jsx
import React, { useState } from 'react';
import { publierOffre } from '../api/offres.api';
import { Briefcase, FileText, DollarSign, Calendar, Tag } from 'lucide-react';

export default function PublierOffre() {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_contrat: 'CDI',
    salaire: '',
    date_limite: '',
    statut: 'active'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 📋 Types de contrat disponibles
  const typesContrat = [
    { value: 'CDI', label: 'CDI - Contrat à Durée Indéterminée' },
    { value: 'CDD', label: 'CDD - Contrat à Durée Déterminée' },
    { value: 'Stage', label: 'Stage' },
    { value: 'Alternance', label: 'Alternance' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Temps partiel', label: 'Temps partiel' }
  ];

  // 🔍 Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre de l\'offre est requis';
    } else if (formData.titre.length < 5) {
      newErrors.titre = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 50) {
      newErrors.description = 'La description doit contenir au moins 50 caractères';
    }

    if (formData.salaire && isNaN(parseFloat(formData.salaire))) {
      newErrors.salaire = 'Le salaire doit être un nombre valide';
    }

    if (formData.date_limite) {
      const selectedDate = new Date(formData.date_limite);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date_limite = 'La date limite ne peut pas être dans le passé';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 📝 Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 🚀 Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Préparer les données
      const payload = {
        titre: formData.titre,
        description: formData.description,
        type_contrat: formData.type_contrat,
        salaire: formData.salaire ? parseFloat(formData.salaire) : null,
        date_limite: formData.date_limite || null,
        statut: 'active'
      };

      console.log('🚀 Envoi des données:', payload);
      
      const response = await publierOffre(payload);
      
      console.log('✅ Offre publiée:', response);
      
      setSuccess(true);
      
      // Redirection après 2 secondes vers la liste des offres
      setTimeout(() => {
        window.location.href = '/recruteur/mes-offres';
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur complète:', error);
      
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const formattedErrors = {};
        
        // Gérer les erreurs de validation Django
        Object.keys(apiErrors).forEach(key => {
          const errorValue = apiErrors[key];
          formattedErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        });
        
        setErrors(formattedErrors);
      } else if (error.response?.status === 401) {
        setErrors({ 
          general: 'Vous devez être connecté pour publier une offre. Veuillez vous connecter.' 
        });
      } else if (error.message) {
        setErrors({ general: `Erreur: ${error.message}` });
      } else {
        setErrors({ 
          general: 'Une erreur est survenue. Veuillez réessayer.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Écran de succès
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Offre publiée !</h2>
          <p className="text-gray-600">Votre offre d'emploi a été publiée avec succès.</p>
          <p className="text-gray-500 text-sm mt-2">Redirection vers vos offres...</p>
        </div>
      </div>
    );
  }

  // 📋 Formulaire de publication
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Publier une offre d'emploi</h1>
            <p className="text-gray-600">Créez une nouvelle offre pour attirer les meilleurs talents</p>
          </div>

          <div className="space-y-6">
            {/* Erreur générale */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Section 1: Informations principales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Informations de l'offre
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du poste *
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.titre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Développeur Full Stack"
                />
                {errors.titre && (
                  <p className="text-red-500 text-sm mt-1">{errors.titre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de contrat *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    name="type_contrat"
                    value={formData.type_contrat}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {typesContrat.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salaire (optionnel)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="salaire"
                      value={formData.salaire}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.salaire ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ex: 50000"
                      step="0.01"
                    />
                  </div>
                  {errors.salaire && (
                    <p className="text-red-500 text-sm mt-1">{errors.salaire}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Montant annuel en Ariary</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date limite de candidature
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="date_limite"
                      value={formData.date_limite}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.date_limite ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.date_limite && (
                    <p className="text-red-500 text-sm mt-1">{errors.date_limite}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Description */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Description du poste
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description détaillée *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="8"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Décrivez le poste, les missions, les compétences requises, les avantages..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length} caractères (minimum 50)
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => window.history.back()}
                className="flex-1 py-3 px-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publication en cours...
                  </span>
                ) : (
                  'Publier l\'offre'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}