import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilChomeurPage from "@/modules/chomeurs/pages/ProfilChomeurPage";
import CompetencesPage from "@/modules/chomeurs/pages/CompetencesPage";
import ExploitsPage from "@/modules/chomeurs/pages/ExploitsPage";
import InscriptionChomeur from "@/modules/chomeurs/pages/InscriptionChomeur";
import ConnexionPage from "./modules/core/pages/ConnexionCore";
import Admin from "./modules/admin/pages/Admin";
import Demande from "./modules/admin/pages/Demande";
import DemandeConsulter from "./modules/admin/pages/DemandeConsulter";
import DemandeLocalisation from "./modules/admin/pages/DemandeLoc";
import DetailLoc from "./modules/admin/pages/DetailLoc";
import InscriptionRecruteur from "./modules/recruteur/pages/InscriptionRecruteur";
import ListeRecruteurs from "./modules/recruteur/pages/ListeRecruteur";
import ProfilRecruteur from "./modules/recruteur/pages/ProfilRecruteur";
import PublierOffre from "./modules/Offres/pages/PublierOffre";
import MesOffres from "./modules/Offres/pages/MesOffres";
import ListeOffres from "./modules/Offres/pages/ListeOffres";
import DetailOffre from "./modules/Offres/pages/DetailOffre";
import RecruteurRoute from "./components/routes/RecruteurRoute";
import PostulerOffre from '@/modules/candidatures/pages/PostulerOffre';
import MesCandidatures from '@/modules/candidatures/pages/MesCandidatures';
import CandidaturesRecues from '@/modules/candidatures/pages/CandidaturesRecues';
import DetailCandidature from '@/modules/candidatures/pages/DetailCandidature';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes Chômeur */}
        <Route path="/chomeur/profil" element={<ProfilChomeurPage />} />
        <Route path="/chomeur/competences" element={<CompetencesPage />} />
        <Route path="/chomeur/exploits" element={<ExploitsPage />} />
        <Route path="/chomeur/inscriptions" element={<InscriptionChomeur />} />
        <Route path="/chomeur/candidatures" element={<MesCandidatures />} />
        <Route path="/chomeur/candidatures/:id" element={<DetailCandidature />} />

        {/* Routes Authentification */}
        <Route path="/connexion" element={<ConnexionPage />} />

        {/* Routes Admin */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/demande" element={<Demande />} />
        <Route path="/admin/demande/:id/:idUtilisateur" element={<DemandeConsulter />} />
        <Route path="/admin/localisation" element={<DemandeLocalisation />} />
        <Route path="/admin/localisation/:id/:idUtilisateur" element={<DetailLoc />} />

        {/* Routes Recruteur */}
        <Route path="/recruteur/inscription" element={<InscriptionRecruteur />} />
        <Route path="/recruteur/mesoffres" element={<MesOffres />} />
        <Route path="/recruteur/liste" element={<ListeRecruteurs />} />
        <Route path="/recruteur/profil" element={<ProfilRecruteur />} />
        <Route path="/recruteur/candidatures" element={<CandidaturesRecues />} />
        <Route path="/recruteur/candidatures/:id" element={<DetailCandidature />} />

        {/* Routes Offres */}
        <Route path="/offres" element={<ListeOffres />} />
        <Route path="/offres/:id" element={<DetailOffre />} />
        <Route path="/offres/publier" element={<PublierOffre />} />
        <Route path="/candidatures/:offreId" element={<PostulerOffre />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;