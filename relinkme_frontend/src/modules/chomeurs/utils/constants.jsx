// modules/chomeurs/utils/constants.jsx

/**
 * 🎨 Constantes de design pour l'uniformisation de l'interface
 */

// Couleurs principales
export const COLORS = {
  primary: 'blue',
  secondary: 'purple',
  success: 'green',
  warning: 'yellow',
  danger: 'red',
  info: 'blue',
  gray: 'gray'
};

// Styles des badges selon le niveau/statut
export const BADGE_STYLES = {
  // Niveaux de compétence
  débutant: 'bg-gray-100 text-gray-800 border-gray-300',
  intermédiaire: 'bg-blue-100 text-blue-800 border-blue-300',
  avancé: 'bg-purple-100 text-purple-800 border-purple-300',
  expert: 'bg-green-100 text-green-800 border-green-300',
  
  // Statuts de candidature
  en_attente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  vue: 'bg-blue-100 text-blue-800 border-blue-300',
  acceptee: 'bg-green-100 text-green-800 border-green-300',
  refusee: 'bg-red-100 text-red-800 border-red-300',
  entretien: 'bg-purple-100 text-purple-800 border-purple-300',
  
  // États généraux
  actif: 'bg-green-100 text-green-800 border-green-300',
  inactif: 'bg-gray-100 text-gray-800 border-gray-300',
  visible: 'bg-green-100 text-green-700 border-green-300',
  masque: 'bg-gray-100 text-gray-700 border-gray-300',
  
  // Par défaut
  default: 'bg-gray-100 text-gray-700 border-gray-200'
};

// Variants des boutons
export const BUTTON_VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
  secondary: 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400',
  success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-gray-400',
  outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50',
  ghost: 'text-gray-700 hover:bg-gray-100 disabled:opacity-50',
  link: 'text-blue-600 hover:text-blue-700 underline disabled:opacity-50'
};

// Tailles des boutons
export const BUTTON_SIZES = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
};

// Limites
export const LIMITS = {
  MAX_COMPETENCES: 20,
  MAX_EXPLOITS: 50,
  MIN_LETTRE_MOTIVATION: 100
};

// Libellés des niveaux
export const NIVEAU_LABELS = {
  débutant: 'Débutant',
  intermédiaire: 'Intermédiaire',
  avancé: 'Avancé',
  expert: 'Expert'
};

// Libellés des statuts
export const STATUT_LABELS = {
  en_attente: 'En attente',
  vue: 'Vue',
  acceptee: 'Acceptée',
  refusee: 'Refusée',
  entretien: 'Entretien'
};