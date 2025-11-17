import React, { useState, useEffect } from 'react';
import { inscriptionChomeur } from '@/modules/chomeurs/api/chomeur.api';
import { getAllCompetences } from '@/modules/core/api/competence.api';
import { User, Mail, Lock, Phone, MapPin, Briefcase, FileText, Award, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

const MAX_COMPETENCES = 20;

export default function InscriptionChomeur() {
  const [currentStep, setCurrentStep] = useState(1);
  const [competencesList, setCompetencesList] = useState([]);
  
  const [formData, setFormData] = useState({
    nom_complet: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    localisation: '',
    profession: '',
    description: '',
    niveau_expertise: 'débutant'
  });

  const [selectedCompetences, setSelectedCompetences] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Charger les compétences disponibles
  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const data = await getAllCompetences();
        setCompetencesList(data);
      } catch (error) {
        console.error('Erreur chargement compétences:', error);
      }
    };
    fetchCompetences();
  }, []);

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.nom_complet.trim()) {
      newErrors.nom_complet = 'Le nom complet est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const toggleCompetence = (compId) => {
    setSelectedCompetences(prev => {
      if (prev.includes(compId)) {
        return prev.filter(id => id !== compId);
      } else {
        if (prev.length >= MAX_COMPETENCES) {
          setErrors({ general: `Maximum ${MAX_COMPETENCES} compétences` });
          return prev;
        }
        return [...prev, compId];
      }
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        nom_complet: formData.nom_complet,
        email: formData.email,
        password: formData.password,
        telephone: formData.telephone,
        localisation: formData.localisation,
        profession: formData.profession,
        description: formData.description,
        niveau_expertise: formData.niveau_expertise,
        competences: selectedCompetences // ✅ Envoi des compétences
      };

      console.log('🚀 Envoi des données:', payload);
      
      const response = await inscriptionChomeur(payload);
      
      console.log('✅ Réponse reçue:', response);
      setSuccess(true);
      
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
          general: 'Impossible de se connecter au serveur. Vérifiez que Django est démarré' 
        });
      }
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Filtres pour les compétences
  const categories = ['all', ...new Set(competencesList.map(c => c.categorie).filter(Boolean))];
  const filteredCompetences = competencesList.filter(comp => {
    const matchSearch = comp.libelle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || comp.categorie === selectedCategory;
    return matchSearch && matchCategory;
  });

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Inscription réussie !</h2>
          <p className="text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte Chômeur</h1>
          <p className="text-gray-600">Rejoignez notre plateforme et trouvez votre prochain emploi</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Informations</span>
            <span>Compétences</span>
            <span>Confirmation</span>
          </div>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {errors.general}
          </div>
        )}

        {/* STEP 1: Informations personnelles */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations personnelles
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="nom_complet"
                  value={formData.nom_complet}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nom_complet ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Jean Dupont"
                />
                {errors.nom_complet && (
                  <p className="text-red-500 text-sm mt-1">{errors.nom_complet}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="jean.dupont@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

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
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                    Confirmer *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.telephone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+261 34 00 000 00"
                    />
                  </div>
                  {errors.telephone && (
                    <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="localisation"
                      value={formData.localisation}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Antananarivo"
                    />
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 pt-4 border-t">
                <Briefcase className="w-5 h-5" />
                Informations professionnelles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profession
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Développeur Web"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau d'expertise
                  </label>
                  <select
                    name="niveau_expertise"
                    value={formData.niveau_expertise}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="débutant">Débutant</option>
                    <option value="intermédiaire">Intermédiaire</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Parlez de votre parcours..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Compétences (optionnel) */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">
                Sélectionnez vos compétences (optionnel)
              </h3>
              <p className="text-sm text-gray-600">
                {selectedCompetences.length}/{MAX_COMPETENCES} sélectionnées
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <div className="flex gap-2 flex-wrap">
                {categories.slice(0, 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {cat === 'all' ? 'Toutes' : cat}
                  </button>
                ))}
              </div>

              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {filteredCompetences.slice(0, 50).map(comp => (
                    <button
                      key={comp.id}
                      onClick={() => toggleCompetence(comp.id)}
                      className={`p-3 rounded-lg text-sm text-left transition-all ${
                        selectedCompetences.includes(comp.id)
                          ? 'bg-blue-100 border-2 border-blue-600 font-medium'
                          : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {comp.libelle}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">
                Vérifiez vos informations
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-semibold">{formData.nom_complet}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-semibold">{formData.telephone}</p>
              </div>
              {formData.profession && (
                <div>
                  <p className="text-sm text-gray-600">Profession</p>
                  <p className="font-semibold">{formData.profession}</p>
                </div>
              )}
              {selectedCompetences.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Compétences ({selectedCompetences.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompetences.slice(0, 10).map(id => {
                      const comp = competencesList.find(c => c.id === id);
                      return comp ? (
                        <span key={id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {comp.libelle}
                        </span>
                      ) : null;
                    })}
                    {selectedCompetences.length > 10 && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        +{selectedCompetences.length - 10} autres
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Précédent
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold"
            >
              Suivant
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Vous avez déjà un compte ?{' '}
          <a href="/connexion" className="text-blue-600 hover:text-blue-700 font-semibold">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}