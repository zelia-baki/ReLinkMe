import React, { useEffect, useState } from 'react'
import  {SlidersHorizontal,Plus,Eye} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { listSignalement } from '../api/SignalementApi'
import {europeanDate} from '../utilities';
import Menu from '../components/Menu';

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
    <div className="flex h-screen bg-gray-50">
    <Menu/>
    <div className='right-pane flex-1 p-8 overflow-y-auto'>
        <h2 className='text-3xl font-bold text-gray-800 mb-6'>Liste des signalements</h2>
        <div className='flex top-table-section'>
             <div className='filter-group'>
                <label className='filter-label' style={{visibility:"hidden"}}>label</label>
                     <button className="filter-button">
                                     <SlidersHorizontal size={16} /> 
                                     <span>Filtres</span>
                                 </button>
                     </div>
            <div className='filter-group'>
            <label>Statut</label>
            <select value={filter} onChange={onFilter}>
                
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
                            <th>Code signalement</th>
                            <th>Type signalement</th>
                            <th>Cible</th>
                            <th>Auteur</th>
                            <th>Statut</th>
                            <th>Date de signalement</th>
                            <th>Responsable</th>
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
                                <td>
                                    <button onClick={()=>VoirPlus(signal.id,signal.id_utilisateur_signale)} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-150">
                                       <Eye size={20} strokeWidth={1.25} /><span> Voir plus </span>
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

export default Signalement