import React, { useEffect, useState } from 'react'
import { getAllLocListe } from '../api/DemandeApi'
import  {SlidersHorizontal,Plus,Eye} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {europeanDate} from '../utilities';
import Menu from '../components/Menu';
import { useAuth } from '../context/AuthContext';

const filterChoices = {
    all : "Tout",
    verifie: "Vérifié",
    refuse: "Refusé"
}

function DemandeLocalisation() {
     const { adminRole, name, email, codeAdmin,idAdmin  } = useAuth(); 
    const navigate = useNavigate()
    const [listLoc,setListLoc] = useState([])
    const [filter,setFilter] = useState("all")
    const adminInfo = {
        codeAdmin: codeAdmin,
        idAdmin: idAdmin
    }

    useEffect(()=>{
        fetchListLoc(adminInfo["codeAdmin"],filter)
    },[])

    const fetchListLoc = async (codeAdmin,filter) => {
         const data = await getAllLocListe(codeAdmin,filter)
                setListLoc(data.list)
                console.log(data.list)
    };
    const onFilter = (e) => {
        setFilter(e.target.value);
        fetchListLoc(adminInfo["codeAdmin"],e.target.value)
    };
    const VoirPlus = (idDemande,idUtilisateur) =>{
        navigate(`/admin/localisation/${idDemande}/${idUtilisateur}`);
    }
  return (
    <div className="flex h-screen bg-gray-50">
    <Menu
        name={name}
        email={email}
        role={adminRole}
    />
    <div className='right-pane flex-1 p-8 overflow-y-auto'>
        <h2 className='text-3xl font-bold text-gray-800 mb-6'>Vérification de localisation</h2>
        <div className='flex top-table-section'>
            <div className='filter-group'>
             <button className="filter-button">
                <SlidersHorizontal /> Filtres
            </button>
            </div>
            <div className='filter-group'>
            <select value={filter} onChange={onFilter} className="select filter-select">
                
                {Object.entries(filterChoices).map(([key, label]) => (
                        <option key={key} value={key} >
                            {label}
                        </option>
                    ))}
            </select>
            </div>
        </div>
        <div className='bottom-table-section bg-white rounded-xl shadow-lg overflow-hidden mt-6'>
            <table className='info-table w-full border-collapse'>
                <thead>
                    <tr>
                        
                            <th>#</th>
                            <th>Code Vérification</th>
                            <th>Utilisateur associé</th>
                            <th>Ville</th>
                            <th>Pays</th>
                            <th>Statut</th>
                            <th>Responsable</th>
                            <th>Créé par</th>
                            <th>Créé le</th>
                            <th></th>
                            
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        listLoc.map((demande,index)=>(
                           <tr key={index}>
                                <td>{index+1}</td>
                                <td>{demande.code_verification}</td>
                                <td>{demande.id_utilisateur}</td>
                                <td>{demande.ville}</td>
                                <td>{demande.pays}</td>
                                <td>{demande.statut}</td>
                                <td>{demande.id_admin_verificateur}</td>
                                <td>{demande.created_by}</td>
                                <td><span style={{ whiteSpace: "pre-line" }}>{europeanDate(demande.created_at)}</span></td>
                                <td>
                                    <button onClick={()=>VoirPlus(demande.id,demande.id_utilisateur)} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-150">
                                       <Eye size={20} strokeWidth={1.25} /><span>Voir plus</span>
                                    </button>
                                </td>
                           </tr> 
                        ))
                    }
                </tbody>
                </table>
        </div>

    </div>
    </div>
  )
}

export default DemandeLocalisation