import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilChomeurPage from "@/modules/chomeurs/pages/ProfilChomeurPage";
import CompetencesPage from "@/modules/chomeurs/pages/CompetencesPage";
import ExploitsPage from "@/modules/chomeurs/pages/ExploitsPage";
import InscriptionChomeur from "@/modules/chomeurs/pages/InscriptionChomeur";
import ConnexionPage from "./modules/core/pages/ConnexionCore";
import Admin from "./modules/admin/pages/Admin";
import Demande from "./modules/admin/pages/Demande";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chomeur/profil" element={<ProfilChomeurPage />} />
        <Route path="/chomeur/competences" element={<CompetencesPage />} />
        <Route path="/chomeur/exploits" element={<ExploitsPage />} />
        <Route path="/chomeur/inscriptions" element={<InscriptionChomeur />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route path="/admin" element={<Admin/>}/>
        <Route path="admin/demande" element={<Demande/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
