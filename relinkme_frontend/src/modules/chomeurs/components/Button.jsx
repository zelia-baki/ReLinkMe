// modules/chomeurs/components/Button.jsx
import React from 'react';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '../utils/constants';

/**
 * 🔘 Composant Button unifié
 * 
 * @param {ReactNode} children - Contenu du bouton
 * @param {string} variant - Type de bouton (primary, secondary, outline, etc.)
 * @param {string} size - Taille du bouton (xs, sm, md, lg, xl)
 * @param {ReactNode} icon - Icône Lucide React
 * @param {function} onClick - Fonction au clic
 * @param {boolean} disabled - État désactivé
 * @param {string} type - Type HTML (button, submit, reset)
 * @param {string} className - Classes CSS supplémentaires
 * @param {boolean} fullWidth - Prendre toute la largeur
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false
}) {
  const baseStyle = "rounded-lg font-semibold transition-colors flex items-center justify-center gap-2";
  const variantStyle = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  const sizeStyle = BUTTON_SIZES[size] || BUTTON_SIZES.md;
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}