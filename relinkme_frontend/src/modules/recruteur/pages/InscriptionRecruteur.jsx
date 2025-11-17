// modules/recruteurs/pages/InscriptionRecruteur.jsx
import React, { useState } from 'react';
import { inscriptionRecruteur } from '../api/recruteur.api';
import { handleApiError, isValidEmail, isValidPassword, passwordsMatch } from '@/utils/validation';
import { Building2, Mail, Lock, Phone, MapPin, Globe, FileText, Briefcase } from 'lucide-react';

export default function InscriptionRecruteur() {
  const [formData, setFormData] = useState({
    nom_entreprise: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    adresse: '',
    site_web: '',
    secteur_activite: '',
    description: '',
    taille_entreprise: 'PME'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🔍 Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom_entreprise.trim()) {
      newErrors.nom_entreprise = 'Le nom de l\'entreprise est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!isValidPassword(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔄 Gestion des changements
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
      // Préparer les données (sans confirmPassword)
      const payload = {
        nom_entreprise: formData.nom_entreprise,
        email: formData.email,
        password: formData.password,
        telephone: formData.telephone,
        adresse: formData.adresse,
        site_web: formData.site_web,
        secteur_activite: formData.secteur_activite,
        description: formData.description,
        taille_entreprise: formData.taille_entreprise,
        type_recruteur: 'entreprise'  // Par défaut
      };

      console.log('🚀 Envoi des données:', payload);
      
      const response = await inscriptionRecruteur(payload);
      
      console.log('✅ Réponse reçue:', response);
      
      setSuccess(true);
      
      // Redirection après 2 secondes vers la page de connexion
      setTimeout(() => {
        window.location.href = '/connexion';
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur complète:', error);
      
      if (error.response?.data?.errors) {
        const formattedErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          const errorValue = error.response.data.errors[key];
          formattedErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        });
        setErrors(formattedErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.message) {
        setErrors({ general: `Erreur: ${error.message}` });
      } else {
        setErrors({ 
          general: 'Impossible de se connecter au serveur. Vérifiez que Django est démarré sur http://127.0.0.1:8000' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Écran de succès
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Inscription réussie !</h2>
          <p className="text-gray-600">Votre entreprise a été enregistrée avec succès.</p>
          <p className="text-gray-500 text-sm mt-2">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  // 📋 Formulaire d'inscription
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Inscription Recruteur</h1>
          <p className="text-gray-600">Créez un compte pour publier vos offres d'emploi</p>
        </div>

        <div className="space-y-6">
          {/* Erreur générale */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Section 1: Informations de l'entreprise */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              Informations de l'entreprise
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                name="nom_entreprise"
                value={formData.nom_entreprise}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.nom_entreprise ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="TechCorp SARL"
              />
              {errors.nom_entreprise && (
                <p className="text-red-500 text-sm mt-1">{errors.nom_entreprise}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secteur d'activité
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="secteur_activite"
                    value={formData.secteur_activite}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Technologie, Finance..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille de l'entreprise
                </label>
                <select
                  name="taille_entreprise"
                  value={formData.taille_entreprise}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="TPE">TPE (1-10 employés)</option>
                  <option value="PME">PME (11-250 employés)</option>
                  <option value="ETI">ETI (251-5000 employés)</option>
                  <option value="GE">Grande entreprise (5000+)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Coordonnées */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Coordonnées
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email professionnel *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="contact@entreprise.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.telephone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+261 20 00 000 00"
                  />
                </div>
                {errors.telephone && (
                  <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site web
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="site_web"
                    value={formData.site_web}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://www.entreprise.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Lot 123, Rue de l'Indépendance, Antananarivo"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Sécurité */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              Sécurité
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Description */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Présentation
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de l'entreprise
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Présentez votre entreprise, votre mission, vos valeurs..."
              />
            </div>
          </div>

          {/* Bouton de soumission */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Création en cours...
              </span>
            ) : (
              'Créer mon compte recruteur'
            )}
          </button>

          {/* Lien connexion */}
          <p className="text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <a href="/connexion" className="text-purple-600 hover:text-purple-700 font-semibold">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}