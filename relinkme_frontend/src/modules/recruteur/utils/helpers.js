
/**
 *  Génère les initiales à partir d'un nom complet
 */
export const getInitials = (nomComplet) => {
  if (!nomComplet) return '??';
  
  const parts = nomComplet.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * 📅 Formate une date en français
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Non définie';
  
  const date = new Date(dateString);
  
  // Vérifier si la date est valide
  if (isNaN(date.getTime())) return 'Date invalide';
  
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * 📅 Formate une date en version longue
 */
export const formatDateLong = (dateString) => {
  if (!dateString) return 'Non définie';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return 'Date invalide';
  
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * ⏰ Calcule le temps écoulé depuis une date
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
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
};

/**
 * 💰 Formate un montant en Ariary (MGA)
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
 * 🎨 Retourne les infos de style pour le statut d'une offre
 */
export const getStatutOffreInfo = (statut) => {
  const statutMap = {
    active: {
      label: 'Active',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '✓',
      bgClass: 'bg-green-50'
    },
    inactive: {
      label: 'Inactive',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: '○',
      bgClass: 'bg-gray-50'
    },
    closed: {
      label: 'Fermée',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '✕',
      bgClass: 'bg-red-50'
    },
    expired: {
      label: 'Expirée',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: '⏱',
      bgClass: 'bg-orange-50'
    }
  };
  
  return statutMap[statut] || statutMap.active;
};

/**
 * 🎨 Retourne les infos de style pour le statut d'une candidature
 */
export const getStatutCandidatureInfo = (statut) => {
  const statutMap = {
    en_attente: {
      label: 'En attente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '⏳',
      bgClass: 'bg-yellow-50'
    },
    acceptee: {
      label: 'Acceptée',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '✓',
      bgClass: 'bg-green-50'
    },
    refusee: {
      label: 'Refusée',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '✕',
      bgClass: 'bg-red-50'
    },
    en_cours: {
      label: 'En cours',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '↻',
      bgClass: 'bg-blue-50'
    },
    annulee: {
      label: 'Annulée',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: '⊘',
      bgClass: 'bg-gray-50'
    }
  };
  
  return statutMap[statut] || statutMap.en_attente;
};

/**
 * 🏢 Retourne un badge pour la taille de l'entreprise
 */
export const getTailleEntrepriseBadge = (nombreEmployes) => {
  if (!nombreEmployes) {
    return {
      label: 'Non définie',
      color: 'bg-gray-100 text-gray-600 border-gray-200',
      size: ''
    };
  }
  
  if (nombreEmployes <= 10) {
    return {
      label: 'TPE',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      size: 'Très Petite Entreprise'
    };
  } else if (nombreEmployes <= 50) {
    return {
      label: 'PME',
      color: 'bg-green-100 text-green-700 border-green-200',
      size: 'Petite et Moyenne Entreprise'
    };
  } else if (nombreEmployes <= 250) {
    return {
      label: 'ETI',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      size: 'Entreprise de Taille Intermédiaire'
    };
  } else {
    return {
      label: 'GE',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      size: 'Grande Entreprise'
    };
  }
};

/**
 * 🎯 Retourne un badge pour le type de recruteur
 */
export const getTypeRecruteurBadge = (type) => {
  const typeMap = {
    entreprise: {
      label: 'Entreprise',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: '🏢'
    },
    cabinet: {
      label: 'Cabinet RH',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: '👔'
    },
    independant: {
      label: 'Indépendant',
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: '👤'
    },
    autre: {
      label: 'Autre',
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: '📋'
    }
  };
  
  return typeMap[type] || typeMap.autre;
};

/**
 * 📊 Calcule le taux de réponse aux candidatures
 */
export const calculerTauxReponse = (candidaturesTotal, candidaturesRepondues) => {
  if (!candidaturesTotal || candidaturesTotal === 0) return 0;
  return Math.round((candidaturesRepondues / candidaturesTotal) * 100);
};

/**
 * 📊 Calcule le taux d'acceptation
 */
export const calculerTauxAcceptation = (candidaturesTotal, candidaturesAcceptees) => {
  if (!candidaturesTotal || candidaturesTotal === 0) return 0;
  return Math.round((candidaturesAcceptees / candidaturesTotal) * 100);
};

/**
 * 🔢 Formate un nombre avec séparateur de milliers
 */
export const formatNumber = (number) => {
  if (!number) return '0';
  return new Intl.NumberFormat('fr-FR').format(number);
};

/**
 * ✂️ Tronque un texte avec ellipse
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 🎨 Génère une couleur aléatoire pour les avatars
 */
export const getAvatarColor = (name) => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-teal-500 to-teal-600'
  ];
  
  if (!name) return colors[0];
  
  const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

/**
 * 📱 Formate un numéro de téléphone
 */
export const formatTelephone = (telephone) => {
  if (!telephone) return 'N/A';
  
  // Nettoyer le numéro
  const cleaned = telephone.replace(/\D/g, '');
  
  // Format: XX XX XXX XX
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{3})(\d{2})/, '$1 $2 $3 $4');
  }
  
  return telephone;
};

/**
 * 🌐 Valide et formate une URL de site web
 */
export const formatSiteWeb = (url) => {
  if (!url) return null;
  
  // Ajouter https:// si manquant
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  
  return url;
};

/**
 * 🔍 Filtre un tableau d'objets par recherche textuelle
 */
export const filterBySearch = (items, searchTerm, fields = []) => {
  if (!searchTerm || searchTerm.trim() === '') return items;
  
  const term = searchTerm.toLowerCase().trim();
  
  return items.filter(item => {
    return fields.some(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      return value?.toString().toLowerCase().includes(term);
    });
  });
};

/**
 * 📊 Calcule des statistiques à partir d'un tableau de candidatures
 */
export const calculerStatistiquesCandidatures = (candidatures) => {
  if (!candidatures || candidatures.length === 0) {
    return {
      total: 0,
      en_attente: 0,
      acceptees: 0,
      refusees: 0,
      taux_acceptation: 0,
      taux_reponse: 0
    };
  }
  
  const stats = {
    total: candidatures.length,
    en_attente: candidatures.filter(c => c.statut === 'en_attente').length,
    acceptees: candidatures.filter(c => c.statut === 'acceptee').length,
    refusees: candidatures.filter(c => c.statut === 'refusee').length
  };
  
  const repondues = stats.acceptees + stats.refusees;
  stats.taux_reponse = calculerTauxReponse(stats.total, repondues);
  stats.taux_acceptation = calculerTauxAcceptation(stats.total, stats.acceptees);
  
  return stats;
};

/**
 * 🎯 Valide les données d'un formulaire recruteur
 */
export const validerProfilRecruteur = (data) => {
  const errors = {};
  
  if (!data.nom_entreprise || data.nom_entreprise.trim() === '') {
    errors.nom_entreprise = "Le nom de l'entreprise est requis";
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Email invalide";
  }
  
  if (data.site_web && !/^https?:\/\/.+\..+/.test(formatSiteWeb(data.site_web))) {
    errors.site_web = "URL invalide";
  }
  
  if (data.telephone && !/^\d{10}$/.test(data.telephone.replace(/\D/g, ''))) {
    errors.telephone = "Numéro de téléphone invalide (10 chiffres requis)";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  getInitials,
  formatDate,
  formatDateLong,
  getTimeAgo,
  formatSalaire,
  getStatutOffreInfo,
  getStatutCandidatureInfo,
  getTailleEntrepriseBadge,
  getTypeRecruteurBadge,
  calculerTauxReponse,
  calculerTauxAcceptation,
  formatNumber,
  truncateText,
  getAvatarColor,
  formatTelephone,
  formatSiteWeb,
  filterBySearch,
  calculerStatistiquesCandidatures,
  validerProfilRecruteur
};