import React, { useEffect, useState } from 'react'
import { getSingleLoc, getSingleUser,traiterLocalisation } from '../api/DemandeApi'
import { useParams } from 'react-router-dom';
import {SquareChevronLeft,SquareChevronRight,Check,X, MapPin} from 'lucide-react'
import {europeanDate} from '../utilities';
import Menu from '../components/Menu';
import './Detail.css'
import './Style.css'

const INITIAL_FORM_STATE = {
    statut: '',
};
function DetailLoc() {
    const {id,idUtilisateur} = useParams() ;
    const [Localisation,setLocalisation] = useState([]);
    const [userData,setUserData] = useState([]);
    const [modifiedBy,setModifiedBy] = useState(0);
    const [loading, setLoading] = useState(true);

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
        setLoading(true);
        try {
            const data = await getSingleLoc(idLoc,body);
            setLocalisation(data.list || {});
        } catch(error) {
            console.error("Error fetching location:", error);
        } finally {
            setLoading(false);
        }
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

    const getStatusBadge = (status) => {
        let text = 'Inconnu';
        let colorClass = 'bg-gray-500';

        switch (status) {
            case 'verifie':
                text = 'Vérifié';
                colorClass = 'bg-green-500';
                break;
            case 'refuse':
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
     if (loading && Object.keys(Localisation).length === 0) {
        return (
            <>
                <Menu/>
                <div className='right-pane p-8 flex items-center justify-center h-screen'>
                    <div className="text-xl font-medium text-gray-500">Chargement des détails de localisation...</div>
                </div>
            </>
        )
    }
  return (
    <div className="flex h-screen bg-gray-50">
    <Menu/>
    <div className='right-pane p-8 overflow-y-auto'>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Vérification de localisation</h2>
        <div className='navigation-part'>
            <div className='previous'>
                <button className='nav-arrow-button'>
                    <SquareChevronLeft size={30} strokeWidth={0.75} />
                </button>
            </div>
            <div className='user-identity-card'>
                <div className='user-identity-name'>
                    {userData.nom_complet || 'Utilisateur inconnu'}
                </div>
                <div className='space-y-1'>
                    <div className='user-identity-detail'>Code utilisateur: {userData.code_utilisateur || '-'}</div>
                    <div className='user-identity-detail'>Email: {userData.email || '-'}</div>
                </div>
            </div>
            <div className='next'>
                <button className='nav-arrow-button'>
                    <SquareChevronRight size={30} strokeWidth={0.75} />
                </button>
            </div>
        </div>
        
        <div className='action'>
            {getStatusBadge(Localisation.statut)}
                
            {
                (Localisation.statut === 'en_attente') &&
                
                <div className='action-button-group'>
                    <button onClick={approve} className='approve-button'>
                        <Check size={18} strokeWidth={1.25} /> Approuver
                    </button>
                    <button onClick={reject} className='reject-button'>
                        <X size={18} strokeWidth={1.25} /> Refuser
                    </button>
                </div>
                
            }
        </div>
        <div className='info-part grid lg:grid-cols-2 gap-8'>
            <div className='detail-table-container'>
                <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-4 border-b pb-2">
                    <MapPin size={20} color="#1e2939" strokeWidth={1.75} />
                    Informations de Localisation</h3>
                <div className='table-container'>
                <table className='detail-table w-full'>
                    <tbody>
                        <tr>
                            <td className='label'>Code Localisation</td>
                            <td>:</td>
                            <td>{Localisation.code_verification || '-'}</td>
                        </tr>
                        <tr>
                            <td className='label'>Ville</td>
                            <td>:</td>
                            <td>{Localisation.ville || '-'}</td>
                        </tr>
                        <tr>
                            <td className='label'>Pays</td>
                            <td>:</td>
                            <td>{Localisation.pays || '-'}</td>
                            
                        </tr>
                        <tr>
                            <td className='label'>Latitude, Longitude</td>
                            <td>:</td>
                            <td>({Localisation.latitude || 'N/A'}, {Localisation.longitude || 'N/A'})</td>
                        </tr>
                        <tr>
                            <td className='label'>Localisation insérée</td>
                            <td>:</td>
                            <td>{(userData.localisation || Localisation.localisation) || 'Aucune'}</td>
                        </tr>
                        <tr>
                            <td className='label'>Date de vérification</td>
                            <td>:</td>
                            <td>{europeanDate(Localisation.date_verification)}</td>
                        </tr>
                        <tr>
                            <td className='label'>Responsable</td>
                            <td>:</td>
                            <td>{Localisation.id_admin_verificateur || '-'}</td>
                        </tr>
                        <tr>
                            <td className='label'>Créé par (Email)</td>
                            <td>:</td>
                            <td>{userData.email || '-'}</td>
                        </tr>
                        <tr>
                            <td className='label'>Créé le</td>
                            <td>:</td>
                            <td>{europeanDate(Localisation.created_at)}</td>
                        </tr>
                        <tr>
                            <td className='label'>Modifié par</td>
                            <td>:</td>
                            <td>{Localisation.modified_by || '-'}</td>
                        </tr>
                        <tr>
                            <td className='label'>Modifié le</td>
                            <td>:</td>
                            <td>{europeanDate(Localisation.updated_at)}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div className='left-pane'>
                 <h3 className="text-lg font-semibold text-gray-800 p-4 ">Aperçu Carte</h3>
                <iframe
                    title="Location Map"
                    style={{border:0,width:"100%",height:"70%"}} // Adjusted height to account for the header
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAv3aL-6oT4w41PA7d7Rp7RxupIHf_e990&q=${Localisation.latitude},${Localisation.longitude}&zoom=16`}>
                </iframe>
            </div>
        </div>

    </div>
    </div>
  )
}

export default DetailLoc