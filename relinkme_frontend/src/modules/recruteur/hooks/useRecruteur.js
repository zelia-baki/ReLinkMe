// modules/recruteur/hooks/useRecruteur.js
// Hook personnalisé pour vérifier si l'utilisateur est un recruteur
import { useState, useEffect } from 'react';
import { getRecruteurProfile } from '../api/recruteur.api';

export const useRecruteur = () => {
  const [isRecruteur, setIsRecruteur] = useState(false);
  const [recruteur, setRecruteur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkRecruteur();
  }, []);

  const checkRecruteur = async () => {
    try {
      setLoading(true);
      const data = await getRecruteurProfile();
      setIsRecruteur(true);
      setRecruteur(data);
      setError(null);
    } catch (err) {
      setIsRecruteur(false);
      setRecruteur(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { isRecruteur, recruteur, loading, error, refetch: checkRecruteur };
};

export default useRecruteur;