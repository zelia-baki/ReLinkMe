import React, { useEffect, useState } from 'react'
import Menu from '../components/Menu';
import axios from "@/services/axiosInstance";
import {europeanDate} from '../utilities';
import {getAllAdminUser} from '@/modules/admin/api/AdminApi.js'
import { SlidersHorizontal,Crown, X, BadgeCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const roles = {
    all: "Tout",
    admin: "Administrateur",
    recruteur: "Recruteur",
    chomeur: "Chômeur"
}

export default function Utilisateur() {
    const { adminRole, name, email, codeAdmin,idAdmin  } = useAuth(); 
    const [listUtilisateur,setListUtilisateur] = useState([]);
    const [filter,setFilter] = useState("all");

    const adminInfo = {
        codeAdmin: codeAdmin,
        idAdmin: idAdmin
    
    }
    useEffect(()=>{
        fetchListUtilisateur();
    },[filter])

    const fetchListUtilisateur = async () =>{
        try{
            const {data} = await axios.get(`admin/users/all?role=${filter}`)
            setListUtilisateur(data.list);
            console.log(data)
        }catch (error) {
            console.error("Erreur de récupération des utilisateurs:", error.response?.data || error.message);
        }
    }

    const onFilter = (e) => {
        setFilter(e.target.value);
        fetchListUtilisateur();
        console.log(filter)
    }
 
  return (
    <div className="flex h-screen bg-gray-50">
        <Menu
        name={name}
        email={email}
        role={adminRole}
    />
        <div className='right-pane flex-1 p-8 overflow-y-auto'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>Liste des utilisateurs</h2>
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
                        {Object.entries(roles).map(([key, label]) => (
                                <option key={`status-${key}`} value={key} >
                                    {label}
                                </option>
                            ))}
                        </select>
                </div>
            </div>
            <div className='bottom-table-section bg-white rounded-xl shadow-lg overflow-hidden mt-6'>
                <div className='Utilisateur-table' style={{overflow:"auto",height:"70vh"}}>
                     <table className='info-table w-full border-collapse'>
                        <thead>
                            <tr>   
                                    <th>#</th>
                                    <th>Code</th>
                                    <th>Nom complet</th>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Téléphone</th>
                                    <th>Localisation</th>
                                    <th>Statut Vérifié</th>
                                    <th>Date inscription</th>                                                          
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listUtilisateur.map((Utilisateur,index)=>(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{Utilisateur.code_utilisateur}</td>
                                        <td>{Utilisateur.nom_complet}</td>
                                        <td>{Utilisateur.email}</td>
                                        <td className='flex justify-between align-center'>{roles[Utilisateur.role]} {(Utilisateur.role == "admin") && <Crown size={11} color="#ffea00" strokeWidth={3} />}</td>
                                        <td>{Utilisateur.telephone}</td>
                                        <td>{(Utilisateur.localisation == null)? "--" : Utilisateur.localisation}</td>
                                        <td>{Utilisateur.statut_verifie ? <BadgeCheck size={16} color="#4dff00" strokeWidth={3} /> : <X size={16} color="#ff0000" strokeWidth={3} />}</td>
                                        <td><span style={{ whiteSpace: "pre-line" }}>{europeanDate(Utilisateur.date_inscription)}</span></td>
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
