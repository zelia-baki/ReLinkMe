import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilChomeurPage from "@/modules/chomeurs/pages/ProfilChomeurPage";
import CompetencesPage from "@/modules/chomeurs/pages/CompetencesPage";
import ExploitsPage from "@/modules/chomeurs/pages/ExploitsPage";
import InscriptionChomeur from "@/modules/chomeurs/pages/InscriptionChomeur";
import ConnexionPage from "./modules/core/pages/ConnexionCore";
import Admin from "./modules/admin/pages/Admin";
import Demande from "./modules/admin/pages/Demande";
import InscriptionRecruteur from "./modules/recruteur/pages/InscriptionRecruteur";
import PublierOffre from "./modules/Offres/pages/PublierOffre";
import MesOffres from "./modules/Offres/pages/MesOffres";
import ListeOffres from "./modules/Offres/pages/ListeOffres";
import DetailOffre from "./modules/Offres/pages/DetailOffre";
import RecruteurRoute from "./components/routes/RecruteurRoute";
import PostulerOffre from '@/modules/candidatures/pages/PostulerOffre';
import MesCandidatures from '@/modules/candidatures/pages/MesCandidatures';
import CandidaturesRecues from '@/modules/candidatures/pages/CandidaturesRecues';
import DetailCandidature from '@/modules/candidatures/pages/DetailCandidature';
import DemandeConsulter from "./modules/admin/pages/DemandeConsulter";
import DemandeLocalisation from "./modules/admin/pages/DemandeLoc";
import DetailLoc from "./modules/admin/pages/DetailLoc";
import Signalement from "./modules/admin/pages/Signalement";
import DetailSignal from "./modules/admin/pages/DetailSignalement";

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
        <Route path="admin/demande/:id/:idUtilisateur" element={<DemandeConsulter/>}/>
        <Route path="admin/localisation" element={<DemandeLocalisation/>}/>
        <Route path="admin/localisation/:id/:idUtilisateur" element={<DetailLoc/>}/>
        <Route path="admin/signalement" element={<Signalement/>}/>
        <Route path="admin/signalement/:id/:idUtilisateur" element={<DetailSignal/>}/>
        <Route path="/recruteur/inscription" element={<InscriptionRecruteur />} />
        <Route path="/recruteur/mesoffres" element={<MesOffres />} />
        <Route path="/offres" element={<ListeOffres />} />
        <Route path="/offres/:id" element={<DetailOffre />} />
        {/* <Route path="/offres/publier" element={<RecruteurRoute><PublierOffre /></RecruteurRoute>} /> */}
        <Route path="/offres/publier" element={<PublierOffre />} />
        <Route path="/recruteur/mes-offres" element={<MesOffres />} />

        <Route path="/candidatures/:offreId" element={<PostulerOffre />} />
        <Route path="/chomeur/candidatures" element={<MesCandidatures />} />
        <Route path="/chomeur/candidatures/:id" element={<DetailCandidature />} />

// Routes Recruteur
        <Route path="/recruteur/candidatures" element={<CandidaturesRecues />} />
        <Route path="/recruteur/candidatures/:id" element={<DetailCandidature />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
