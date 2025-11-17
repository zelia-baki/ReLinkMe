import React, { useEffect, useState } from 'react'
import { getAllDemande } from '../api/DemandeApi'
import  {SlidersHorizontal,Plus,Eye} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const filterChoices = {
    all : "Tout",
    en_cours: "En cours",
    en_attente: "En attente",
    approuvee: "Approuvée",
    refusee: "Refusée"
}

function Demande() {
    const navigate = useNavigate()
    const [listDemande,setListDemande] = useState([])
    const [filter,setFilter] = useState("all")
    const adminInfo = {
        codeAdmin: "ADM00015",
        idAdmin:15
    }
    const [codeAdmin,setCodeAdmin] = useState("ADM00015")

    useEffect(()=>{
        fetchListDemande(filter,{code_admin:adminInfo["codeAdmin"]})
    },[])

    const fetchListDemande = async (filter,body) => {
         const data = await getAllDemande(filter,body)
                setListDemande(data.list)
                console.log(data)
    };
    const onFilter = (e) => {
        setFilter(e.target.value);
        fetchListDemande(e.target.value,{code_admin:codeAdmin})
    };
    const VoirPlus = (idDemande,idUtilisateur) =>{
        navigate(`/admin/demande/${idDemande}/${idUtilisateur}`);
    }
  return (
    <div className='right-pane'>
        <h2 className='title'>Vérification d'identité</h2>
        <div className='top-table-section'>
             <button>
                <SlidersHorizontal /> Filtrer
            </button>
            <label>Statut</label>
            <select value={filter} onChange={onFilter}>
                
                {Object.entries(filterChoices).map(([key, label]) => (
                        <option key={key} value={key} >
                            {label}
                        </option>
                    ))}
            </select>
            <label>Statut</label>
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
                            <th>Code demande</th>
                            <th>Utilisateur associé</th>
                            <th>Type de vérification</th>
                            <th>Statut</th>
                            <th>Responsable</th>
                            <th>Date de soumission</th>
                            <th>Créé par</th>
                            <th>Créé le</th>
                            <th></th>
                            
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        listDemande.map((demande,index)=>(
                           <tr key={index}>
                                <td>{index+1}</td>
                                <td>{demande.code_demande}</td>
                                <td>{demande.id_utilisateur}</td>
                                <td>{demande.type_verification}</td>
                                <td>{demande.statut}</td>
                                <td>{demande.id_admin_responsable}</td>
                                <td>{demande.date_soumission}</td>
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

export default Demande