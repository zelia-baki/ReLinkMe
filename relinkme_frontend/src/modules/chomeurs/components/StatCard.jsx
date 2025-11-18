// modules/chomeurs/components/StatCard.jsx
import React from 'react';
import Card from './Card';

/**
 * 📊 Composant StatCard - Carte de statistique
 * 
 * @param {ReactNode} icon - Icône Lucide React
 * @param {string} label - Libellé de la statistique
 * @param {string|number} value - Valeur à afficher
 * @param {string} color - Couleur du thème (blue, green, yellow, red, purple, gray)
 * @param {function} onClick - Fonction au clic (rend la carte cliquable)
 * @param {string} className - Classes CSS supplémentaires
 */
export default function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color = 'blue', 
  onClick,
  className = ''
}) {
  return (
    <Card 
      onClick={onClick}
      hover={!!onClick}
      className={className}
    >
      <div className="flex items-center gap-3">
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </Card>
  );
}