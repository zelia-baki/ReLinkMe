import React, { useEffect, useState } from "react";
import { getAllChomeurs, updateChomeur } from "@/modules/chomeurs/api/chomeur.api";

export default function ProfilChomeurPage() {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfil() {
      try {
        const data = await getAllChomeurs();
        if (data.length > 0) setProfil(data[0]); // 👈 premier chômeur pour test
      } catch (error) {
        console.error("Erreur chargement profil", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfil();
  }, []);

  const handleChange = (e) => {
    setProfil({ ...profil, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateChomeur(profil.id, {
        profession: profil.profession,
        description: profil.description,
        niveau_expertise: profil.niveau_expertise,
      });
      alert("Profil mis à jour !");
    } catch (error) {
      console.error("Erreur maj", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!profil) return <p>Aucun profil trouvé.</p>;

  return (
    <div className="p-4">
      <h2>Profil de {profil.utilisateur_nom}</h2>

      <label>
        Profession :
        <input
          name="profession"
          value={profil.profession || ""}
          onChange={handleChange}
          className="border p-1 ml-2"
        />
      </label>

      <br />

      <label>
        Description :
        <textarea
          name="description"
          value={profil.description || ""}
          onChange={handleChange}
          className="border p-1 ml-2 w-80 h-20"
        />
      </label>

      <br />

      <label>
        Niveau d’expertise :
        <select
          name="niveau_expertise"
          value={profil.niveau_expertise || ""}
          onChange={handleChange}
          className="border p-1 ml-2"
        >
          <option value="débutant">Débutant</option>
          <option value="intermédiaire">Intermédiaire</option>
          <option value="expert">Expert</option>
        </select>
      </label>

      <br />

      <p>💰 Jetons : {profil.solde_jetons}</p>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
      >
        💾 Enregistrer
      </button>
    </div>
  );
}
