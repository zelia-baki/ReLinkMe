import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilChomeurPage from "@/modules/chomeurs/pages/ProfilChomeurPage";
import CompetencesPage from "@/modules/chomeurs/pages/CompetencesPage";
import ExploitsPage from "@/modules/chomeurs/pages/ExploitsPage";
import InscriptionChomeur from "@/modules/chomeurs/pages/InscriptionChomeur";
import ConnexionPage from "./modules/core/pages/ConnexionCore";
import InscriptionRecruteur from "./modules/recruteur/pages/InscriptionRecruteur";
import PublierOffre from "./modules/Offres/pages/PublierOffre";
import MesOffres from "./modules/Offres/pages/MesOffres";
import ListeOffres from "./modules/Offres/pages/ListeOffres";
import DetailOffre from "./modules/Offres/pages/DetailOffre";
import ListeRecruteurs from "./modules/recruteur/pages/ListeRecruteur";
import ProfilRecruteur from "./modules/recruteur/pages/ProfilRecruteur";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chomeur/profil" element={<ProfilChomeurPage />} />
        <Route path="/chomeur/competences" element={<CompetencesPage />} />
        <Route path="/chomeur/exploits" element={<ExploitsPage />} />
        <Route path="/chomeur/inscriptions" element={<InscriptionChomeur />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route path="/recruteur/inscription" element={<InscriptionRecruteur />} />
        <Route path="/recruteur/mesoffres" element={<MesOffres />} />  
        <Route path="/offres" element={<ListeOffres />} />
        <Route path="/offres/:id" element={<DetailOffre />} />
        <Route path="/offres/publier" element={<PublierOffre />} />
        <Route path="/recruteur/liste" element={<ListeRecruteurs />} />
        <Route path="/recruteur/profil" element={<ProfilRecruteur />} />




      </Routes>
    </BrowserRouter>
  );
}

export default App;
