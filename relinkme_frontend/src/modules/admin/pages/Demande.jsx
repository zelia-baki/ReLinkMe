import React, { useEffect, useState } from 'react'
import { getAllDemande } from '../api/DemandeApi'
import  {SlidersHorizontal,Plus,Eye} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {europeanDate} from '../utilities'; 
import Menu from '../components/Menu';
import './Style.css'

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
    <div className="flex h-screen bg-gray-50">
    <Menu/>
    <div className='right-pane flex-1 p-8 overflow-y-auto'>
        <h2 className='text-3xl font-bold text-gray-800 mb-6'>Vérification d'identité</h2>
        <div className=" flex top-table-section">
        <div className='filter-group'>
        <label className='filter-label' style={{visibility:"hidden"}}>label</label>
        <button className="filter-button">
                        <SlidersHorizontal size={16} /> 
                        <span>Filtres</span>
                    </button>
        </div>
                    <div className="filter-group">
                        <label className="filter-label">Statut</label>
                        <select value={filter} onChange={onFilter} className="select filter-select">
                            {Object.entries(filterChoices).map(([key, label]) => (
                                <option key={`status-${key}`} value={key} >
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Département</label>
                        <select value={filter} onChange={onFilter} className="select filter-select">
                            {Object.entries(filterChoices).map(([key, label]) => (
                                <option key={`dept-${key}`} value={key} >
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
                                <td><span style={{ whiteSpace: "pre-line" }}>{europeanDate(demande.date_soumission)}</span></td>
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

export default Demande