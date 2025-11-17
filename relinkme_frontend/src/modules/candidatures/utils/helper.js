// modules/candidatures/utils/helpers.js

import { 
  Clock, Eye, CheckCircle, XCircle, UserCheck 
} from 'lucide-react';

/**
 * Obtenir les informations de style et label pour un statut
 */
export const getStatutInfo = (statut) => {
  const configs = {
    en_attente: {
      label: 'En attente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: Clock,
      description: 'Candidature en cours d\'examen'
    },
    vue: {
      label: 'Vue',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: Eye,
      description: 'Candidature consultée par le recruteur'
    },
    acceptee: {
      label: 'Acceptée',
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: CheckCircle,
      description: 'Candidature acceptée'
    },
    refusee: {
      label: 'Refusée',
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: XCircle,
      description: 'Candidature non retenue'
    },
    entretien: {
      label: 'Entretien',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: UserCheck,
      description: 'Convoqué à un entretien'
    }
  };
  return configs[statut] || configs.en_attente;
};

/**
 * Formater une date pour l'affichage
 */
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return 'Non définie';
  
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  
  if (format === 'long') {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
  
  if (format === 'full') {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return date.toLocaleDateString('fr-FR');
};

/**
 * Obtenir les initiales d'un nom
 */
export const getInitials = (nom) => {
  if (!nom) return '?';
  return nom
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Formater un salaire
 */
export const formatSalaire = (salaire) => {
  if (!salaire) return 'Non précisé';
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0
  }).format(salaire);
};

/**
 * Calculer le temps écoulé depuis une date
 */
export const getTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  return `Il y a ${Math.floor(diffDays / 30)} mois`;
};

/**
 * Vérifier si une candidature est modifiable
 */
export const isCandidatureModifiable = (statut) => {
  return statut === 'en_attente' || statut === 'vue';
};

/**
 * Obtenir le badge de niveau d'expertise
 */
export const getNiveauBadge = (niveau) => {
  const badges = {
    débutant: {
      label: 'Débutant',
      color: 'bg-gray-100 text-gray-800 border-gray-300'
    },
    intermédiaire: {
      label: 'Intermédiaire',
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    expert: {
      label: 'Expert',
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    }
  };
  return badges[niveau] || badges.débutant;
};