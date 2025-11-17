import React, { useEffect, useState } from 'react'
import { getSingleLoc, getSingleUser,traiterLocalisation } from '../api/DemandeApi'
import { useParams } from 'react-router-dom';
import {SquareChevronLeft,SquareChevronRight,Check,X} from 'lucide-react'

const INITIAL_FORM_STATE = {
    statut: '',
};
function DetailLoc() {
    const {id,idUtilisateur} = useParams() ;
    const [Localisation,setLocalisation] = useState([]);
    const [userData,setUserData] = useState([]);
    const [modifiedBy,setModifiedBy] = useState(0);
    
    const adminData = {
        codeAdmin: "ADM00015",
        idAdmin:15
    }
     const [formData, setFormData] = useState({
        statut: ''
    })

    useEffect(()=>{
        fetchLocalisation(id,{code_admin:adminData["codeAdmin"]});
        fetchUser(idUtilisateur);
    },[])

    const resetLocalisation = () => {
        setFormData(INITIAL_FORM_STATE)
    }
    const fetchLocalisation = async (idLoc,body) => {
             const data = await getSingleLoc(idLoc,body);
            setLocalisation(data.list);
                    console.log(data.list);
    };
    const fetchUser = async (id) => {
        const data = await getSingleUser(id)
        setUserData(data.list[0]);
        console.log(data.list[0]);

    }
    const modifyLocalisation = async (form) => {
        const data = await traiterLocalisation(id,adminData['idAdmin'],form)
        fetchLocalisation(id,{code_admin:adminData["codeAdmin"]});
        
    }

    const reject = () => {
        const data = modifyLocalisation({statut:'refuse'});
        resetLocalisation();
        fetchLocalisation(id,{code_admin:adminData["codeAdmin"]});
    }
    const approve = () => {
      
        const data = modifyLocalisation({statut:'verifie'});
        resetLocalisation();
        fetchLocalisation(id,{code_admin:adminData["codeAdmin"]});
    }
    
  return (
    <div className='right-pane'>
        <h2>Localisation de vérification</h2>
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
            <div>{Localisation.statut}</div>
                
            {
                (Localisation.statut != 'verifie') &&
                
                <>
                <div>
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
                            <td className='label'>Code Localisation </td>
                            <td>:</td>
                            <td>{Localisation.code_verification}</td>
                        </tr>
                        <tr>
                            <td className='label'>Ville </td>
                            <td>:</td>
                            <td>{Localisation.ville}</td>
                        </tr>
                        <tr>
                            <td className='label'>Pays </td>
                            <td>:</td>
                            <td>{Localisation.pays}</td>
                            
                        </tr>
                        <tr>
                            <td className='label'>Latitude, Longitude </td>
                            <td>:</td>
                            <td>({Localisation.latitude},{Localisation.longitude})</td>
                        </tr>
                        <tr>
                            <td className='label'>Lien justificatif</td>
                            <td>:</td>
                            <td>{Localisation.justificatif_url}</td>
                        </tr>
                        <tr>
                            <td className='label'>Localisation insérée </td>
                            <td>:</td>
                            <td>{(userData.localisation == null) ? "Aucun" : userData.localisation}</td>
                        </tr>
                        <tr>
                            <td className='label'>Date de vérification </td>
                            <td>:</td>
                            <td>{Localisation.date_verification}</td>
                        </tr>
                        <tr>
                            <td className='label'>Responsable</td>
                            <td>:</td>
                            <td>{Localisation.id_admin_verificateur}</td>
                        </tr>
                        <tr>
                            <td className='label'>Créé par </td>
                            <td>:</td>
                            <td>{userData.email}</td>
                        </tr>
                        <tr>
                            <td className='label'>Créé le </td>
                            <td>:</td>
                            <td>{Localisation.created_at}</td>
                        </tr>
                        <tr>
                            <td className='label'>Modifié par </td>
                            <td>:</td>
                            <td>{Localisation.modified_by}</td>
                        </tr>
                        <tr>
                            <td className='label'>Modifié le </td>
                            <td>:</td>
                            <td>{Localisation.updated_at}</td>
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
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAv3aL-6oT4w41PA7d7Rp7RxupIHf_e990&q=${Localisation.latitude},${Localisation.longitude}&zoom=16`}>
</iframe>
            </div>
        </div>

    </div>
  )
}

export default DetailLoc