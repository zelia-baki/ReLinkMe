import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import './Login.css'
import { login_admin } from '../api/LoginApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Define the shape of the initial form state
const INITIAL_FORM_STATE = {
    email: '',
    password: '',
};

const INITIAL_ERROR_STATE = {
    email: '',
    password: '',
    apiError: '',
};




const Login = () => {
    const {login} = useAuth();
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState(INITIAL_ERROR_STATE);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
       
        if (errors.apiError) {
            setErrors(prev => ({ ...prev, apiError: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        let newErrors = INITIAL_ERROR_STATE;

        if (!formData.email.trim()) {
            newErrors.email = 'Veuillez entrer votre email.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide.';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Veuillez entrer votre mot de passe.';
            isValid = false;
        } 

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(INITIAL_ERROR_STATE);

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await login_admin(formData)
            
            if (result.success) {
                console.log("Login successful:", result);
                setFormData(INITIAL_FORM_STATE);
                login(
                    result.role,
                    result.id,
                    result.code_admin,
                    result.nom_complet,
                    result.email
                )
                setErrors(prev => ({ ...prev, apiError: 'Connexion réussie ! Redirection...' }));
                navigate("/admin/utilisateur");

            } else {
                setErrors(prev => ({ ...prev, apiError: result.message }));
            }
        } catch (error) {
            console.error("Login API error:", error);
            setErrors(prev => ({ ...prev, apiError: 'Erreur réseau. Impossible de se connecter.' }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">
                        Connexion Administrateur
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Accédez au tableau de bord
                    </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Global Error Display */}
                        {errors.apiError && (
                            <div className={`p-3 rounded-lg text-sm font-medium ${errors.apiError.includes('réussie') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {errors.apiError}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`input pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`}
                                    required
                                    disabled={isLoading}
                                />
                                
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`input pl-10 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`}
                                    required
                                    disabled={isLoading}
                                />
                                
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Se connecter
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
