// modules/chomeurs/components/EmptyState.jsx
import React from 'react';

/**
 * 🚫 Composant EmptyState - Affichage quand il n'y a pas de données
 * 
 * @param {ReactNode} icon - Icône Lucide React
 * @param {string} title - Titre
 * @param {string} description - Description
 * @param {ReactNode} action - Bouton d'action
 * @param {string} className - Classes CSS supplémentaires
 */
export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = ''
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {Icon && <Icon className="w-10 h-10 text-gray-400" />}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action}
    </div>
  );
}