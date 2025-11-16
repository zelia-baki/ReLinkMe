// modules/Offres/pages/PublierOffre.jsx
import React, { useState, useEffect } from 'react';
import { publierOffre, ajouterCompetences, ajouterTests } from '../api/offres.api';
import { getAllCompetences } from '@/modules/competences/api/competences.api';
import { Briefcase, FileText, DollarSign, Calendar, Tag, Brain, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

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

  // Étape 3 : Tests (optionnel)
  const [tests, setTests] = useState({});

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Charger les compétences au montage
  useEffect(() => {
    chargerCompetences();
  }, []);

  const chargerCompetences = async () => {
    try {
      const data = await getAllCompetences();
      setCompetencesDisponibles(data);
    } catch (error) {
      console.error('❌ Erreur chargement compétences:', error);
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
      setEtapeActuelle(2); // Passer à l'étape 2

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
    const existe = competencesSelectionnees.find(c => c.competence_id === competence.id);
    
    if (existe) {
      setCompetencesSelectionnees(prev => 
        prev.filter(c => c.competence_id !== competence.id)
      );
    } else {
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
      // Envoyer les compétences au backend
      const payload = competencesSelectionnees.map(c => ({
        offre: offreCreee.id,
        competence: c.competence_id,
        niveau_requis: c.niveau_requis
      }));

      console.log('🚀 Ajout des compétences:', payload);
      await ajouterCompetences(payload);
      console.log('✅ Compétences ajoutées');
      
      setEtapeActuelle(3); // Passer à l'étape 3

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
      // Préparer les tests pour l'envoi
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
        window.location.href = '/recruteur/mes-offres';
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
      window.location.href = '/recruteur/mes-offres';
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
          <p className="text-gray-500 text-sm mt-2">Redirection vers vos offres...</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salaire</label>
                  <input
                    type="number"
                    name="salaire"
                    value={formData.salaire}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 50000"
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
                  placeholder="Décrivez le poste..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                <p className="text-xs text-gray-500 mt-1">{formData.description.length} caractères (minimum 50)</p>
              </div>

              <button
                onClick={handleEtape1Submit}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
              >
                Continuer <ArrowRight className="w-5 h-5" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competencesDisponibles.map(comp => {
                  const isSelected = competencesSelectionnees.find(c => c.competence_id === comp.id);
                  
                  return (
                    <div
                      key={comp.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => toggleCompetence(comp)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{comp.libelle}</span>
                        <input
                          type="checkbox"
                          checked={!!isSelected}
                          onChange={() => {}}
                          className="w-5 h-5"
                        />
                      </div>
                      
                      {isSelected && (
                        <select
                          value={isSelected.niveau_requis}
                          onChange={(e) => {
                            e.stopPropagation();
                            changerNiveauCompetence(comp.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full mt-2 px-3 py-1 border border-blue-300 rounded text-sm"
                        >
                          {niveauxCompetence.map(n => (
                            <option key={n.value} value={n.value}>{n.label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setEtapeActuelle(1)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" /> Retour
                </button>
                <button
                  onClick={handleEtape2Submit}
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                >
                  Continuer <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Tests */}
          {etapeActuelle === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700">
                Tests de compétences (optionnel)
              </h3>

              <p className="text-gray-600 text-sm">
                Créez des questions de test pour évaluer les candidats. Vous pouvez passer cette étape.
              </p>

              {competencesSelectionnees.map(comp => (
                <div key={comp.competence_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{comp.competence_nom}</h4>
                    <button
                      onClick={() => ajouterTest(comp.competence_id)}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
                    >
                      + Ajouter un test
                    </button>
                  </div>

                  {tests[comp.competence_id]?.map((test, index) => (
                    <div key={index} className="bg-gray-50 rounded p-3 mb-2">
                      <input
                        type="text"
                        placeholder="Question"
                        value={test.question}
                        onChange={(e) => modifierTest(comp.competence_id, index, 'question', e.target.value)}
                        className="w-full px-3 py-2 border rounded mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Réponse correcte"
                        value={test.reponse_correcte}
                        onChange={(e) => modifierTest(comp.competence_id, index, 'reponse_correcte', e.target.value)}
                        className="w-full px-3 py-2 border rounded mb-2"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Score"
                          value={test.score}
                          onChange={(e) => modifierTest(comp.competence_id, index, 'score', parseInt(e.target.value))}
                          className="w-20 px-3 py-2 border rounded"
                        />
                        <button
                          onClick={() => supprimerTest(comp.competence_id, index)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  onClick={() => setEtapeActuelle(2)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                >
                  <ArrowLeft className="inline w-5 h-5 mr-2" /> Retour
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
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  Terminer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}