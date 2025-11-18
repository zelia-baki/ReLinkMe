// modules/chomeurs/components/Badge.jsx
import React from 'react';
import { BADGE_STYLES } from '../utils/constants';

/**
 * 🏷️ Composant Badge unifié
 * 
 * @param {string} variant - Type de badge (débutant, expert, en_attente, etc.)
 * @param {ReactNode} children - Contenu du badge
 * @param {string} className - Classes CSS supplémentaires
 * @param {ReactNode} icon - Icône optionnelle (Lucide React)
 */
export default function Badge({ 
  variant = 'default', 
  children, 
  className = '',
  icon: Icon 
}) {
  const baseStyle = "px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1";
  const variantStyle = BADGE_STYLES[variant] || BADGE_STYLES.default;
  
  return (
    <span className={`${baseStyle} ${variantStyle} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}