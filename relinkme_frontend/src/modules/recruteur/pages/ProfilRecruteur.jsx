// modules/recruteurs/pages/ProfilRecruteur.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Mail, Phone, MapPin, Globe, 
  Briefcase, FileText, Plus, Edit2, 
  CheckCircle, XCircle, Calendar, Eye,
  Users, TrendingUp, Clock
} from 'lucide-react';
import { getMonProfilRecruteur } from '../api/recruteur.api';
import { 
  getInitials, 
  formatDate, 
  getStatutOffreInfo,
  getTailleEntrepriseBadge,
  formatTelephone,
  formatSiteWeb,
  getAvatarColor,
  truncateText
} from '@/modules/recruteur/utils/helpers';
import StatCard from '../components/StatCard';

export default function ProfilRecruteur() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('apercu');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [profil, setProfil] = useState(null);
  const [offres, setOffres] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchProfilData();
  }, []);

  const fetchProfilData = async () => {
    try {
      setLoading(true);
      const data = await getMonProfilRecruteur();
      
      setProfil(data.profil);
      setOffres(data.offres || []);
      setStats(data.statistiques || {});
      
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'apercu', label: 'Aperçu', icon: Building2 },
    { id: 'offres', label: 'Mes offres', icon: Briefcase },
    { id: 'infos', label: 'Informations', icon: FileText }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const utilisateur = profil?.utilisateur || {};
  const tailleBadge = getTailleEntrepriseBadge(profil?.nombre_employes);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className={`w-32 h-32 bg-gradient-to-br ${getAvatarColor(profil?.nom_entreprise)} rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg`}>
                {getInitials(profil?.nom_entreprise || 'Entreprise')}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">
                    {profil?.nom_entreprise || 'Entreprise'}
                  </h1>
                  <p className="text-lg text-gray-600 mb-2">
                    {profil?.secteur_activite || 'Secteur non renseigné'}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${tailleBadge.color}`}>
                      {tailleBadge.label} - {profil?.nombre_employes || 0} employés
                    </span>
                    <span className="text-sm text-gray-500">• Code: {profil?.code_recruteur}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                      {profil?.type_recruteur === 'entreprise' ? '🏢 Entreprise' : '👤 Individuel'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/recruteur/parametres')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </button>
              </div>

              <p className="text-gray-700 mb-4">
                {profil?.description || 'Aucune description de l\'entreprise'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {utilisateur.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{utilisateur.email}</span>
                  </div>
                )}
                {utilisateur.telephone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{formatTelephone(utilisateur.telephone)}</span>
                  </div>
                )}
                {profil?.site_web && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={formatSiteWeb(profil.site_web)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:underline"
                    >
                      Site web
                    </a>
                  </div>
                )}
                {utilisateur.localisation && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{utilisateur.localisation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-x-auto">
          <div className="flex">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max px-6 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* APERÇU */}
          {activeTab === 'apercu' && (
            <>
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  icon={Briefcase} 
                  label="Total offres" 
                  value={stats?.offres_total || 0} 
                  color="blue" 
                  onClick={() => setActiveTab('offres')}
                />
                <StatCard 
                  icon={CheckCircle} 
                  label="Offres actives" 
                  value={stats?.offres_actives || 0} 
                  color="green" 
                />
                <StatCard 
                  icon={Clock} 
                  label="Offres inactives" 
                  value={stats?.offres_inactives || 0} 
                  color="yellow" 
                />
                <StatCard 
                  icon={XCircle} 
                  label="Offres fermées" 
                  value={stats?.offres_fermees || 0} 
                  color="red" 
                />
              </div>

              {/* Actions rapides */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Actions rapides</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => navigate('/recruteur/offres/nouvelle')}
                    className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-3"
                  >
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Plus className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Nouvelle offre</p>
                      <p className="text-sm text-gray-600">Publier un poste</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/recruteur/candidatures')}
                    className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-3"
                  >
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Candidatures</p>
                      <p className="text-sm text-gray-600">Gérer les CV</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('offres')}
                    className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-3"
                  >
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Briefcase className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Mes offres</p>
                      <p className="text-sm text-gray-600">Voir toutes</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dernières offres */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Dernières offres publiées</h2>
                  <button 
                    onClick={() => setActiveTab('offres')}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                  >
                    Voir tout
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {offres.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Aucune offre publiée</p>
                    </div>
                  ) : (
                    offres.map(offre => {
                      const statutInfo = getStatutOffreInfo(offre.statut);
                      return (
                        <div key={offre.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{offre.titre}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {truncateText(offre.description, 100)}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ml-3 ${statutInfo.color}`}>
                              {statutInfo.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {offre.type_contrat}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(offre.date_creation)}
                            </span>
                            <button 
                              onClick={() => navigate(`/recruteur/offres/${offre.id}`)}
                              className="ml-auto text-purple-600 hover:text-purple-700 flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Voir
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}

          {/* MES OFFRES */}
          {activeTab === 'offres' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Toutes mes offres</h2>
                <button 
                  onClick={() => navigate('/recruteur/offres/nouvelle')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle offre
                </button>
              </div>
              <div className="space-y-4">
                {offres.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">Aucune offre publiée</p>
                    <p className="text-sm">Commencez par créer votre première offre d'emploi</p>
                  </div>
                ) : (
                  offres.map(offre => {
                    const statutInfo = getStatutOffreInfo(offre.statut);
                    return (
                      <div key={offre.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-gray-800">{offre.titre}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statutInfo.color}`}>
                                {statutInfo.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{offre.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                {offre.type_contrat}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Publié le {formatDate(offre.date_creation)}
                              </span>
                              {offre.date_limite && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Date limite: {formatDate(offre.date_limite)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => navigate(`/recruteur/offres/${offre.id}`)}
                              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => navigate(`/recruteur/offres/modifier/${offre.id}`)}
                              className="px-3 py-1 text-sm text-green-600 hover:text-green-700 border border-green-300 rounded hover:bg-green-50"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* INFORMATIONS */}
          {activeTab === 'infos' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Informations de l'entreprise</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Nom de l'entreprise</label>
                    <p className="text-gray-800 font-semibold">{profil?.nom_entreprise || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Code recruteur</label>
                    <p className="text-gray-800 font-semibold">{profil?.code_recruteur || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Secteur d'activité</label>
                    <p className="text-gray-800">{profil?.secteur_activite || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Nombre d'employés</label>
                    <p className="text-gray-800">{profil?.nombre_employes || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Type de recruteur</label>
                    <p className="text-gray-800 capitalize">{profil?.type_recruteur || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Site web</label>
                    {profil?.site_web ? (
                      <a 
                        href={formatSiteWeb(profil.site_web)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        {profil.site_web}
                      </a>
                    ) : (
                      <p className="text-gray-800">-</p>
                    )}
                  </div>
                </div>

                {profil?.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Description</label>
                    <p className="text-gray-800 leading-relaxed">{profil.description}</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations du compte</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                      <p className="text-gray-800">{utilisateur.email || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Téléphone</label>
                      <p className="text-gray-800">{formatTelephone(utilisateur.telephone) || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Localisation</label>
                      <p className="text-gray-800">{utilisateur.localisation || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Membre depuis</label>
                      <p className="text-gray-800">{formatDate(profil?.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}