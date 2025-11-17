// modules/recruteurs/pages/ListeRecruteurs.jsx
import React, { useState, useEffect } from 'react';
import { getAllRecruteurs, deleteRecruteur } from '../api/recruteur.api';
import { 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Globe,
  MapPin,
  Users,
  Calendar,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

export default function ListeRecruteurs() {
  const [recruteurs, setRecruteurs] = useState([]);
  const [filteredRecruteurs, setFilteredRecruteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRecruteur, setSelectedRecruteur] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // 📥 Chargement des recruteurs
  useEffect(() => {
    loadRecruteurs();
  }, []);

  const loadRecruteurs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllRecruteurs();
      setRecruteurs(data);
      setFilteredRecruteurs(data);
    } catch (err) {
      console.error('Erreur chargement recruteurs:', err);
      setError('Impossible de charger la liste des recruteurs');
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filtrage et recherche
  useEffect(() => {
    let filtered = recruteurs;

    // Filtre par type
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type_recruteur === filterType);
    }

    // Recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.nom_entreprise?.toLowerCase().includes(term) ||
        r.utilisateur_email?.toLowerCase().includes(term) ||
        r.secteur_activite?.toLowerCase().includes(term) ||
        r.code_recruteur?.toLowerCase().includes(term)
      );
    }

    setFilteredRecruteurs(filtered);
  }, [searchTerm, filterType, recruteurs]);

  // 🗑️ Suppression
  const handleDelete = async (id) => {
    try {
      await deleteRecruteur(id);
      await loadRecruteurs();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  // 📊 Statistiques
  const stats = {
    total: recruteurs.length,
    entreprises: recruteurs.filter(r => r.type_recruteur === 'entreprise').length,
    individuels: recruteurs.filter(r => r.type_recruteur === 'individuel').length,
  };

  // 🎨 Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des recruteurs...</p>
        </div>
      </div>
    );
  }

  // ❌ Écran d'erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadRecruteurs}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gestion des Recruteurs
          </h1>
          <p className="text-gray-600">
            {filteredRecruteurs.length} recruteur{filteredRecruteurs.length > 1 ? 's' : ''} trouvé{filteredRecruteurs.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <Building2 className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Entreprises</p>
                <p className="text-3xl font-bold text-gray-800">{stats.entreprises}</p>
              </div>
              <Building2 className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Individuels</p>
                <p className="text-3xl font-bold text-gray-800">{stats.individuels}</p>
              </div>
              <Users className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, secteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filtre par type */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">Tous les types</option>
                <option value="entreprise">Entreprises</option>
                <option value="individuel">Individuels</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des recruteurs */}
        {filteredRecruteurs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucun recruteur trouvé
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Aucun recruteur enregistré pour le moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRecruteurs.map((recruteur) => (
              <div
                key={recruteur.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                {/* En-tête de la carte */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        recruteur.type_recruteur === 'entreprise' 
                          ? 'bg-purple-100' 
                          : 'bg-green-100'
                      }`}>
                        {recruteur.type_recruteur === 'entreprise' ? (
                          <Building2 className="w-6 h-6 text-purple-600" />
                        ) : (
                          <Users className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {recruteur.nom_entreprise || 'Sans nom'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {recruteur.code_recruteur}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      recruteur.type_recruteur === 'entreprise'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {recruteur.type_recruteur === 'entreprise' ? 'Entreprise' : 'Individuel'}
                    </span>
                  </div>

                  {/* Informations principales */}
                  <div className="space-y-2">
                    {recruteur.utilisateur_email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{recruteur.utilisateur_email}</span>
                      </div>
                    )}
                    {recruteur.secteur_activite && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span>{recruteur.secteur_activite}</span>
                      </div>
                    )}
                    {recruteur.nombre_employes && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{recruteur.nombre_employes} employés</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {new Date(recruteur.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedRecruteur(recruteur);
                        setShowModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Voir les détails"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => window.location.href = `/recruteurs/modifier/${recruteur.id}`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(recruteur)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal détails */}
      {showModal && selectedRecruteur && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête modal */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Détails du recruteur
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenu modal */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Informations générales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Code</p>
                    <p className="font-semibold">{selectedRecruteur.code_recruteur}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Type</p>
                    <p className="font-semibold capitalize">{selectedRecruteur.type_recruteur}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nom</p>
                    <p className="font-semibold">{selectedRecruteur.nom_entreprise || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold">{selectedRecruteur.utilisateur_email || '-'}</p>
                  </div>
                </div>
              </div>

              {selectedRecruteur.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600">{selectedRecruteur.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Informations complémentaires
                </h3>
                <div className="space-y-3">
                  {selectedRecruteur.secteur_activite && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Secteur d'activité</p>
                        <p className="font-semibold">{selectedRecruteur.secteur_activite}</p>
                      </div>
                    </div>
                  )}
                  {selectedRecruteur.site_web && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Site web</p>
                        <a 
                          href={selectedRecruteur.site_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-purple-600 hover:underline"
                        >
                          {selectedRecruteur.site_web}
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedRecruteur.nombre_employes && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Nombre d'employés</p>
                        <p className="font-semibold">{selectedRecruteur.nombre_employes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir supprimer <strong>{deleteConfirm.nom_entreprise}</strong> ?
                Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}