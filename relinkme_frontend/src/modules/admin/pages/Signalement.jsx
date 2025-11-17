import React, { useEffect, useState } from 'react'
import  {SlidersHorizontal,Plus,Eye} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { listSignalement } from '../api/SignalementApi'

const filterChoices = {
    all : "Tout",
    en_cours: "En cours",
    en_attente: "En attente",
    traite: "Traité",
    rejete: "Rejeté"
}
const typeVerification = {
    profil_frauduleux: "Profil frauduleux",
    contenu_inapproprie: "Contenu inappropié",
    spam: "Spam",
    harcelement: "Harcèlement",
    fausse_offre: "Fausse offre",
    autre: "Autre"
}

function Signalement() {
    const navigate = useNavigate()
    const [ListSignal,setListSignal] = useState([])
    const [filter,setFilter] = useState("all")
    const adminInfo = {
        codeAdmin: "ADM00015",
        idAdmin:15
    }
    const [codeAdmin,setCodeAdmin] = useState("ADM00015")

    useEffect(()=>{
        fetchListSignal(filter,{code_admin:adminInfo["codeAdmin"]})
    },[])

    const fetchListSignal = async (filter,body) => {
         const data = await listSignalement(filter,body)
                setListSignal(data.list)
                console.log(data)
    };
    const onFilter = (e) => {
        setFilter(e.target.value);
        fetchListSignal(e.target.value,{code_admin:codeAdmin})
    };
    const VoirPlus = (idSignal,idUtilisateur) =>{
        navigate(`/admin/signalement/${idSignal}/${idUtilisateur}`);
    }
  return (
    <div className='right-pane'>
        <h2 className='title'>Liste des signalements</h2>
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
                            <th>Code signalement</th>
                            <th>Type signalement</th>
                            <th>Cible</th>
                            <th>Auteur</th>
                            <th>Statut</th>
                            <th>Date de signalement</th>
                            <th>Responsable</th>
                            <th>Créé par</th>
                            <th>Créé le</th>
                            <th></th>
                            
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        ListSignal.map((signal,index)=>(
                           <tr key={index}>
                                <td>{index+1}</td>
                                <td>{signal.code_signalement}</td>
                                <td>{typeVerification[signal.type_signalement]}</td>
                                <td>{signal.id_utilisateur_signale}</td>
                                <td>{signal.id_signaleur}</td>
                                <td>{filterChoices[signal.statut]}</td>
                                <td>{signal.date_signalement}</td>
                                <td>{signal.id_admin_responsable}</td>
                                <td>{signal.created_by}</td>
                                <td>{signal.created_at}</td>
                                <td>
                                    <button onClick={()=>VoirPlus(signal.id,signal.id_utilisateur_signale)}>
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

export default Signalement