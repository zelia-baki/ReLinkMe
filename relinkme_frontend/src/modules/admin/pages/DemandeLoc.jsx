import React, { useEffect, useState } from 'react'
import { getAllLocListe } from '../api/DemandeApi'
import  {SlidersHorizontal,Plus,Eye} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const filterChoices = {
    all : "Tout",
    verifie: "Vérifié",
    refuse: "Refusé"
}

function DemandeLocalisation() {
    const navigate = useNavigate()
    const [listLoc,setListLoc] = useState([])
    const [filter,setFilter] = useState("all")
    const adminInfo = {
        codeAdmin: "ADM00015",
        idAdmin:15
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
    <div className='right-pane'>
        <h2 className='title'>Vérification de localisation</h2>
        <div className='top-table-section'>
             <button>
                <SlidersHorizontal /> Filtrer
            </button>
            <select value={filter} onChange={onFilter}>
                
                {Object.entries(filterChoices).map(([key, label]) => (
                        <option key={key} value={key} >
                            {label}
                        </option>
                    ))}
            </select>
        </div>
        <div className='bottom-table-section'>
            <table className='w-full border-collapse'>
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
                                <td>{demande.created_at}</td>
                                <td>
                                    <button onClick={()=>VoirPlus(demande.id,demande.id_utilisateur)}>
                                       <Eye size={20} strokeWidth={1.25} /> Voir plus
                                    </button>
                                </td>
                           </tr> 
                        ))
                    }
                </tbody>
                </table>
        </div>

    </div>
  )
}

export default DemandeLocalisation