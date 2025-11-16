// modules/chomeur/utils/helpers.js

/**
 * Formate une date en français
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formate une date courte
 */
export const formatDateShort = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Retourne le badge de niveau avec couleur
 */
export const getNiveauBadge = (niveau) => {
  const niveaux = {
    débutant: {
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      label: 'Débutant'
    },
    intermédiaire: {
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      label: 'Intermédiaire'
    },
    avancé: {
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      label: 'Avancé'
    },
    expert: {
      color: 'bg-green-100 text-green-700 border-green-300',
      label: 'Expert'
    }
  };

  return niveaux[niveau] || niveaux.débutant;
};

/**
 * Retourne le badge de statut de candidature
 */
export const getStatutInfo = (statut) => {
  const statuts = {
    en_attente: {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      label: 'En attente',
      icon: 'Clock'
    },
    vue: {
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      label: 'Vue',
      icon: 'Eye'
    },
    acceptee: {
      color: 'bg-green-100 text-green-700 border-green-300',
      label: 'Acceptée',
      icon: 'CheckCircle'
    },
    refusee: {
      color: 'bg-red-100 text-red-700 border-red-300',
      label: 'Refusée',
      icon: 'XCircle'
    },
    entretien: {
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      label: 'Entretien',
      icon: 'Calendar'
    }
  };

  return statuts[statut] || statuts.en_attente;
};

/**
 * Retourne les initiales d'un nom
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Calcule le taux de réussite
 */
export const calculateSuccessRate = (total, success) => {
  if (total === 0) return 0;
  return Math.round((success / total) * 100);
};

/**
 * Valide un email
 */
export const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

/**
 * Valide un numéro de téléphone
 */
export const isValidPhone = (phone) => {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
};

/**
 * Tronque un texte
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formate un nombre avec séparateurs
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

/**
 * Retourne une couleur aléatoire pour les avatars
 */
export const getRandomColor = () => {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-pink-500 to-rose-600',
    'from-orange-500 to-red-600',
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-pink-600'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Debounce function pour limiter les appels API
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};