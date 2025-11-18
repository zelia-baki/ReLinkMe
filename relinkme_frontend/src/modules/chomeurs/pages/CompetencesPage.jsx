import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, Trash2, AlertCircle } from "lucide-react";
import {
  getChomeurCompetences,
  addCompetence,
  addCompetencesBulk,
  updateCompetence,
  deleteCompetence,
  deleteCompetencesBulk
} from "@/modules/chomeurs/api/competence.api";
import { getAllCompetences } from "@/modules/core/api/competence.api";
import CompetenceCard from "@/modules/chomeurs/components/CompetenceCard";
import CompetenceModal from "@/modules/chomeurs/components/CompetenceModal";
import CompetenceMultiSelectModal from "@/modules/chomeurs/components/CompetenceMultiSelectModal";
import ChomeurLayout from '@/modules/chomeurs/layouts/ChomeurLayout';


const MAX_COMPETENCES = 20;

export default function CompetencesPage() {
  const [competences, setCompetences] = useState([]);
  const [competencesList, setCompetencesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNiveau, setFilterNiveau] = useState("all");
  const [filterCategorie, setFilterCategorie] = useState("all");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);
  const [selectedCompetence, setSelectedCompetence] = useState(null);

  // Sélection multiple pour suppression
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [compData, compListData] = await Promise.all([
        getChomeurCompetences(),
        getAllCompetences()
      ]);
      setCompetences(compData);
      setCompetencesList(compListData);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ajout simple (une seule compétence)
  const handleAdd = async (formData) => {
    await addCompetence(formData);
    fetchData();
  };

  // Ajout en masse
  const handleAddBulk = async (competencesArray) => {
    try {
      await addCompetencesBulk(competencesArray);
      fetchData();
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (competence) => {
    setSelectedCompetence(competence);
    setIsModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    if (selectedCompetence) {
      await updateCompetence(selectedCompetence.id, formData);
      fetchData();
      setSelectedCompetence(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?")) {
      await deleteCompetence(id);
      fetchData();
    }
  };

  // Suppression multiple
  const handleDeleteSelected = async () => {
    if (selectedForDelete.length === 0) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedForDelete.length} compétence(s) ?`)) {
      try {
        await deleteCompetencesBulk(selectedForDelete);
        setSelectedForDelete([]);
        setIsDeleteMode(false);
        fetchData();
      } catch (error) {
        console.error("Erreur suppression:", error);
      }
    }
  };

  const toggleSelectForDelete = (id) => {
    setSelectedForDelete(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompetence(null);
  };

  // Extraire les IDs déjà sélectionnés
  const alreadySelectedIds = competences.map(c => c.competence);

  // Catégories disponibles
  const categories = ['all', ...new Set(competences.map(c => c.competence?.categorie).filter(Boolean))];

  // Filtrage
  const filteredCompetences = competences.filter(comp => {
    const matchSearch = (comp.competence_nom || comp.competence?.libelle || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchNiveau = filterNiveau === "all" || comp.niveau_maitrise === filterNiveau;
    const matchCategorie = filterCategorie === "all" || comp.competence?.categorie === filterCategorie;
    return matchSearch && matchNiveau && matchCategorie;
  });

  // Stats
  const stats = {
    total: competences.length,
    expert: competences.filter(c => c.niveau_maitrise === 'expert').length,
    avancé: competences.filter(c => c.niveau_maitrise === 'avancé').length,
    intermédiaire: competences.filter(c => c.niveau_maitrise === 'intermédiaire').length,
  };

  const remainingSlots = MAX_COMPETENCES - competences.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des compétences...</p>
        </div>
      </div>
    );
  }

  return (
    <ChomeurLayout>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes compétences</h1>
                <p className="text-gray-600">
                  {competences.length}/{MAX_COMPETENCES} compétences • {remainingSlots} place(s) restante(s)
                </p>
              </div>
              <div className="flex gap-2">
                {isDeleteMode ? (
                  <>
                    <button
                      onClick={() => {
                        setIsDeleteMode(false);
                        setSelectedForDelete([]);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      disabled={selectedForDelete.length === 0}
                      className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${selectedForDelete.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer ({selectedForDelete.length})
                    </button>
                  </>
                ) : (
                  <>
                    {competences.length > 0 && (
                      <button
                        onClick={() => setIsDeleteMode(true)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Gérer
                      </button>
                    )}
                    <button
                      onClick={() => setIsMultiSelectOpen(true)}
                      disabled={remainingSlots === 0}
                      className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-sm ${remainingSlots === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      <Plus className="w-5 h-5" />
                      Ajouter des compétences
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Alerte limite */}
          {competences.length >= MAX_COMPETENCES && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Limite atteinte</p>
                <p className="text-sm text-red-700">
                  Vous avez atteint la limite de {MAX_COMPETENCES} compétences.
                  Supprimez-en pour en ajouter de nouvelles.
                </p>
              </div>
            </div>
          )}

          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}/{MAX_COMPETENCES}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Expert</p>
              <p className="text-2xl font-bold text-green-600">{stats.expert}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Avancé</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avancé}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Intermédiaire</p>
              <p className="text-2xl font-bold text-blue-600">{stats.intermédiaire}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une compétence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterCategorie}
                  onChange={(e) => setFilterCategorie(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Toutes catégories</option>
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={filterNiveau}
                  onChange={(e) => setFilterNiveau(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les niveaux</option>
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des compétences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {filteredCompetences.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">Aucune compétence trouvée</p>
                {competences.length === 0 && (
                  <button
                    onClick={() => setIsMultiSelectOpen(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ajouter vos premières compétences
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCompetences.map((comp) => (
                  <div key={comp.id} className="relative">
                    {isDeleteMode && (
                      <div className="absolute top-2 left-2 z-10">
                        <input
                          type="checkbox"
                          checked={selectedForDelete.includes(comp.id)}
                          onChange={() => toggleSelectForDelete(comp.id)}
                          className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                        />
                      </div>
                    )}
                    <CompetenceCard
                      competence={comp}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      showActions={!isDeleteMode}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal simple (modification) */}
          <CompetenceModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={selectedCompetence ? handleUpdate : handleAdd}
            competence={selectedCompetence}
            competencesList={competencesList}
          />

          {/* Modal sélection multiple */}
          <CompetenceMultiSelectModal
            isOpen={isMultiSelectOpen}
            onClose={() => setIsMultiSelectOpen(false)}
            onSubmit={handleAddBulk}
            competencesList={competencesList}
            currentCompetencesCount={competences.length}
            alreadySelectedIds={alreadySelectedIds}
          />
        </div>
      </div>
    </ChomeurLayout>
  );
}