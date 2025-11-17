// modules/Offres/pages/PublierOffre.jsx
import React, { useState, useEffect } from 'react';
import { publierOffre, ajouterCompetences, ajouterTests } from '../api/offres.api';
import { getAllCompetences } from '@/modules/competences/api/competences.api';
import { Briefcase, FileText, DollarSign, Calendar, Tag, Brain, CheckCircle, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

export default function PublierOffre() {
  // États pour les 3 étapes
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [offreCreee, setOffreCreee] = useState(null);
  
  // Étape 1 : Informations de base
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_contrat: 'CDI',
    salaire: '',
    date_limite: '',
    statut: 'active'
  });

  // Étape 2 : Compétences
  const [competencesDisponibles, setCompetencesDisponibles] = useState([]);
  const [competencesSelectionnees, setCompetencesSelectionnees] = useState([]);
  const [loadingCompetences, setLoadingCompetences] = useState(false);
  const [errorCompetences, setErrorCompetences] = useState(null);

  // Étape 3 : Tests (optionnel)
  const [tests, setTests] = useState({});

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Charger les compétences au montage du composant
  useEffect(() => {
    console.log('🔄 Composant monté, chargement des compétences...');
    chargerCompetences();
  }, []);

  const chargerCompetences = async () => {
    setLoadingCompetences(true);
    setErrorCompetences(null);
    try {
      console.log('📡 Appel API getAllCompetences...');
      const data = await getAllCompetences();
      console.log('✅ Compétences reçues:', data);
      console.log('📊 Nombre de compétences:', data?.length);
      
      setCompetencesDisponibles(data || []);
      
      if (!data || data.length === 0) {
        setErrorCompetences('Aucune compétence disponible dans la base de données');
      }
    } catch (error) {
      console.error('❌ Erreur complète:', error);
      console.error('❌ Error response:', error.response);
      setErrorCompetences(`Erreur: ${error.message || 'Impossible de charger les compétences'}`);
    } finally {
      setLoadingCompetences(false);
    }
  };

  const typesContrat = [
    { value: 'CDI', label: 'CDI - Contrat à Durée Indéterminée' },
    { value: 'CDD', label: 'CDD - Contrat à Durée Déterminée' },
    { value: 'Stage', label: 'Stage' },
    { value: 'Alternance', label: 'Alternance' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Temps partiel', label: 'Temps partiel' }
  ];

  const niveauxCompetence = [
    { value: 'débutant', label: 'Débutant' },
    { value: 'intermédiaire', label: 'Intermédiaire' },
    { value: 'expert', label: 'Expert' }
  ];

  // ========================================
  // ÉTAPE 1 : INFORMATIONS DE BASE
  // ========================================

  const validateEtape1 = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEtape1Submit = async () => {
    if (!validateEtape1()) return;

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        titre: formData.titre,
        description: formData.description,
        type_contrat: formData.type_contrat,
        salaire: formData.salaire ? parseFloat(formData.salaire) : null,
        date_limite: formData.date_limite || null,
        statut: 'active'
      };

      console.log('🚀 Création de l\'offre:', payload);
      const response = await publierOffre(payload);
      console.log('✅ Offre créée:', response);
      
      setOffreCreee(response);
      setEtapeActuelle(2);

    } catch (error) {
      console.error('❌ Erreur:', error);
      
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const formattedErrors = {};
        
        Object.keys(apiErrors).forEach(key => {
          const errorValue = apiErrors[key];
          formattedErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        });
        
        setErrors(formattedErrors);
      } else if (error.response?.status === 401) {
        setErrors({ 
          general: 'Vous devez être connecté pour publier une offre.' 
        });
      } else {
        setErrors({ 
          general: 'Une erreur est survenue. Veuillez réessayer.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // ÉTAPE 2 : COMPÉTENCES
  // ========================================

  const toggleCompetence = (competence) => {
    console.log('🔄 Toggle compétence:', competence.libelle);
    
    const existe = competencesSelectionnees.find(c => c.competence_id === competence.id);
    
    if (existe) {
      console.log('➖ Retrait de la compétence');
      setCompetencesSelectionnees(prev => 
        prev.filter(c => c.competence_id !== competence.id)
      );
    } else {
      console.log('➕ Ajout de la compétence');
      setCompetencesSelectionnees(prev => [
        ...prev,
        {
          competence_id: competence.id,
          competence_nom: competence.libelle,
          niveau_requis: 'intermédiaire'
        }
      ]);
    }
  };

  const changerNiveauCompetence = (competenceId, niveau) => {
    console.log('🔄 Changement niveau:', competenceId, niveau);
    setCompetencesSelectionnees(prev =>
      prev.map(c => 
        c.competence_id === competenceId 
          ? { ...c, niveau_requis: niveau }
          : c
      )
    );
  };

  const handleEtape2Submit = async () => {
    if (competencesSelectionnees.length === 0) {
      setErrors({ general: 'Sélectionnez au moins une compétence' });
      return;
    }

    setLoading(true);
    try {
      const payload = competencesSelectionnees.map(c => ({
        offre: offreCreee.id,
        competence: c.competence_id,
        niveau_requis: c.niveau_requis
      }));

      console.log('🚀 Ajout des compétences:', payload);
      await ajouterCompetences(payload);
      console.log('✅ Compétences ajoutées');
      
      setEtapeActuelle(3);

    } catch (error) {
      console.error('❌ Erreur ajout compétences:', error);
      setErrors({ 
        general: 'Erreur lors de l\'ajout des compétences' 
      });
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // ÉTAPE 3 : TESTS (OPTIONNEL)
  // ========================================

  const ajouterTest = (competenceId) => {
    setTests(prev => ({
      ...prev,
      [competenceId]: [
        ...(prev[competenceId] || []),
        { question: '', reponse_correcte: '', score: 10 }
      ]
    }));
  };

  const modifierTest = (competenceId, index, field, value) => {
    setTests(prev => ({
      ...prev,
      [competenceId]: prev[competenceId].map((test, i) =>
        i === index ? { ...test, [field]: value } : test
      )
    }));
  };

  const supprimerTest = (competenceId, index) => {
    setTests(prev => ({
      ...prev,
      [competenceId]: prev[competenceId].filter((_, i) => i !== index)
    }));
  };

  const handleEtape3Submit = async () => {
    setLoading(true);
    try {
      const testsArray = [];
      
      Object.keys(tests).forEach(competenceId => {
        tests[competenceId].forEach(test => {
          if (test.question.trim() && test.reponse_correcte.trim()) {
            testsArray.push({
              offre: offreCreee.id,
              competence: parseInt(competenceId),
              question: test.question,
              reponse_correcte: test.reponse_correcte,
              score: test.score
            });
          }
        });
      });

      if (testsArray.length > 0) {
        console.log('🚀 Ajout des tests:', testsArray);
        await ajouterTests(testsArray);
        console.log('✅ Tests ajoutés');
      }

      setSuccess(true);
      
      setTimeout(() => {
        window.location.href = '/recruteur/profil';
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur ajout tests:', error);
      setErrors({ 
        general: 'Erreur lors de l\'ajout des tests' 
      });
    } finally {
      setLoading(false);
    }
  };

  const passerEtape3 = () => {
    setSuccess(true);
    setTimeout(() => {
      window.location.href = '/recruteur/profil';
    }, 2000);
  };

  // ========================================
  // RENDU
  // ========================================

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Offre publiée !</h2>
          <p className="text-gray-600">Votre offre complète a été publiée avec succès.</p>
          <p className="text-gray-500 text-sm mt-2">Redirection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* En-tête avec étapes */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Publier une offre d'emploi</h1>
            
            {/* Indicateur d'étapes */}
            <div className="flex items-center justify-center gap-4 mt-6">
              {[1, 2, 3].map(etape => (
                <div key={etape} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    etapeActuelle === etape 
                      ? 'bg-blue-600 text-white' 
                      : etapeActuelle > etape
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {etapeActuelle > etape ? <CheckCircle className="w-5 h-5" /> : etape}
                  </div>
                  {etape < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      etapeActuelle > etape ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-4 mt-3 text-sm">
              <span className={etapeActuelle >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
                Informations
              </span>
              <span className={etapeActuelle >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
                Compétences
              </span>
              <span className={etapeActuelle >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
                Tests
              </span>
            </div>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          {/* ÉTAPE 1 : Informations de base */}
          {etapeActuelle === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Informations de l'offre
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre du poste *</label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.titre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Développeur Full Stack"
                />
                {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de contrat *</label>
                <select
                  name="type_contrat"
                  value={formData.type_contrat}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {typesContrat.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salaire (Ar)</label>
                  <input
                    type="number"
                    name="salaire"
                    value={formData.salaire}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 1500000"
                  />
                  {errors.salaire && <p className="text-red-500 text-sm mt-1">{errors.salaire}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date limite</label>
                  <input
                    type="date"
                    name="date_limite"
                    value={formData.date_limite}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.date_limite && <p className="text-red-500 text-sm mt-1">{errors.date_limite}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="8"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Décrivez le poste, les responsabilités, les qualifications requises..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                <p className="text-xs text-gray-500 mt-1">{formData.description.length} caractères (minimum 50)</p>
              </div>

              <button
                onClick={handleEtape1Submit}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                {loading ? 'Création...' : 'Continuer'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ÉTAPE 2 : Compétences */}
          {etapeActuelle === 2 && offreCreee && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-semibold">✅ Offre créée : {offreCreee.titre}</p>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Compétences requises
              </h3>

              <p className="text-gray-600 text-sm">
                Sélectionnez les compétences nécessaires pour ce poste et définissez le niveau requis.
              </p>

              {/* Affichage du nombre de compétences sélectionnées */}
              {competencesSelectionnees.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm font-semibold">
                    ✓ {competencesSelectionnees.length} compétence{competencesSelectionnees.length > 1 ? 's' : ''} sélectionnée{competencesSelectionnees.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {/* État de chargement */}
              {loadingCompetences && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des compétences...</p>
                </div>
              )}

              {/* Erreur de chargement */}
              {errorCompetences && !loadingCompetences && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-semibold mb-2">Impossible de charger les compétences</p>
                      <p className="text-red-700 text-sm mb-3">{errorCompetences}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={chargerCompetences}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                  >
                    🔄 Réessayer
                  </button>
                  
                  <div className="mt-4 p-3 bg-red-100 rounded text-xs text-red-700">
                    <p className="font-semibold mb-2">🔍 Vérifications à faire :</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Django est bien démarré : <code>python manage.py runserver</code></li>
                      <li>Teste cette URL : <code>http://127.0.0.1:8000/api/core/competences/</code></li>
                      <li>Le fichier <code>core/urls.py</code> existe</li>
                      <li>Le fichier <code>modules/competences/api/competences.api.js</code> existe</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Debug info */}
              {!loadingCompetences && !errorCompetences && (
                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-600">
                  <p>📊 Debug: {competencesDisponibles.length} compétence(s) chargée(s)</p>
                </div>
              )}

              {/* Liste vide */}
              {!loadingCompetences && !errorCompetences && competencesDisponibles.length === 0 && (
                <div className="text-center py-12 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <Brain className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <p className="text-gray-800 font-semibold text-lg mb-2">Aucune compétence disponible</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Vous devez d'abord ajouter des compétences dans la base de données.
                  </p>
                  <p className="text-xs text-gray-500">
                    Utilisez Django Admin ou la console Python pour ajouter des compétences.
                  </p>
                </div>
              )}

              {/* Grille des compétences */}
              {!loadingCompetences && !errorCompetences && competencesDisponibles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {competencesDisponibles.map(comp => {
                    const isSelected = competencesSelectionnees.find(c => c.competence_id === comp.id);
                    
                    return (
                      <div
                        key={comp.id}
                        className={`
                          relative border-2 rounded-lg p-4 cursor-pointer transition-all
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                          }
                        `}
                        onClick={() => toggleCompetence(comp)}
                      >
                        {/* Checkbox */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`
                              w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                              ${isSelected 
                                ? 'bg-blue-600 border-blue-600' 
                                : 'border-gray-300 bg-white'
                              }
                            `}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="font-semibold text-gray-800">{comp.libelle}</span>
                          </div>
                        </div>
                        
                        {/* Catégorie */}
                        {comp.categorie && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-2">
                            {comp.categorie}
                          </span>
                        )}
                        
                        {/* Sélecteur de niveau */}
                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Niveau requis
                            </label>
                            <select
                              value={isSelected.niveau_requis}
                              onChange={(e) => {
                                e.stopPropagation();
                                changerNiveauCompetence(comp.id, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full px-3 py-2 border border-blue-300 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              {niveauxCompetence.map(n => (
                                <option key={n.value} value={n.value}>{n.label}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Boutons de navigation */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setEtapeActuelle(1)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" /> Retour
                </button>
                <button
                  onClick={handleEtape2Submit}
                  disabled={loading || competencesSelectionnees.length === 0}
                  className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    competencesSelectionnees.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Enregistrement...' : 'Continuer'} <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Message d'aide */}
              {competencesSelectionnees.length === 0 && competencesDisponibles.length > 0 && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  💡 Sélectionnez au moins une compétence pour continuer
                </p>
              )}
            </div>
          )}

          {/* ÉTAPE 3 : Tests */}
          {etapeActuelle === 3 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-semibold">✅ Compétences enregistrées</p>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Tests de compétences (optionnel)
              </h3>

              <p className="text-gray-600 text-sm">
                Créez des questions de test pour évaluer les candidats sur les compétences sélectionnées. Cette étape est optionnelle.
              </p>

              {competencesSelectionnees.map(comp => (
                <div key={comp.competence_id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{comp.competence_nom}</h4>
                      <p className="text-sm text-gray-500">Niveau requis: {comp.niveau_requis}</p>
                    </div>
                    <button
                      onClick={() => ajouterTest(comp.competence_id)}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Ajouter un test
                    </button>
                  </div>

                  {tests[comp.competence_id] && tests[comp.competence_id].length > 0 ? (
                    <div className="space-y-3">
                      {tests[comp.competence_id].map((test, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-gray-700">Question {index + 1}</p>
                            <button
                              onClick={() => supprimerTest(comp.competence_id, index)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          
                          <input
                            type="text"
                            placeholder="Posez votre question..."
                            value={test.question}
                            onChange={(e) => modifierTest(comp.competence_id, index, 'question', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                          
                          <input
                            type="text"
                            placeholder="Réponse correcte attendue"
                            value={test.reponse_correcte}
                            onChange={(e) => modifierTest(comp.competence_id, index, 'reponse_correcte', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                          
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Score:</label>
                            <input
                              type="number"
                              placeholder="10"
                              value={test.score}
                              onChange={(e) => modifierTest(comp.competence_id, index, 'score', parseInt(e.target.value) || 0)}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                              min="1"
                              max="100"
                            />
                            <span className="text-sm text-gray-500">points</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-sm text-gray-500">Aucun test créé pour cette compétence</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Boutons de navigation */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setEtapeActuelle(2)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" /> Retour
                </button>
                <button
                  onClick={passerEtape3}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Passer cette étape
                </button>
                <button
                  onClick={handleEtape3Submit}
                  disabled={loading}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                  {loading ? 'Finalisation...' : 'Terminer'} <CheckCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Info sur le nombre total de tests */}
              {Object.keys(tests).length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-blue-800 text-sm">
                    📝 {Object.values(tests).flat().length} test(s) créé(s) au total
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}