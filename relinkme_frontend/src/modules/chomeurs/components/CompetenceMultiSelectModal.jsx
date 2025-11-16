import React, { useState, useEffect } from 'react';
import { X, Award, Search, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Modal pour ajouter plusieurs compétences en une fois
 */
export default function CompetenceMultiSelectModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  competencesList = [],
  currentCompetencesCount = 0,
  alreadySelectedIds = []
}) {
  const MAX_COMPETENCES = 20;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCompetences, setSelectedCompetences] = useState([]);
  const [niveauxMaitrise, setNiveauxMaitrise] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Réinitialiser au changement de modal
  useEffect(() => {
    if (isOpen) {
      setSelectedCompetences([]);
      setNiveauxMaitrise({});
      setSearchTerm('');
      setSelectedCategory('all');
      setErrors({});
    }
  }, [isOpen]);

  // Calculer les places restantes
  const remainingSlots = MAX_COMPETENCES - currentCompetencesCount;
  const canAdd = selectedCompetences.length <= remainingSlots;

  // Extraire les catégories uniques
  const categories = ['all', ...new Set(competencesList.map(c => c.categorie).filter(Boolean))];

  // Filtrer les compétences disponibles (non déjà ajoutées)
  const availableCompetences = competencesList.filter(
    comp => !alreadySelectedIds.includes(comp.id)
  );

  // Filtrer selon recherche et catégorie
  const filteredCompetences = availableCompetences.filter(comp => {
    const matchSearch = comp.libelle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || comp.categorie === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Grouper par catégorie pour l'affichage
  const groupedCompetences = filteredCompetences.reduce((acc, comp) => {
    const cat = comp.categorie || 'Autre';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(comp);
    return acc;
  }, {});

  // Toggle sélection d'une compétence
  const toggleCompetence = (compId) => {
    setSelectedCompetences(prev => {
      if (prev.includes(compId)) {
        // Retirer la compétence
        const newNiveaux = { ...niveauxMaitrise };
        delete newNiveaux[compId];
        setNiveauxMaitrise(newNiveaux);
        return prev.filter(id => id !== compId);
      } else {
        // Ajouter la compétence
        if (prev.length >= remainingSlots) {
          setErrors({ 
            general: `Vous ne pouvez ajouter que ${remainingSlots} compétence(s) supplémentaire(s) (limite: ${MAX_COMPETENCES})`
          });
          return prev;
        }
        setNiveauxMaitrise(prev => ({ ...prev, [compId]: 'intermédiaire' }));
        return [...prev, compId];
      }
    });
    setErrors({});
  };

  // Changer le niveau de maîtrise
  const handleNiveauChange = (compId, niveau) => {
    setNiveauxMaitrise(prev => ({ ...prev, [compId]: niveau }));
  };

  // Sélectionner toutes les compétences d'une catégorie
  const selectCategory = (categorie) => {
    const categoryComps = filteredCompetences
      .filter(c => c.categorie === categorie)
      .map(c => c.id)
      .filter(id => !selectedCompetences.includes(id));
    
    const newSelection = [...selectedCompetences, ...categoryComps].slice(0, remainingSlots);
    
    setSelectedCompetences(newSelection);
    
    // Définir le niveau par défaut pour les nouvelles
    const newNiveaux = { ...niveauxMaitrise };
    categoryComps.forEach(id => {
      if (!newNiveaux[id]) {
        newNiveaux[id] = 'intermédiaire';
      }
    });
    setNiveauxMaitrise(newNiveaux);
  };

  // Validation et soumission
  const handleSubmit = async () => {
    if (selectedCompetences.length === 0) {
      setErrors({ general: 'Sélectionnez au moins une compétence' });
      return;
    }

    if (!canAdd) {
      setErrors({ general: `Limite de ${MAX_COMPETENCES} compétences atteinte` });
      return;
    }

    setLoading(true);
    try {
      // Préparer les données
      const competencesData = selectedCompetences.map(compId => ({
        competence: compId,
        niveau_maitrise: niveauxMaitrise[compId] || 'intermédiaire'
      }));

      await onSubmit(competencesData);
      onClose();
    } catch (error) {
      setErrors({ general: error.message || 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Ajouter des compétences
              </h2>
              <p className="text-sm text-gray-600">
                {selectedCompetences.length} sélectionnée(s) • {remainingSlots} place(s) disponible(s)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Alerte limite */}
          {currentCompetencesCount >= MAX_COMPETENCES ? (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Limite atteinte</p>
                <p className="text-sm text-red-700">
                  Vous avez atteint la limite de {MAX_COMPETENCES} compétences. 
                  Supprimez-en pour en ajouter de nouvelles.
                </p>
              </div>
            </div>
          ) : remainingSlots <= 5 && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                Plus que {remainingSlots} place(s) disponible(s) sur {MAX_COMPETENCES}
              </p>
            </div>
          )}

          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {/* Filtres */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une compétence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'Toutes' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Liste des compétences groupées */}
          <div className="space-y-6">
            {Object.entries(groupedCompetences).map(([categorie, comps]) => (
              <div key={categorie}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    {categorie} ({comps.length})
                  </h3>
                  <button
                    onClick={() => selectCategory(categorie)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Tout sélectionner
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {comps.map(comp => {
                    const isSelected = selectedCompetences.includes(comp.id);
                    return (
                      <div
                        key={comp.id}
                        className={`p-3 border rounded-lg transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleCompetence(comp.id)}
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                          </button>

                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{comp.libelle}</p>
                          </div>

                          {isSelected && (
                            <select
                              value={niveauxMaitrise[comp.id] || 'intermédiaire'}
                              onChange={(e) => handleNiveauChange(comp.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="débutant">Débutant</option>
                              <option value="intermédiaire">Intermédiaire</option>
                              <option value="avancé">Avancé</option>
                              <option value="expert">Expert</option>
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredCompetences.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune compétence disponible</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedCompetences.length} compétence(s) sélectionnée(s)
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || selectedCompetences.length === 0 || !canAdd}
                className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
                  loading || selectedCompetences.length === 0 || !canAdd
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Ajout en cours...' : `Ajouter (${selectedCompetences.length})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}