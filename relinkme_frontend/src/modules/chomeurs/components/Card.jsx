// modules/chomeurs/components/Card.jsx
import React from 'react';

/**
 * 🃏 Composant Card unifié
 * 
 * @param {ReactNode} children - Contenu de la carte
 * @param {string} className - Classes CSS supplémentaires
 * @param {boolean} hover - Activer l'effet hover (shadow)
 * @param {function} onClick - Fonction au clic (rend la carte cliquable)
 * @param {boolean} noPadding - Désactiver le padding par défaut
 */
export default function Card({ 
  children, 
  className = '', 
  hover = true,
  onClick,
  noPadding = false
}) {
  const baseStyle = `
    bg-white rounded-xl shadow-sm border border-gray-200
    ${hover ? 'hover:shadow-md transition-shadow' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${!noPadding ? 'p-6' : ''}
  `;
  
  return (
    <div className={`${baseStyle} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}