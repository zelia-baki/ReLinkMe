// modules/candidatures/components/StatutBadge.jsx
import React from 'react';
import { Clock, Eye, CheckCircle, XCircle, UserCheck } from 'lucide-react';

/**
 * Badge de statut réutilisable pour les candidatures
 * 
 * @param {string} statut - Le statut de la candidature
 * @param {boolean} showIcon - Afficher ou non l'icône (default: true)
 * @param {string} size - Taille du badge ('sm', 'md', 'lg') (default: 'md')
 */
export default function StatutBadge({ statut, showIcon = true, size = 'md' }) {
  const configs = {
    en_attente: {
      label: 'En attente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: Clock
    },
    vue: {
      label: 'Vue',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: Eye
    },
    acceptee: {
      label: 'Acceptée',
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: CheckCircle
    },
    refusee: {
      label: 'Refusée',
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: XCircle
    },
    entretien: {
      label: 'Entretien',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: UserCheck
    }
  };

  const config = configs[statut] || configs.en_attente;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-semibold
        ${config.color}
        ${sizeClasses[size]}
      `}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}