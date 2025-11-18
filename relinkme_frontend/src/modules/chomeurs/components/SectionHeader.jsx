// modules/chomeurs/components/SectionHeader.jsx
import React from 'react';

/**
 * 📋 Composant SectionHeader - En-tête de section unifié
 * 
 * @param {ReactNode} icon - Icône Lucide React
 * @param {string} title - Titre de la section
 * @param {string} subtitle - Sous-titre optionnel
 * @param {ReactNode} action - Bouton ou action à droite
 * @param {ReactNode} children - Contenu personnalisé à droite
 * @param {string} className - Classes CSS supplémentaires
 */
export default function SectionHeader({ 
  icon: Icon, 
  title, 
  subtitle, 
  action, 
  children,
  className = ''
}) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>
      {action || children}
    </div>
  );
}