// modules/recruteurs/utils/constants.jsx

/**
 * 🎨 Constantes pour le module Recruteur
 * Types, statuts, couleurs, labels standardisés
 */

// 📊 Statuts des offres
export const STATUT_OFFRE = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  FERMEE: 'closed'
};

export const STATUT_OFFRE_CONFIG = {
  [STATUT_OFFRE.ACTIVE]: {
    label: 'Active',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '✓',
    description: 'Offre visible et ouverte aux candidatures'
  },
  [STATUT_OFFRE.INACTIVE]: {
    label: 'Inactive',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏸',
    description: 'Offre temporairement suspendue'
  },
  [STATUT_OFFRE.FERMEE]: {
    label: 'Fermée',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '✕',
    description: 'Offre terminée ou expirée'
  }
};

// 💼 Types de contrat
export const TYPE_CONTRAT = {
  CDI: 'CDI',
  CDD: 'CDD',
  STAGE: 'Stage',
  ALTERNANCE: 'Alternance',
  FREELANCE: 'Freelance',
  TEMPS_PARTIEL: 'Temps partiel'
};

export const TYPES_CONTRAT_OPTIONS = [
  { value: TYPE_CONTRAT.CDI, label: 'CDI - Contrat à Durée Indéterminée', icon: '📄' },
  { value: TYPE_CONTRAT.CDD, label: 'CDD - Contrat à Durée Déterminée', icon: '📋' },
  { value: TYPE_CONTRAT.STAGE, label: 'Stage', icon: '🎓' },
  { value: TYPE_CONTRAT.ALTERNANCE, label: 'Alternance', icon: '🔄' },
  { value: TYPE_CONTRAT.FREELANCE, label: 'Freelance', icon: '💼' },
  { value: TYPE_CONTRAT.TEMPS_PARTIEL, label: 'Temps partiel', icon: '⏰' }
];

// 🏢 Types de recruteur
export const TYPE_RECRUTEUR = {
  ENTREPRISE: 'entreprise',
  INDIVIDUEL: 'individuel'
};

export const TYPE_RECRUTEUR_CONFIG = {
  [TYPE_RECRUTEUR.ENTREPRISE]: {
    label: 'Entreprise',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: '🏢'
  },
  [TYPE_RECRUTEUR.INDIVIDUEL]: {
    label: 'Individuel',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: '👤'
  }
};

// 🎯 Niveaux de compétences
export const NIVEAU_COMPETENCE = {
  DEBUTANT: 'débutant',
  INTERMEDIAIRE: 'intermédiaire',
  EXPERT: 'expert'
};

export const NIVEAUX_COMPETENCE_OPTIONS = [
  { 
    value: NIVEAU_COMPETENCE.DEBUTANT, 
    label: 'Débutant', 
    color: 'bg-blue-100 text-blue-700',
    description: '1-2 ans d\'expérience'
  },
  { 
    value: NIVEAU_COMPETENCE.INTERMEDIAIRE, 
    label: 'Intermédiaire', 
    color: 'bg-yellow-100 text-yellow-700',
    description: '3-5 ans d\'expérience'
  },
  { 
    value: NIVEAU_COMPETENCE.EXPERT, 
    label: 'Expert', 
    color: 'bg-red-100 text-red-700',
    description: '5+ ans d\'expérience'
  }
];

// 👥 Tailles d'entreprise
export const TAILLE_ENTREPRISE = [
  { min: 0, max: 10, label: 'Très petite', badge: '1-10', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { min: 11, max: 50, label: 'Petite', badge: '11-50', color: 'bg-green-100 text-green-700 border-green-200' },
  { min: 51, max: 200, label: 'Moyenne', badge: '51-200', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { min: 201, max: 1000, label: 'Grande', badge: '201-1000', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { min: 1001, max: Infinity, label: 'Très grande', badge: '1000+', color: 'bg-red-100 text-red-700 border-red-200' }
];

// 📍 Secteurs d'activité populaires (Madagascar)
export const SECTEURS_ACTIVITE = [
  'Technologie & IT',
  'Agriculture & Agroalimentaire',
  'Tourisme & Hôtellerie',
  'Commerce & Distribution',
  'Industrie & Manufacture',
  'BTP & Construction',
  'Finance & Banque',
  'Éducation & Formation',
  'Santé & Médical',
  'Transport & Logistique',
  'Télécommunications',
  'Textile & Confection',
  'Énergie & Mines',
  'Services aux entreprises',
  'ONG & Associations',
  'Autre'
];

// 🎨 Couleurs pour avatars
export const AVATAR_COLORS = [
  'from-purple-500 to-blue-600',
  'from-blue-500 to-cyan-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-purple-600',
  'from-indigo-500 to-purple-600',
  'from-yellow-500 to-orange-600',
  'from-teal-500 to-green-600'
];

// 📊 Configuration des statistiques
export const STAT_CARDS_CONFIG = {
  offres_total: {
    label: 'Total offres',
    icon: 'Briefcase',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600'
  },
  offres_actives: {
    label: 'Offres actives',
    icon: 'CheckCircle',
    color: 'green',
    gradient: 'from-green-500 to-green-600'
  },
  offres_inactives: {
    label: 'Offres inactives',
    icon: 'Clock',
    color: 'yellow',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  offres_fermees: {
    label: 'Offres fermées',
    icon: 'XCircle',
    color: 'red',
    gradient: 'from-red-500 to-red-600'
  },
  candidatures_total: {
    label: 'Candidatures',
    icon: 'Users',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600'
  },
  candidatures_nouvelles: {
    label: 'Nouvelles',
    icon: 'Bell',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600'
  }
};

// 🔔 Messages de validation
export const MESSAGES = {
  OFFRE_CREEE: 'Offre créée avec succès !',
  OFFRE_MODIFIEE: 'Offre modifiée avec succès !',
  OFFRE_SUPPRIMEE: 'Offre supprimée avec succès !',
  ERREUR_CHARGEMENT: 'Impossible de charger les données',
  ERREUR_SAUVEGARDE: 'Erreur lors de la sauvegarde',
  CONFIRMATION_SUPPRESSION: 'Êtes-vous sûr de vouloir supprimer cette offre ?',
  AUCUNE_OFFRE: 'Aucune offre publiée',
  TITRE_REQUIS: 'Le titre est requis',
  DESCRIPTION_TROP_COURTE: 'La description doit contenir au moins 50 caractères',
  DATE_INVALIDE: 'La date limite ne peut pas être dans le passé'
};

// 🎯 Limites et validations
export const VALIDATION = {
  TITRE_MIN_LENGTH: 5,
  TITRE_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 5000,
  SALAIRE_MIN: 0,
  SALAIRE_MAX: 100000000, // 100M Ar
  NOM_ENTREPRISE_MIN_LENGTH: 2,
  NOM_ENTREPRISE_MAX_LENGTH: 200
};

// 📱 Breakpoints responsive
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// 🔄 États de chargement
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// 📄 Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// 🎨 Classes Tailwind réutilisables
export const STYLES = {
  card: 'bg-white rounded-xl shadow-sm border border-gray-200 p-6',
  cardHover: 'bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow',
  button: {
    primary: 'px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium',
    secondary: 'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium',
    danger: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium',
    success: 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium'
  },
  badge: {
    success: 'px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200',
    warning: 'px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200',
    danger: 'px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium border border-red-200',
    info: 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200'
  },
  input: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent',
  inputError: 'w-full px-4 py-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
};

// 🌍 Localisations Madagascar
export const LOCALISATIONS_MADAGASCAR = [
  'Antananarivo',
  'Antsirabe',
  'Fianarantsoa',
  'Toamasina',
  'Mahajanga',
  'Toliara',
  'Antsiranana',
  'Morondava',
  'Nosy Be',
  'Fort Dauphin',
  'Autre'
];

export default {
  STATUT_OFFRE,
  STATUT_OFFRE_CONFIG,
  TYPE_CONTRAT,
  TYPES_CONTRAT_OPTIONS,
  TYPE_RECRUTEUR,
  TYPE_RECRUTEUR_CONFIG,
  NIVEAU_COMPETENCE,
  NIVEAUX_COMPETENCE_OPTIONS,
  TAILLE_ENTREPRISE,
  SECTEURS_ACTIVITE,
  AVATAR_COLORS,
  STAT_CARDS_CONFIG,
  MESSAGES,
  VALIDATION,
  LOADING_STATES,
  PAGINATION,
  STYLES,
  LOCALISATIONS_MADAGASCAR
};