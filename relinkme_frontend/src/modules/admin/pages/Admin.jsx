import React, { useEffect, useState } from 'react'
import {creation_admin, getAllAdmin, getAdminById, deleteAdmin, updateAdmin} from '@/modules/admin/api/AdminApi.js'
import  {SlidersHorizontal,Plus,Trash, SquarePen} from 'lucide-react'
import { getAllUsers } from '../api/AdminApi';

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
    const [formData,setFormData] = useState({
        utilisateur:'',
        niveau_autorisation:'',
        departement:''
    })
    const [manipulateur,setManipulateur] = useState("");
    const [listAdmin,setListAdmin] = useState([]);
    const [listUser, setListUser]  = useState([]);
    const [codeAdmin,setCodeAdmin] = useState("");
    const [idUtilisateur, setIdUtilisateur] = useState(null);

    useEffect(()=>{
        fetchListAdmin();
        fetchListUsers();
    },[])

   
    const fetchListAdmin = async () => {
        const data = await getAllAdmin()
        setListAdmin(data.list)
        console.log(data.list)
    }
    const createAdmin = async (manipulateur,formData) => {
        const data = await creation_admin( manipulateur,formData )
    }

    const removeAdmin = async (codeAdmin) => {
        const data = await deleteAdmin(codeAdmin)
        fetchListAdmin()
    }
    const fetchToModify = (rowdata) => {
        setFormData({
            utilisateur: parseInt(rowdata.utilisateur),
            niveau_autorisation:rowdata.niveau_autorisation,
            departement:rowdata.departement
        })
        setCodeAdmin(rowdata.code_admin);
        
    }
    const modifyAdmin = async (adminCode,codeManipulateur,form) => {
        const data = await updateAdmin(adminCode,codeManipulateur,form)
        return data
    }
    const fetchSingleAdmin = async(codeAdmin) => {
        const data = await getAdminById(codeAdmin)
        setListAdmin(data)
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
    const response = createAdmin(1,formData);
    console.log(response);
    resetValues();
}
const onEdit = (e) => {
    e.preventDefault();
    const response = modifyAdmin(codeAdmin,"ut0001",formData);
    console.log(codeAdmin+" "+formData.utilisateur)
    fetchListAdmin()
}
const resetValues = () => {
    setFormData(INITIAL_FORM_STATE);
    setCodeAdmin("");
}
  return (
    <div className="right-pane">
        <h2 className="title">Liste des administrateurs</h2>
        <div className="top-table-section">
            <button>
                <SlidersHorizontal /> Filtres
            </button>
            <button>
                <Plus /> Ajouter un administrateur
            </button>
        </div>
        <div className="table-section">
            <table className='w-full border-collapse'>
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
                            <td>{admin.utilisateur}</td>
                            <td>{admin.niveau_autorisation}</td>
                            <td>{admin.departement}</td>
                            <td>{admin.created_by}</td>
                            <td>{admin.created_at}</td>
                            <td>{admin.modified_by}</td>
                            <td>{admin.modified_at}</td>
                            <td>
                                <button onClick={()=>fetchToModify(admin)}>
                                    <SquarePen size={18} strokeWidth={1.25} />
                                </button>
                            </td>
                            <td>
                                <button onClick={() => removeAdmin(admin.code_admin)}>
                                    <Trash size={18} strokeWidth={1.25} />
                                </button>
                            </td>
                        </tr>
                    ))

                }
                </tbody>
            </table>
        </div>
        <div className='form-modal'>
            <div>Ajout/Modification d'un administrateur</div>
            <form method='POST'>
                <label>Code administrateur</label>
                <input type="text" value={codeAdmin} readOnly={true}/>
                <label>Utilisateur associé</label>
                <select name="utilisateur" onChange={handleChange} value={formData.utilisateur}>
                    <option value="">--Sélectionner--</option>
                    {
                        listUser.map((user,userIndex)=>(
                            <option value={user.id} key={userIndex}>
                               
                                    {user.photo_profil}
                                    {user.nom_complet}
                                
                            </option>
                        ))
                    }
                    
                </select>
                <label>Niveau d'autorisation</label>
                <select name="niveau_autorisation" onChange={handleChange} value={formData.niveau_autorisation}>
                    <option value="">--Sélectionner--</option>
                    {Object.entries(autorisations).map(([key, label]) => (
                        <option key={key} value={key} >
                            {label}
                        </option>
                    ))}
                </select>
                <label>Département</label>
                <input type="text" name="departement" value={formData.departement} onChange={handleChange}/>
                <input type="submit" value="Créer l'administrateur" onClick={onSubmit}/>
                <input type="submit" value="Modifier l'administrateur" onClick={onEdit}/>
            </form>
        </div>
    </div>
        
    
  )
}

export default Admin