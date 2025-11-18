import React, { useEffect, useState } from 'react'
import { getSingleUser,getSingleSignalement,traiterSignalement } from '../api/SignalementApi'
import { useParams } from 'react-router-dom';
import {SquareChevronLeft,SquareChevronRight,Check,X} from 'lucide-react'
import {europeanDate} from '../utilities';
import Menu from '../components/Menu';

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
    const {id,idUtilisateur} = useParams() ;
    const [Signal,setSignal] = useState([]);
    const [userData,setUserData] = useState([]);
    const [writeMotif,setWriteMotif] = useState(false);
    const [modifiedBy,setModifiedBy] = useState(0);
    
    const adminData = {
        codeAdmin: "ADM00015",
        idAdmin:15
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
             const data = await getSingleSignalement(idLoc,body);
            setSignal(data.list);
                    console.log(data.list);
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
    
  return (

    <>
    <Menu/>
    <div className='right-pane'>
        <h2>Signalement de contenu</h2>
        <div className='navigation-part'>
            <div className='previous'>
                <button>
                    <SquareChevronLeft size={30} strokeWidth={0.75} />
                </button>
            </div>
            <div className='identite'>
                <div>
                    <div>Signalé: {userData.nom_complet}</div>

                </div>
                <div>Code utilisateur: {userData.code_utilisateur}</div>
                <div>Email: {userData.email}</div>
            </div>
            <div className='next'>
                <button>
                    <SquareChevronRight size={30} strokeWidth={0.75} />
                </button>
            </div>
        </div>
        
        <hr></hr>
        <div className='action'>
            <div>{filterChoices[Signal.statut]}</div>
                
            {
                (Signal.statut != 'rejete') &&
                
                <>
                <div style={{ visibility: !writeMotif ? "visible" : "hidden" }}>
                    <button onClick={accept}>
                        <Check size={18} strokeWidth={1.25} /> Accepter
                    </button>
                    <button onClick={reject}>
                        <X size={18} strokeWidth={1.25} /> Rejeter
                    </button>
                </div>
                </>
                
            }
        </div>
        <div className='info-part'>
            <div className='identity-part'>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
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
            <div className='pece-justificative'>
                <iframe
                    style={{border:0,width:"100%",height:"800px"}}
                    loading="lazy"
                    allowFullScreen
                    src={Signal.preuves_url}>
                </iframe>
            </div>
        </div>

    </div>
    </>
  )
}

export default DetailSignal