import React, { useEffect, useState } from 'react'
import Menu from '../components/Menu';
import axios from "@/services/axiosInstance";
import {europeanDate} from '../utilities';
import {getAllAdminUser} from '@/modules/admin/api/AdminApi.js'
import { SlidersHorizontal } from 'lucide-react';

export default function Historique() {
    const [listHistory,setListHistory] = useState([]);
    const [listAdmin,setListAdmin] = useState([]);
    const [filter,setFilter] = useState(0);

    const adminInfo = {
        codeAdmin: "ADM00015",
        idAdmin: 15
    }
    useEffect(()=>{
        fetchListHistory();
        fetchListAdmin();
    },[filter])

    const fetchListHistory = async () =>{
        try{
            const {data} = await axios.get(`admin/historique/${adminInfo["codeAdmin"]}?admin=${parseInt(filter)}`)
            setListHistory(data.list);
            console.log(data)
        }catch (error) {
            console.error("Erreur de récupération des historiques:", error.response?.data || error.message);
        }
    }

    const fetchListAdmin = async () => {
            const data = await getAllAdminUser()
            setListAdmin(data.list)
            console.log(data.list)
        }
    const onFilter = (e) => {
        setFilter(e.target.value);
        fetchListHistory();
        console.log(filter)
    }
 
  return (
    <div className="flex h-screen bg-gray-50">
        <Menu/>
        <div className='right-pane flex-1 p-8 overflow-y-auto'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>Historique des actions</h2>
            <div className=" flex top-table-section">
                 <div className='filter-group'>
                    <label className='filter-label' style={{visibility:"hidden"}}>label</label>
                    <button className="filter-button">
                        <SlidersHorizontal size={16} /> 
                        <span>Filtre</span>
                    </button>
                </div>
                <div className="filter-group">
                    <label className="filter-label">Statut</label>
                    <select value={filter} onChange={onFilter} className="select filter-select">
                        <option value="0">Tout</option>
                        {listAdmin.map((admin,index) => (
                            <option key={index} value={admin.id} >
                                 {`[${admin.id}] ${admin.utilisateur.nom_complet}`}
                                </option>
                            ))}
                        </select>
                </div>
            </div>
            <div className='bottom-table-section bg-white rounded-xl shadow-lg overflow-hidden mt-6'>
                <div className='history-table' style={{overflow:"auto",height:"70vh"}}>
                     <table className='info-table w-full border-collapse'>
                        <thead>
                            <tr>   
                                    <th>#</th>
                                    <th>Code</th>
                                    <th>Date action</th>
                                    <th>Type d'action</th>
                                    <th>Table concernée</th>
                                    <th>Id enregistrement</th>
                                    <th>Détails</th>
                                    <th>Cible</th>
                                    <th>Créé par</th>
                                    <th>Créé le</th>                                                           
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listHistory.map((history,index)=>(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{history.code_historique}</td>
                                        <td><span style={{ whiteSpace: "pre-line" }}>{europeanDate(history.date_action)}</span></td>
                                        <td>{history.type_action}</td>
                                        <td>{history.table_concernee}</td>
                                        <td>{history.id_enregistrement}</td>
                                        <td>{history.details}</td>
                                        <td>{history.id_utilisateur_cible}</td>
                                        <td>{history.id_admin}</td>
                                        <td><span style={{ whiteSpace: "pre-line" }}>{europeanDate(history.created_at)}</span></td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}
