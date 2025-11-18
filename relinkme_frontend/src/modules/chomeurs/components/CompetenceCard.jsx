// modules/chomeurs/components/CompetenceCard.jsx
import React from 'react';
import { Edit2, Trash2, Award } from 'lucide-react';
import Badge from './Badge';

/**
 * 🏆 Composant CompetenceCard - Carte de compétence
 * 
 * @param {object} competence - Objet compétence avec {id, competence_nom, competence, niveau_maitrise, categorie}
 * @param {function} onEdit - Fonction d'édition
 * @param {function} onDelete - Fonction de suppression
 * @param {boolean} showActions - Afficher les boutons d'action
 */
export default function CompetenceCard({ 
  competence, 
  onEdit, 
  onDelete, 
  showActions = true 
}) {
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">
              {competence.competence_nom || competence.competence?.libelle}
            </h3>
            {(competence.competence?.categorie || competence.categorie) && (
              <p className="text-sm text-gray-600">
                {competence.competence?.categorie || competence.categorie}
              </p>
            )}
          </div>
        </div>
        
        <Badge variant={competence.niveau_maitrise}>
          {competence.niveau_maitrise.charAt(0).toUpperCase() + competence.niveau_maitrise.slice(1)}
        </Badge>
      </div>

      {showActions && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit && onEdit(competence)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit2 className="w-3 h-3" />
            Modifier
          </button>
          <button
            onClick={() => onDelete && onDelete(competence.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}