// modules/candidatures/components/CandidatureCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Building2, Calendar, Coins, Eye, Mail, User 
} from 'lucide-react';
import StatutBadge from './StatutBadge';
import { formatDate, getInitials } from '@/modules/candidatures/utils/helper';

/**
 * Carte de candidature réutilisable
 * 
 * @param {Object} candidature - Les données de la candidature
 * @param {string} type - 'chomeur' ou 'recruteur' pour adapter l'affichage
 * @param {Function} onAction - Callback pour actions personnalisées (optionnel)
 */
export default function CandidatureCard({ candidature, type = 'chomeur', onAction }) {
  const navigate = useNavigate();

  const handleVoirDetails = () => {
    const basePath = type === 'recruteur' ? '/recruteur' : '/chomeur';
    navigate(`${basePath}/candidatures/${candidature.id}`);
  };

  // Vue pour le chômeur (focus sur l'offre)
  if (type === 'chomeur') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {candidature.offre_titre}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">{candidature.recruteur_nom || 'Entreprise'}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm">{candidature.offre_code}</span>
            </div>
          </div>
          
          <StatutBadge statut={candidature.statut} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>{candidature.offre_type_contrat}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Postulé le {formatDate(candidature.date_postulation)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span>{candidature.jetons_utilises} jetons</span>
          </div>
        </div>

        <button
          onClick={handleVoirDetails}
          className="w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Eye className="w-4 h-4" />
          Voir les détails
        </button>
      </div>
    );
  }

  // Vue pour le recruteur (focus sur le candidat)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {candidature.chomeur_photo ? (
            <img 
              src={candidature.chomeur_photo} 
              alt="" 
              className="w-full h-full rounded-full object-cover" 
            />
          ) : (
            getInitials(candidature.chomeur_nom)
          )}
        </div>

        <div className="flex-1">
          {/* Nom et statut */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {candidature.chomeur_nom}
              </h3>
              <p className="text-gray-600">{candidature.chomeur_profession || 'Profession non renseignée'}</p>
            </div>
            
            <StatutBadge statut={candidature.statut} />
          </div>

          {/* Infos */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{candidature.chomeur_email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>{candidature.offre_titre}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Postulé le {formatDate(candidature.date_postulation)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleVoirDetails}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 font-medium text-sm"
            >
              <Eye className="w-4 h-4" />
              Voir détails
            </button>
            
            {onAction && candidature.statut === 'en_attente' && (
              <>
                <button
                  onClick={() => onAction(candidature.id, 'entretien')}
                  className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm"
                >
                  Entretien
                </button>
                <button
                  onClick={() => onAction(candidature.id, 'acceptee')}
                  className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                >
                  Accepter
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}