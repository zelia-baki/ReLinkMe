import React, { useState, useEffect } from 'react';
import { X, Award } from 'lucide-react';

/**
 * Modal pour ajouter/modifier une compétence
 */
export default function CompetenceModal({ isOpen, onClose, onSubmit, competence = null, competencesList = [] }) {
  const [formData, setFormData] = useState({
    competence: '',
    niveau_maitrise: 'intermédiaire'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (competence) {
      setFormData({
        competence: competence.competence,
        niveau_maitrise: competence.niveau_maitrise
      });
    } else {
      setFormData({
        competence: '',
        niveau_maitrise: 'intermédiaire'
      });
    }
    setErrors({});
  }, [competence, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.competence) {
      newErrors.competence = 'Sélectionnez une compétence';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
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
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {competence ? 'Modifier la compétence' : 'Ajouter une compétence'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compétence *
            </label>
            <select
              name="competence"
              value={formData.competence}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.competence ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!!competence}
            >
              <option value="">-- Sélectionnez une compétence --</option>
              {competencesList.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.libelle} {comp.categorie && `(${comp.categorie})`}
                </option>
              ))}
            </select>
            {errors.competence && (
              <p className="text-red-500 text-sm mt-1">{errors.competence}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de maîtrise *
            </label>
            <select
              name="niveau_maitrise"
              value={formData.niveau_maitrise}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="débutant">Débutant</option>
              <option value="intermédiaire">Intermédiaire</option>
              <option value="avancé">Avancé</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Enregistrement...' : competence ? 'Modifier' : 'Ajouter'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}