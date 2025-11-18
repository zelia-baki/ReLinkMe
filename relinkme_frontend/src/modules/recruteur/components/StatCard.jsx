// modules/recruteurs/components/StatCard.jsx
import React from 'react';
import * as Icons from 'lucide-react';

/**
 * 📊 Carte de statistique moderne et réutilisable
 * Affiche une métrique avec icône, label et valeur
 * 
 * @param {Object} props
 * @param {string|ReactComponent} props.icon - Nom de l'icône Lucide ou composant
 * @param {string} props.label - Label de la statistique
 * @param {number|string} props.value - Valeur à afficher
 * @param {string} props.color - Couleur du thème (blue, green, yellow, red, purple)
 * @param {string} props.trend - Tendance optionnelle (+12%)
 * @param {boolean} props.loading - État de chargement
 * @param {function} props.onClick - Action au clic
 * @param {string} props.description - Description optionnelle
 */
export default function StatCard({ 
  icon, 
  label, 
  value, 
  color = 'blue',
  trend,
  loading = false,
  onClick,
  description,
  className = ''
}) {
  // Résoudre l'icône (nom string ou composant direct)
  const IconComponent = typeof icon === 'string' 
    ? Icons[icon] || Icons.Activity 
    : icon;

  // Configuration des couleurs par thème
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      border: 'border-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      hoverBg: 'hover:bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      border: 'border-green-500',
      gradient: 'from-green-500 to-green-600',
      hoverBg: 'hover:bg-green-100'
    },
    yellow: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      border: 'border-yellow-500',
      gradient: 'from-yellow-500 to-yellow-600',
      hoverBg: 'hover:bg-yellow-100'
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      border: 'border-red-500',
      gradient: 'from-red-500 to-red-600',
      hoverBg: 'hover:bg-red-100'
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      border: 'border-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      hoverBg: 'hover:bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      border: 'border-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      hoverBg: 'hover:bg-orange-100'
    },
    indigo: {
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      border: 'border-indigo-500',
      gradient: 'from-indigo-500 to-indigo-600',
      hoverBg: 'hover:bg-indigo-100'
    },
    pink: {
      bg: 'bg-pink-50',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      border: 'border-pink-500',
      gradient: 'from-pink-500 to-pink-600',
      hoverBg: 'hover:bg-pink-100'
    },
    gray: {
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      border: 'border-gray-500',
      gradient: 'from-gray-500 to-gray-600',
      hoverBg: 'hover:bg-gray-100'
    }
  };

  const colors = colorConfig[color] || colorConfig.blue;

  // Format du nombre avec séparateurs
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString('fr-FR');
    }
    return val;
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border-l-4 ${colors.border} p-6
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        {/* Contenu principal */}
        <div className="flex-1">
          {/* Label */}
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          
          {/* Valeur */}
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-800">
                {formatValue(value)}
              </p>
              
              {/* Tendance optionnelle */}
              {trend && (
                <span className={`text-sm font-medium ${
                  trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend}
                </span>
              )}
            </div>
          )}

          {/* Description optionnelle */}
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {/* Icône */}
        <div className={`${colors.iconBg} p-3 rounded-lg ${colors.hoverBg} transition-colors`}>
          <IconComponent className={`w-8 h-8 ${colors.iconColor}`} />
        </div>
      </div>
    </div>
  );
}

// Variantes prédéfinies pour utilisation rapide
export const StatCardVariants = {
  Primary: (props) => <StatCard {...props} color="blue" />,
  Success: (props) => <StatCard {...props} color="green" />,
  Warning: (props) => <StatCard {...props} color="yellow" />,
  Danger: (props) => <StatCard {...props} color="red" />,
  Info: (props) => <StatCard {...props} color="purple" />
};

// Exemple d'utilisation avec skeleton loader
export function StatCardSkeleton({ className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Grid de statistiques avec gestion responsive
export function StatsGrid({ stats, loading = false, columns = 4, className = '' }) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {loading ? (
        Array.from({ length: columns }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))
      ) : (
        stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))
      )}
    </div>
  );
}