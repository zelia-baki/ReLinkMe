import React, { useEffect, useState } from 'react'
import { getSingleUser,getSingleSignalement,traiterSignalement } from '../api/SignalementApi'
import { useParams } from 'react-router-dom';
import {OctagonAlert,SquareChevronLeft,SquareChevronRight,Check,X} from 'lucide-react'
import {europeanDate} from '../utilities';
import Menu from '../components/Menu';
import './Detail.css'
import { useAuth } from '../context/AuthContext';

const INITIAL_FORM_STATE = {
    statut: '',
};
const filterChoices = {
    all : "Tout",
    en_cours: "En cours",
    en_attente: "En attente",
    traite: "Traité",
    rejete: "Rejeté"
}
const typeSignalement = {
    profil_frauduleux: "Profil frauduleux",
    contenu_inapproprie: "Contenu inappropié",
    spam: "Spam",
    harcelement: "Harcèlement",
    fausse_offre: "Fausse offre",
    autre: "Autre"
}

function DetailSignal() {
    const { adminRole, name, email, codeAdmin,idAdmin  } = useAuth(); 
    const {id,idUtilisateur} = useParams() ;
    const [Signal,setSignal] = useState([]);
    const [userData,setUserData] = useState([]);
    const [writeMotif,setWriteMotif] = useState(false);
    const [modifiedBy,setModifiedBy] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const adminData = {
         codeAdmin: codeAdmin,
        idAdmin: idAdmin
    }
     const [formData, setFormData] = useState({
        statut: '',
        decision:''
    })

    useEffect(()=>{
        fetchSignal(id,{code_admin:adminData["codeAdmin"]});
        fetchUser(idUtilisateur);
    },[])

    const resetSignal = () => {
        setFormData(INITIAL_FORM_STATE)
    }
    const fetchSignal = async (idLoc,body) => {
        setLoading(true);
        try{
            const data = await getSingleSignalement(idLoc,body);
            setSignal(data.list);
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
    const modifySignal = async (form) => {
        const data = await traiterSignalement(id,adminData['idAdmin'],form)
        fetchSignal(id,{code_admin:adminData["codeAdmin"]});
        
    }
    const handleChange = (e) => {
    setFormData(prev => ({
        ...prev,
        decision: e.target.value,
        statut: "rejete"
    }))
    }
     const accept = () => {
        setWriteMotif(!writeMotif)
        console.log("clicked")
    }

    const confirm = () => {
        const updated = {
        ...formData,
        statut: "traite"
        };
        const data = modifySignal(updated);
        resetSignal();
        setWriteMotif(!writeMotif);
        fetchSignal(id,{code_admin:adminData["codeAdmin"]});
    }
    const reject = () => {
        const updated = {
        ...formData,
        statut: "rejete",

        };
        const data = modifySignal(updated);
        resetSignal();
        fetchSignal(id,{code_admin:adminData["codeAdmin"]});
    }
    const cancel = () => {
        setWriteMotif(!writeMotif);
        resetSignal();
    }
    const getStatusBadge = (status) => {
        let text = 'Inconnu';
        let colorClass = 'bg-gray-500';

        switch (status) {
            case 'traite':
                text = 'Traité';
                colorClass = 'bg-red-500';
                break;
            case 'rejete':
                text = 'Rejeté';
                colorClass = 'bg-green-500';
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
    if (loading && Object.keys(Signal).length === 0) {
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
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Signalement de contenu</h2>
        <div className='navigation-part'>
            <div className='previous'>
                <button className='nav-arrow-button'>
                    <SquareChevronLeft size={30} strokeWidth={0.75} />
                </button>
            </div>
            <div className='user-identity-card'>
                <div className='user-identity-name'>{userData.nom_complet}</div>
                <div>
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
             {getStatusBadge(Signal.statut)}
                
            {
                (Signal.statut != 'rejete') &&
                
                <>
                <div className='action-button-group' style={{ visibility: !writeMotif ? "visible" : "hidden" }}>
                    <button onClick={accept} className='reject-button'>
                        <Check size={18} strokeWidth={1.25} /> Accepter
                    </button>
                    <button onClick={reject} className='approve-button'>
                        <X size={18} strokeWidth={1.25} /> Rejeter
                    </button>
                </div>
                </>
                
            }
        </div>
        <div className='info-part grid lg:grid-cols-2 gap-8'>
            <div className='detail-table-container'>
                <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-4 border-b pb-2">
                    <OctagonAlert size={20} color="#1e2939" strokeWidth={1.75}/>
                    
                    <span>Informations sur le signalement</span> </h3>
                <div  className='table-container'>
                    <table className='detail-table w-full'>
                        <tbody>
                        <tr>
                            <td className='label'>Code Signalement </td>
                            <td>:</td>
                            <td>{Signal.code_signalement}</td>
                        </tr>
                        <tr>
                            <td className='label'>Type </td>
                            <td>:</td>
                            <td>{typeSignalement[Signal.type_signalement]}</td>
                        </tr>
                        <tr>
                            <td className='label'>Description </td>
                            <td>:</td>
                            <td>{Signal.description}</td>
                            
                        </tr>
                        <tr>
                            <td className='label'>Décision </td>
                            <td>:</td>
                            {
                                writeMotif ? 
                                <td>
                                    <input type="text" name="motif_refus" value={formData.decision} onChange={handleChange}/>
                                    <div>
                                        <button onClick={cancel}>
                                            Annuler
                                        </button>
                                        <button onClick={confirm}>
                                            Confirmer
                                        </button>
                                    </div>
                                </td>
                                :
                                <td>{(Signal.decision == null) ? "Aucune" : Signal.decision}</td>
                            }
                            
                        </tr>
                        <tr>
                            <td className='label'>Auteur signalement </td>
                            <td>:</td>
                            <td>{Signal.id_signaleur}</td>
                        </tr>
                        <tr>
                            <td className='label'>Date signalement </td>
                            <td>:</td>
                            <td>{europeanDate(Signal.date_signalement)}</td>
                        </tr>
                        <tr>
                            <td className='label'>Date traitement  </td>
                            <td>:</td>
                            <td>{europeanDate(Signal.date_traitement)}</td>
                        </tr>
                        <tr>
                            <td className='label'>Offre </td>
                            <td>:</td>
                            <td>{Signal.id_offre}</td>
                        </tr>
                        <tr>
                            <td className='label'>Exploit</td>
                            <td>:</td>
                            <td>{Signal.id_exploit}</td>
                        </tr>
                        <tr>
                            <td className='label'>Responsable </td>
                            <td>:</td>
                            <td>{Signal.id_admin_responsable}</td>
                        </tr>
                        <tr>
                            <td className='label'>Créé par </td>
                            <td>:</td>
                            <td>{Signal.created_by}</td>
                        </tr>
                        <tr>
                            <td className='label'>Créé le </td>
                            <td>:</td>
                            <td>{europeanDate(Signal.created_at)}</td>
                        </tr>
                        <tr>
                            <td className='label'>Modifié par </td>
                            <td>:</td>
                            <td>{Signal.modified_by}</td>
                        </tr>
                        <tr>
                            <td className='label'>Modifié le </td>
                            <td>:</td>
                            <td>{europeanDate(Signal.updated_at)}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
            <div className='left-pane'>
                <h3 className="text-lg font-semibold text-gray-800 p-4 ">Preuve signalement</h3>
                <iframe
                    style={{border:0,width:"100%",height:"800px"}}
                    loading="lazy"
                    allowFullScreen
                    src={Signal.preuves_url}>
                </iframe>
            </div>
        </div>

    </div>
    </div>
  )
}

export default DetailSignal