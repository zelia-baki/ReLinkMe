# In the central models/__init__.py file (e.g., app/models/__init__.py)

# ----------------- ADMINISTRATEUR Models -----------------
from .administrateur.Administrateur import Administrateur
from .administrateur.DemandeVerification import DemandeVerification
from .administrateur.HistoriqueValidation import HistoriqueValidation
from .administrateur.PieceJustificative import PieceJustificative
from .administrateur.Signalement import Signalement
from .administrateur.VerificationLocalisation import VerificationLocalisation

# ----------------- AUTRES Models -----------------
from .autres.Candidature import Candidature
from .autres.Evaluation import Evaluation
from .autres.TransactionJeton import TransactionJeton
from .autres.Utilisateur import Utilisateur

# ----------------- CHOMEUR Models -----------------
from .chomeur.Chomeur import Chomeur
from .chomeur.ChomeurCompetence import ChomeurCompetence
from .chomeur.Competence import Competence
from .chomeur.Exploit import Exploit
from .chomeur.TentativeTest import TentativeTest

# ----------------- RECRUTEUR Models -----------------
from .recruteur.Commission import Commission
from .recruteur.Offre import Offre
from .recruteur.OffreCompetence import OffreCompetence
from .recruteur.Recruteur import Recruteur
from .recruteur.TestCompetence import TestCompetence

# --- OPTIONAL (Best Practice): Define __all__ ---
# This ensures that when someone imports * from this __init__.py, 
# all your models are included.

__all__ = [
    'Administrateur', 'DemandeVerification', 'HistoriqueValidation',
    'PieceJustificative', 'Signalement', 'VerificationLocalisation',

    'Candidature', 'Evaluation', 'TransactionJeton', 'Utilisateur',

    'Chomeur', 'ChomeurCompetence', 'Competence', 'Exploit', 'TentativeTest',

    'Commission', 'Offre', 'OffreCompetence', 'Recruteur', 'TestCompetence'
]