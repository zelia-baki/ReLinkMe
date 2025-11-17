import React from 'react';

/**
 * Composant de carte de statistique
 */
export default function StatCard({ icon: Icon, label, value, color = "blue", onClick }) {
  return (
    <div 
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
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
    </div>
  );
}