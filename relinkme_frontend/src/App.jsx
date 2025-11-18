// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==================== CHOMEUR ====================
import ProfilChomeurPage from "@/modules/chomeurs/pages/ProfilChomeurPage";
import CompetencesPage from "@/modules/chomeurs/pages/CompetencesPage";
import ExploitsPage from "@/modules/chomeurs/pages/ExploitsPage";
import InscriptionChomeur from "@/modules/chomeurs/pages/InscriptionChomeur";

// ==================== CORE (Auth) ====================
import ConnexionPage from "./modules/core/pages/ConnexionCore";

// ==================== ADMIN ====================
import Admin from "./modules/admin/pages/Admin";
import Demande from "./modules/admin/pages/Demande";
import DemandeConsulter from "./modules/admin/pages/DemandeConsulter";
import DemandeLocalisation from "./modules/admin/pages/DemandeLoc";
import DetailLoc from "./modules/admin/pages/DetailLoc";
import Signalement from "./modules/admin/pages/Signalement";
import DetailSignal from "./modules/admin/pages/DetailSignalement";
import Historique from "./modules/admin/pages/Historique";
import Menu from "./modules/admin/components/Menu";
import { AuthProvider } from "./modules/admin/context/AuthContext";

// ==================== RECRUTEUR ====================
import InscriptionRecruteur from "./modules/recruteur/pages/InscriptionRecruteur";
import ListeRecruteurs from "./modules/recruteur/pages/ListeRecruteur";
import ProfilRecruteur from "./modules/recruteur/pages/ProfilRecruteur";

// ==================== OFFRES ====================
import PublierOffre from "./modules/Offres/pages/PublierOffre";
import MesOffres from "./modules/Offres/pages/MesOffres";
import ListeOffres from "./modules/Offres/pages/ListeOffres";
import DetailOffre from "./modules/Offres/pages/DetailOffre";

// ==================== CANDIDATURES ====================
import PostulerOffre from '@/modules/candidatures/pages/PostulerOffre';
import MesCandidatures from '@/modules/candidatures/pages/MesCandidatures';
import CandidaturesRecues from '@/modules/candidatures/pages/CandidaturesRecues';
import DetailCandidature from '@/modules/candidatures/pages/DetailCandidature';

// ==================== ROUTES PROTÉGÉES ====================
import RecruteurRoute from "./components/routes/RecruteurRoute";

function App() {
  const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN_VALIDATION: 'admin_validation',
    ADMIN_MODERATION: 'admin_moderation'
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ==================== AUTHENTIFICATION ==================== */}
          <Route path="/connexion" element={<ConnexionPage />} />

          {/* ==================== CHÔMEUR ==================== */}
          <Route path="/chomeur/profil" element={<ProfilChomeurPage />} />
          <Route path="/chomeur/competences" element={<CompetencesPage />} />
          <Route path="/chomeur/exploits" element={<ExploitsPage />} />
          <Route path="/chomeur/inscriptions" element={<InscriptionChomeur />} />
          <Route path="/chomeur/candidatures" element={<MesCandidatures />} />
          <Route path="/chomeur/candidatures/:id" element={<DetailCandidature />} />

          {/* ==================== RECRUTEUR ==================== */}
          <Route path="/recruteur/inscription" element={<InscriptionRecruteur />} />
          <Route path="/recruteur/profil" element={<ProfilRecruteur />} />
          <Route path="/recruteur/liste" element={<ListeRecruteurs />} />
          
          {/* Routes offres du recruteur */}
          <Route path="/recruteur/offres" element={<MesOffres />} />
          <Route path="/recruteur/offres/nouvelle" element={<PublierOffre />} />
          <Route path="/recruteur/offres/:id" element={<DetailOffre />} />
          <Route path="/recruteur/offres/modifier/:id" element={<PublierOffre />} />
          
          {/* Routes candidatures du recruteur */}
          <Route path="/recruteur/candidatures" element={<CandidaturesRecues />} />
          <Route path="/recruteur/candidatures/:id" element={<DetailCandidature />} />

          {/* ==================== OFFRES PUBLIQUES ==================== */}
          <Route path="/offres" element={<ListeOffres />} />
          <Route path="/offres/:id" element={<DetailOffre />} />
          <Route path="/offres/:offreId/postuler" element={<PostulerOffre />} />

          {/* ==================== ADMIN ==================== */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/demande" element={<Demande />} />
          <Route path="/admin/demande/:id/:idUtilisateur" element={<DemandeConsulter />} />
          <Route path="/admin/localisation" element={<DemandeLocalisation />} />
          <Route path="/admin/localisation/:id/:idUtilisateur" element={<DetailLoc />} />
          <Route path="/admin/signalement" element={<Signalement />} />
          <Route path="/admin/signalement/:id/:idUtilisateur" element={<DetailSignal />} />
          <Route path="/admin/historique" element={<Historique />} />

          {/* ==================== PAGE PAR DÉFAUT ==================== */}
          <Route path="/" element={<ConnexionPage />} />
          
          {/* ==================== 404 ==================== */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-6">Page non trouvée</p>
                <a href="/connexion" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Retour à l'accueil
                </a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;