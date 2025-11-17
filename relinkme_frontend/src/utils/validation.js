// utils/validation.js

/**
 * Valide le format d'un email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un mot de passe (minimum 8 caractères)
 */
export const isValidPassword = (password) => {
  return password && password.length >= 8;
};

/**
 * Vérifie que deux mots de passe correspondent
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Gère les erreurs d'API et met à jour l'état des erreurs
 */
export const handleApiError = (error, setErrors) => {
  console.error('❌ Erreur API:', error);

  if (error.response) {
    // Erreur de réponse du serveur
    const { data, status } = error.response;

    if (status === 400 && data.errors) {
      // Erreurs de validation
      setErrors(data.errors);
    } else if (status === 500) {
      setErrors({
        general: 'Erreur serveur. Veuillez réessayer plus tard.'
      });
    } else {
      setErrors({
        general: data.message || 'Une erreur est survenue'
      });
    }
  } else if (error.request) {
    // Pas de réponse du serveur
    setErrors({
      general: 'Impossible de contacter le serveur. Vérifiez votre connexion.'
    });
  } else {
    // Autre erreur
    setErrors({
      general: error.message || 'Une erreur inattendue est survenue'
    });
  }
};