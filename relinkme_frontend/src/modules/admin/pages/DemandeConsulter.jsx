import React, { useEffect, useState } from 'react'
import { getSingleDemande, getSingleUser, traiterDemande,getPiece } from '../api/DemandeApi'
import { useParams } from 'react-router-dom';
import {FileText,SquareChevronLeft,SquareChevronRight,Check,X} from 'lucide-react'
import {europeanDate} from '../utilities';
import Menu from '../components/Menu';
import './Detail.css';
import { useAuth } from '../context/AuthContext';

const INITIAL_FORM_STATE = {
    statut: '',
    motif_refus: '',
    modified_by: 0
};

const type_piece = {
    passeport: "Passeport",
    carte_identite: " Carte d'identité",
    permis_conduire: "Permis de conduite",
    justificatif_domicile: "Justificatif de domicile",
    certificat_travail: "Certificat de travail",
    autre: "Autre"
}
function DemandeConsulter() {
    const { adminRole, name, email, codeAdmin,idAdmin  } = useAuth(); 
    const {id,idUtilisateur} = useParams() ;
    const [demande,setDemande] = useState([]);
    const [userData,setUserData] = useState([]);
    const [writeMotif,setWriteMotif] = useState(false);
    const [piece,setPiece] = useState([]);
    const [modifiedBy,setModifiedBy] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const adminData = {
        codeAdmin: codeAdmin,
        idAdmin: idAdmin
    }
     const [formData, setFormData] = useState({
        statut: '',
        motif_refus: '',
        modified_by: adminData["idAdmin"]
    })

    useEffect(()=>{
        fetchDemande(id,{code_admin:adminData["codeAdmin"]});
        fetchUser(idUtilisateur);
        fetchPiece();
    },[])

    const resetDemande = () => {
        setFormData(INITIAL_FORM_STATE)
    }
    const fetchDemande = async (idDmd,body) => {
        setLoading(true);
        try{
             const data = await getSingleDemande(idDmd,body);
            setDemande(data.list);
                    console.log(data.list);
        } catch(error) {
            console.error("Error fetching demande:", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchUser = async (id) => {
        const data = await getSingleUser(id)
        setUserData(data.list[0]);
        console.log(data.list[0]);

    }
    const modifyDemande = async (form) => {
        const data = await traiterDemande(id,adminData['idAdmin'],form)
        fetchDemande(id,{code_admin:adminData["codeAdmin"]});
        
    }
    const handleChange = (e) => {
    setFormData(prev => ({
        ...prev,
        motif_refus: e.target.value,
        statut: "refusee"
    }))
};
    const reject = () => {
        setWriteMotif(!writeMotif)
        console.log("clicked")
    }
    const confirm = () => {
        const updated = {
        ...formData,
        statut: "refusee"
    };
        const data = modifyDemande(updated);
        resetDemande();
        setWriteMotif(!writeMotif);
        fetchDemande(id,{code_admin:adminData["codeAdmin"]});
    }
    const approve = () => {
         const updated = {
        ...formData,
        statut: "approuvee"
        
    };

        const data = modifyDemande(updated);
        
        resetDemande();
        fetchDemande(id,{code_admin:adminData["codeAdmin"]});
    }
    
    const fetchPiece = async () => {
        try{
             const data = await getPiece(idUtilisateur);
            setPiece(data.list);
            console.log(data.list);
        } catch(error) {
            console.error("Error fetching justificative:", error);
        }
    }

    const cancel = () => {
        setWriteMotif(!writeMotif);
        resetDemande();
    }
    const getStatusBadge = (status) => {
        let text = 'Inconnu';
        let colorClass = 'bg-gray-500';

        switch (status) {
            case 'approuvee':
                text = 'Approuvée';
                colorClass = 'bg-green-500';
                break;
            case 'refusee':
                text = 'Refusé';
                colorClass = 'bg-red-500';
                break;
            case 'en_attente':
                text = 'En attente';
                colorClass = 'bg-blue-500';
                break;
            default:
                text = status || 'Inconnu';
                colorClass = 'bg-gray-500';
                break;
        }
        return <span className={`action-status-badge  ${colorClass}`}>{text}</span>;
    };
    if (loading && Object.keys(demande).length === 0) {
        return (
            <>
                <Menu
                    name={name}
                    email={email}
                    role={adminRole}
                />
                <div className='right-pane p-8 flex items-center justify-center h-screen'>
                    <div className="text-xl font-medium text-gray-500">Chargement des détails de la demande...</div>
                </div>
            </>
        )
    }

  return (
     <div className="flex h-screen bg-gray-50">
    <Menu
        name={name}
        email={email}
        role={adminRole}
    />
    <div className='right-pane p-8 overflow-y-auto'>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Demande de vérification</h2>
        <div className='navigation-part'>
            <div className='previous'>
                <button className='nav-arrow-button'>
                    <SquareChevronLeft size={30} strokeWidth={0.75} />
                </button>
            </div>
            <div className='user-identity-card'>
                
                <div className='user-identity-name'>{userData.nom_complet}</div>

                <div className='space-y-1'>
                    <div className='user-identity-detail'>Code utilisateur: {userData.code_utilisateur}</div>
                    <div className='user-identity-detail'>Email: {userData.email}</div>
                </div>
            </div>
            <div className='next'>
                <button className='nav-arrow-button'>
                    <SquareChevronRight size={30} strokeWidth={0.75} />
                </button>
            </div>
        </div>
        
        <div className='action-section'>
            {getStatusBadge(demande.statut)}
            {
                (demande.statut != 'approuvee') && 
                
                <div className='action-button-group' style={{ visibility: !writeMotif ? "visible" : "hidden" }}>
                    <button onClick={approve}  className='approve-button'>
                        <Check size={18} strokeWidth={1.25} /> Approuver
                    </button>
                    <button onClick={reject}  className='reject-button'>
                        <X size={18} strokeWidth={1.25} /> Refuser
                    </button>
                </div>
                
                
            }
        </div>
        <div className='info-part grid lg:grid-cols-2 gap-8'>
            <div className='detail-table-container'>
                <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-4 border-b pb-2">
                    
                    <FileText size={20} color="#1e2939" strokeWidth={1.75} />
                    Informations de demande </h3>
                <div className='table-container'>
                     <table className='detail-table w-full'>
                        <tbody>
                        <tr>
                            <td className='label'>Code demande </td>
                            <td>:</td>
                            <td>{demande.code_demande}</td>
                        </tr>
                        <tr>
                            <td className='label'>Type de vérification </td>
                            <td>:</td>
                            <td>{demande.type_verification}</td>
                        </tr>
                        <tr>
                            <td className='label'>Motif de refus </td>
                            <td>:</td>
                            {
                                writeMotif ? 
                                <td className='py-1'>
                                    <input type="text" name="motif_refus" value={formData.motif_refus} onChange={handleChange}/>
                                    <div className='flex items-end justify-end my-1.5'>
                                        <button onClick={cancel} className='cancel-button'>
                                            Annuler
                                        </button>
                                        <button onClick={confirm} className='add-button'>
                                            Confirmer
                                        </button>
                                    </div>
                                </td>
                                :
                                <td>{demande.motif_refus ||'-'}</td>
                            }
                            
                        </tr>
                        <tr>
                            <td className='label'>Date de soumission </td>
                            <td>:</td>
                            <td>{europeanDate(demande.date_soumission)}</td>
                        </tr>
                        <tr>
                            <td className='label'>Date de traitement </td>
                            <td>:</td>
                            <td>{europeanDate(demande.date_traitement)}</td>
                        </tr>
                        <tr>
                            <td className='label'>Créé par </td>
                            <td>:</td>
                            <td>{userData.email}</td>
                        </tr>
                        <tr>
                            <td className='label'>Créé le </td>
                            <td>:</td>
                            <td>{europeanDate(demande.created_at)}</td>
                        </tr>
                        <tr>
                            <td className='label'>Modifié par </td>
                            <td>:</td>
                            <td>{demande.modified_by || '-'}</td>
                        </tr>
                        <tr>
                            <td className='label'>Modifié le </td>
                            <td>:</td>
                            <td>{europeanDate(demande.updated_at)}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
            <div className='left-pane'>
                <h3 className="text-lg font-semibold text-gray-800 p-4 ">Pièce justificative : {type_piece[piece.type_piece]}</h3>
                {piece.fichier_url? <img src={piece.fichier_url}/> : "Aucune pièce justificative"}
                

            </div>
        </div>

    </div>
    </div>
  )
}

export default DemandeConsulter