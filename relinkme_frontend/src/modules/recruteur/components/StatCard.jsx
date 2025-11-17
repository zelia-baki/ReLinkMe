// modules/recruteur/components/StatCard.jsx
import React from 'react';

/**
 * 📊 Composant de carte de statistique réutilisable
 */
export default function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color = 'blue',
  subtitle = null,
  onClick = null
}) {
  
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      value: 'text-blue-700',
      hover: 'hover:bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      value: 'text-green-700',
      hover: 'hover:bg-green-100'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      value: 'text-yellow-700',
      hover: 'hover:bg-yellow-100'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      value: 'text-purple-700',
      hover: 'hover:bg-purple-100'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      value: 'text-red-700',
      hover: 'hover:bg-red-100'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      value: 'text-orange-700',
      hover: 'hover:bg-orange-100'
    }
  };
  
  const colors = colorClasses[color] || colorClasses.blue;
  
  return (
    <div 
      className={`
        ${colors.bg} rounded-xl p-6 border border-gray-200 
        transition-all duration-200
        ${onClick ? `cursor-pointer ${colors.hover}` : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          {Icon && <Icon className={`w-6 h-6 ${colors.icon}`} />}
        </div>
      </div>
      
      <div className="mb-1">
        <p className="text-sm font-medium text-gray-600 mb-2">
          {label}
        </p>
        <p className={`text-3xl font-bold ${colors.value}`}>
          {value}
        </p>
      </div>
      
      {subtitle && (
        <p className="text-xs text-gray-500 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}