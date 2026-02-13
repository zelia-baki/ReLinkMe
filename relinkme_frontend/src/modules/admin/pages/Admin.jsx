import React, { useEffect, useState } from 'react'
import {creation_admin, getAllAdmin, deleteAdmin, updateAdmin} from '@/modules/admin/api/AdminApi.js'
import  {Plus,Trash, SquarePen,X} from 'lucide-react'
import { getAllUsers } from '../api/AdminApi';
import {europeanDate} from '../utilities';
import Menu from '../components/Menu';
import './Style.css'
import { useAuth } from '../context/AuthContext';


 const autorisations = {
        super_admin : 'Superadmin',
        admin_validation: 'Admin Validation',
        admin_moderation: 'Admin Modération'
    }
const INITIAL_FORM_STATE = {
    utilisateur: '',
    niveau_autorisation: '',
    departement: ''
};

function Admin() {
    
const { adminRole, name, email,codeAdmin,adminId  } = useAuth(); 
    const [formData,setFormData] = useState({
        utilisateur:'',
        niveau_autorisation:'',
        departement:''
    })

    const [listAdmin,setListAdmin] = useState([]);
    const [listUser, setListUser]  = useState([]);
    const [code_admin,setcode_admin] = useState(codeAdmin);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isEditing, setIsEditing] = useState(false);
    

    useEffect(()=>{
        fetchListAdmin();
        fetchListUsers();
    },[])

   
    const fetchListAdmin = async () => {
        const data = await getAllAdmin()
        setListAdmin(data.list)
    }
    const createAdmin = async (manipulateur,formData) => {
        await creation_admin( manipulateur,formData )
    }

    const removeAdmin = async (code_admin) => {
        await deleteAdmin(code_admin)
        fetchListAdmin()
    }
    const fetchToModify = (rowdata) => {
        setFormData({
            utilisateur: parseInt(rowdata.utilisateur.id),
            niveau_autorisation:rowdata.niveau_autorisation,
            departement:rowdata.departement
        })
        setcode_admin(rowdata.code_admin);
        setIsEditing(true);
        setIsModalOpen(true);
        
    }
    const modifyAdmin = async (adminCode,codeManipulateur,form) => {
        const data = await updateAdmin(adminCode,codeManipulateur,form)
        return data
    }
   
    const fetchListUsers = async () => {
        const data = await getAllUsers()
        setListUser(data)
    }

    const handleChange = (e) => {
    setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
    }));
};

const onSubmit = (e) => {
    e.preventDefault();
    createAdmin(adminId,formData);
    resetValues();
    fetchListAdmin();
}
const onEdit = (e) => {
    e.preventDefault();
    modifyAdmin(code_admin,"ut0001",formData);
    setIsEditing(false);
    setIsModalOpen(false);
    fetchListAdmin()
}
const resetValues = () => {
    setFormData(INITIAL_FORM_STATE);
    setcode_admin("");
    setIsEditing(false);
    setIsModalOpen(false);
}
const handleOpenModal = () => {
        resetValues();
        setIsModalOpen(true);
        setIsEditing(false);
}

  return (
     <div className="flex h-screen bg-gray-50">
    <Menu
        email={email}
        name={name}
        role={adminRole}
    />
    <div className="right-pane flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Liste des administrateurs</h2>
        <div className="top-table-section">

            <button  
                onClick={handleOpenModal}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-150">
                <Plus /> <span>Ajouter un administrateur</span>
            </button>
        </div>
        <div className="bottom-table-section bg-white rounded-xl shadow-lg overflow-hidden mt-6">
             <div className='Utilisateur-table' style={{overflow:"scroll",height:"70vh"}}>
            <table className="info-table w-full border-collapse">
                <thead>
                    <tr>
                        
                            <th>#</th>
                            <th>Code admin</th>
                            <th>Utilisateur associé</th>
                            <th>Niveau d'autorisation</th>
                            <th>Département</th>
                            <th>Créé par</th>
                            <th>Créé le</th>
                            <th>Modifié par</th>
                            <th>Modifié le</th>
                            <th></th>
                            <th></th>
                        
                    </tr>
                </thead>
                <tbody>
                {
                    listAdmin.map((admin,adminIndex)=>(
                        <tr key= {adminIndex}>
                            <td>{adminIndex+1}</td>
                            <td>{admin.code_admin}</td>
                            <td>{admin.utilisateur.email}</td>
                            <td>{autorisations[admin.niveau_autorisation]}</td>
                            <td>{admin.departement}</td>
                            <td>{admin.created_by}</td>
                            <td><span style={{ whiteSpace: "pre-line" }}>{europeanDate(admin.created_at)}</span></td>
                            <td>{admin.modified_by}</td>
                            <td><span style={{ whiteSpace: "pre-line" }}>{europeanDate(admin.modified_at)}</span></td>
                            <td>
                                <button onClick={()=>fetchToModify(admin)} className='edit-button'>
                                    <SquarePen size={18} strokeWidth={1.25} />
                                </button>
                            </td>
                            <td>
                                <button onClick={() => removeAdmin(admin.code_admin)} className='delete-button'>
                                    <Trash size={18} strokeWidth={1.25} />
                                </button>
                            </td>
                        </tr>
                    ))

                }
                </tbody>
            </table>
            {listAdmin.length === 0 && (
                        <p className="text-center text-gray-500 py-6">Aucun administrateur trouvé.</p>
                    )}
            </div>
        </div>
         {isModalOpen && (
                    <div className='form-modal'>
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
                            
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-6 border-b pb-3">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {isEditing ? "Modification" : "Ajout"} d'un administrateur
                                </h3>
                                <button onClick={resetValues} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form method='POST' className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Code administrateur</label>
                                    <input 
                                        type="text" 
                                        value={code_admin} 
                                        readOnly={true} 
                                        className="w-full select bg-gray-100 cursor-not-allowed" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur associé</label>
                                    <select key={`user-select-${formData.utilisateur}`} name="utilisateur" onChange={handleChange} value={formData.utilisateur} className="w-full select">
                                        <option value="">--Sélectionner--</option>
                                        {listUser.map((user) => (
                                            <option value={user.id} key={user.id}>
                                                {user.nom_complet}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'autorisation</label>
                                    <select name="niveau_autorisation" onChange={handleChange} value={formData.niveau_autorisation} className="w-full select">
                                        <option value="">--Sélectionner--</option>
                                        {Object.entries(autorisations).map(([key, label]) => (
                                            <option key={key} value={key} >
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                                    <input 
                                        type="text" 
                                        name="departement" 
                                        value={formData.departement} 
                                        onChange={handleChange} 
                                        className="w-full select" 
                                        placeholder="Ex: RH, Commercial"
                                    />
                                </div>

                                {/* Form Action Buttons */}
                                <div className="pt-4 flex justify-end space-x-3">
                                    <button 
                                        type="button" 
                                        onClick={resetValues} 
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    {isEditing ? (
                                        <button 
                                            type="submit" 
                                            onClick={onEdit} 
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            Modifier l'administrateur
                                        </button>
                                    ) : (
                                        <button 
                                            type="submit" 
                                            onClick={onSubmit} 
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Créer l'administrateur
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
    </div>
    </div> 
    
  )
}

export default Admin