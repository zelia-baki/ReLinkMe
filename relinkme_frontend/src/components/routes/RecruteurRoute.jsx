// components/routes/RecruteurRoute.jsx
// Composant de protection pour les routes accessibles uniquement aux recruteurs
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecruteur } from '@/modules/recruteur/hooks/useRecruteur';
import { AlertTriangle } from 'lucide-react';

export default function RecruteurRoute({ children }) {
  const { isRecruteur, loading } = useRecruteur();

  // ⏳ Pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // ❌ Si pas recruteur, afficher un message d'erreur
  if (!isRecruteur) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès réservé aux recruteurs</h2>
          <p className="text-gray-600 mb-6">
            Cette page est uniquement accessible aux utilisateurs ayant un profil recruteur.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.href = '/recruteur/inscription'}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Devenir recruteur
            </button>
            <button
              onClick={() => window.location.href = '/offres'}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
            >
              Voir les offres
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Si recruteur, afficher la page
  return children;
}