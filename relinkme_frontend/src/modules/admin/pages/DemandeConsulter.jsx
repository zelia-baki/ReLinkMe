import React, { useEffect, useState } from 'react'
import { getSingleDemande, getSingleUser, traiterDemande } from '../api/DemandeApi'
import { useParams } from 'react-router-dom';
import {SquareChevronLeft,SquareChevronRight,Check,X} from 'lucide-react'

const INITIAL_FORM_STATE = {
    statut: '',
    motif_refus: '',
    modified_by: 0
};
function DemandeConsulter() {
    const {id,idUtilisateur} = useParams() ;
    const [demande,setDemande] = useState([]);
    const [userData,setUserData] = useState([]);
    const [writeMotif,setWriteMotif] = useState(false);
    const [modifiedBy,setModifiedBy] = useState(0);
    const adminData = {
        codeAdmin: "ADM00015",
        idAdmin:15
    }
     const [formData, setFormData] = useState({
        statut: '',
        motif_refus: '',
        modified_by: adminData["idAdmin"]
    })

    useEffect(()=>{
        fetchDemande(id,{code_admin:adminData["codeAdmin"]});
        fetchUser(idUtilisateur);
    },[])

    const resetDemande = () => {
        setFormData(INITIAL_FORM_STATE)
    }
    const fetchDemande = async (idDmd,body) => {
             const data = await getSingleDemande(idDmd,body);
            setDemande(data.list);
                    console.log(data.list);
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
    
    
    const cancel = () => {
        setWriteMotif(!writeMotif);
        resetDemande();
    }

  return (
    <div className='right-pane'>
        <h2>Demande de vérification</h2>
        <div className='navigation-part'>
            <div className='previous'>
                <button>
                    <SquareChevronLeft size={30} strokeWidth={0.75} />
                </button>
            </div>
            <div className='identite'>
                <div>
                    <div>{userData.nom_complet}</div>

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
            {
                (demande.statut == 'approuvee') ? 
                <div>Approuvée</div>
                : 
                <>
                <div>
                    {demande.statut}
                </div>
                <div style={{ visibility: !writeMotif ? "visible" : "hidden" }}>
                    <button onClick={approve}>
                        <Check size={18} strokeWidth={1.25} /> Approuver
                    </button>
                    <button onClick={reject}>
                        <X size={18} strokeWidth={1.25} /> Refuser
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
                                <td>
                                    <input type="text" name="motif_refus" value={formData.motif_refus} onChange={handleChange}/>
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
                                <td>{(demande.motif_refus == "") ? "Aucun" : demande.motif_refus}</td>
                            }
                            
                        </tr>
                        <tr>
                            <td className='label'>Date de soumission </td>
                            <td>:</td>
                            <td>{demande.date_soumission}</td>
                        </tr>
                        <tr>
                            <td className='label'>Date de traitement </td>
                            <td>:</td>
                            <td>{demande.date_traitement}</td>
                        </tr>
                        <tr>
                            <td className='label'>Créé par </td>
                            <td>:</td>
                            <td>{userData.email}</td>
                        </tr>
                        <tr>
                            <td className='label'>Créé le </td>
                            <td>:</td>
                            <td>{demande.created_at}</td>
                        </tr>
                        <tr>
                            <td className='label'>Modifié par </td>
                            <td>:</td>
                            <td>{demande.modified_by}</td>
                        </tr>
                        <tr>
                            <td className='label'>Modifié le </td>
                            <td>:</td>
                            <td>{demande.updated_at}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
            <div className='pece-justificative'>

            </div>
        </div>

    </div>
  )
}

export default DemandeConsulter