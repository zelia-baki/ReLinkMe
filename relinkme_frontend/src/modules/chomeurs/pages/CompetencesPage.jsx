import React, { useEffect, useState } from "react";
import { getChomeurCompetences, addCompetence, deleteCompetence } from "@/modules/chomeurs/api/competence.api";

export default function CompetencesPage() {
  const [competences, setCompetences] = useState([]);
  const [newCompetence, setNewCompetence] = useState("");

  useEffect(() => {
    fetchCompetences();
  }, []);

  const fetchCompetences = async () => {
    const data = await getChomeurCompetences();
    setCompetences(data);
  };

  const handleAdd = async () => {
    if (!newCompetence) return;
    await addCompetence({ competence: newCompetence, niveau_maitrise: "intermédiaire" });
    setNewCompetence("");
    fetchCompetences();
  };

  const handleDelete = async (id) => {
    await deleteCompetence(id);
    fetchCompetences();
  };

  return (
    <div className="p-4">
      <h2>Mes compétences</h2>
      <input
        type="text"
        value={newCompetence}
        onChange={(e) => setNewCompetence(e.target.value)}
        placeholder="Nouvelle compétence"
      />
      <button onClick={handleAdd}>➕ Ajouter</button>

      <ul>
        {competences.map((c) => (
          <li key={c.id}>
            {c.competence_nom} ({c.niveau_maitrise})
            <button onClick={() => handleDelete(c.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
