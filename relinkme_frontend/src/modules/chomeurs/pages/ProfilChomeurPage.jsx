// modules/chomeurs/pages/ProfilChomeurPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Briefcase, Award,
    TrendingUp, Send, Edit2, Plus, Coins,
    Calendar, CheckCircle, Star, ArrowRight, Eye, Clock,
    X, Save, Loader2
} from 'lucide-react';

// API
import { getMonProfil } from '@/modules/chomeurs/api/chomeur.api';
import { getCandidatureStats } from '@/modules/candidatures/api/candidatures.api';
import axios from '@/services/axiosInstance';

// Utils
import { getInitials, formatDate, getStatutInfo, getNiveauBadge } from '@/modules/chomeurs/utils/helpers';

// Layout et Composants
import ChomeurLayout from '@/modules/chomeurs/layouts/ChomeurLayout';
import Card from '@/modules/chomeurs/components/Card';
import Button from '@/modules/chomeurs/components/Button';
import Badge from '@/modules/chomeurs/components/Badge';
import SectionHeader from '@/modules/chomeurs/components/SectionHeader';
import StatCard from '@/modules/chomeurs/components/StatCard';
import CompetenceCard from '@/modules/chomeurs/components/CompetenceCard';
import ExploitCard from '@/modules/chomeurs/components/ExploitCard';


// ============================================================
// Modal de modification du profil
// ============================================================
function EditProfilModal({ isOpen, onClose, profil, onSaved }) {
    const [formData, setFormData] = useState({
        nom_complet: '',
        telephone: '',
        localisation: '',
        profession: '',
        description: '',
        niveau_expertise: 'débutant',
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (profil && isOpen) {
            setFormData({
                nom_complet: profil.utilisateur?.nom_complet || '',
                telephone: profil.utilisateur?.telephone || '',
                localisation: profil.utilisateur?.localisation || '',
                profession: profil.profession || '',
                description: profil.description || '',
                niveau_expertise: profil.niveau_expertise || 'débutant',
            });
            setErrors({});
        }
    }, [profil, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.patch('/chomeur/mon-profil/', formData);
            onSaved();
            onClose();
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                setErrors(data.errors);
            } else {
                setErrors({ general: 'Une erreur est survenue, veuillez réessayer.' });
            }
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Edit2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Modifier mon profil</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {errors.general}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom complet
                        </label>
                        <input
                            type="text"
                            name="nom_complet"
                            value={formData.nom_complet}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone
                            </label>
                            <input
                                type="text"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+261 XX XXX XXX"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Localisation
                            </label>
                            <input
                                type="text"
                                name="localisation"
                                value={formData.localisation}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Antananarivo, Madagascar"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profession
                        </label>
                        <input
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: Développeur Full Stack"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Niveau d'expertise
                        </label>
                        <select
                            name="niveau_expertise"
                            value={formData.niveau_expertise}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="débutant">Débutant</option>
                            <option value="intermédiaire">Intermédiaire</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description / Présentation
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Parlez de vous, vos expériences, vos objectifs..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-white transition-colors ${
                                saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {saving ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
                            ) : (
                                <><Save className="w-4 h-4" /> Enregistrer</>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// ============================================================
// Page Profil Chômeur
// ============================================================
export default function ProfilChomeurPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('apercu');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [profil, setProfil] = useState(null);
    const [competences, setCompetences] = useState([]);
    const [exploits, setExploits] = useState([]);
    const [candidatures, setCandidatures] = useState([]);
    const [stats, setStats] = useState(null);
    const [candidatureStats, setCandidatureStats] = useState(null);

    useEffect(() => {
        fetchProfilData();
    }, []);

    const fetchProfilData = async () => {
        try {
            setLoading(true);
            const [profilData, statsCandidat] = await Promise.all([
                getMonProfil(),
                getCandidatureStats().catch(() => null)
            ]);

            setProfil(profilData.profil);
            setCompetences(profilData.competences || []);
            setExploits(profilData.exploits || []);
            setCandidatures(profilData.candidatures || []);
            setStats(profilData.statistiques || {});
            setCandidatureStats(statsCandidat);

        } catch (err) {
            console.error('Erreur:', err);
            setError('Impossible de charger le profil');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'apercu', label: 'Aperçu', icon: User },
        { id: 'competences', label: 'Compétences', icon: Award },
        { id: 'exploits', label: 'Portfolio', icon: TrendingUp },
        { id: 'candidatures', label: 'Candidatures', icon: Send }
    ];

    if (loading) {
        return (
            <ChomeurLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement du profil...</p>
                    </div>
                </div>
            </ChomeurLayout>
        );
    }

    if (error) {
        return (
            <ChomeurLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </ChomeurLayout>
        );
    }

    const utilisateur = profil?.utilisateur || {};

    return (
        <ChomeurLayout>
            <div className="max-w-7xl mx-auto p-6">

                {/* ===== HEADER PROFILE ===== */}
                <Card className="mb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                {getInitials(utilisateur.nom_complet || 'User')}
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 mb-1">
                                        {utilisateur.nom_complet || 'Nom non renseigné'}
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-2">
                                        {profil?.profession || 'Profession non renseignée'}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {profil?.niveau_expertise && (
                                            <Badge variant={profil.niveau_expertise}>
                                                {getNiveauBadge(profil.niveau_expertise).label}
                                            </Badge>
                                        )}
                                        <span className="text-sm text-gray-500">
                                            • Code: {profil?.code_chomeur}
                                        </span>
                                    </div>
                                </div>
                                {/* ✅ Bouton Modifier → ouvre la modal */}
                                <Button
                                    variant="primary"
                                    icon={Edit2}
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    Modifier
                                </Button>
                            </div>

                            <p className="text-gray-700 mb-4">
                                {profil?.description || 'Aucune description renseignée'}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm truncate">{utilisateur.email || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm">{utilisateur.telephone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm">{utilisateur.localisation || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Coins className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-semibold">
                                        {profil?.solde_jetons || 0} jetons
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* ===== TABS ===== */}
                <Card noPadding className="mb-6 overflow-x-auto">
                    <div className="flex">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 min-w-max px-6 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </Card>

                {/* ===== TAB CONTENT ===== */}
                <div className="space-y-6">

                    {/* ── APERÇU ── */}
                    {activeTab === 'apercu' && (
                        <>
                            {/* Stats candidatures */}
                            {candidatureStats && (
                                <Card>
                                    <SectionHeader icon={Send} title="Mes candidatures" />
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <StatCard icon={Briefcase} label="Total" value={candidatureStats.total || 0} color="gray" />
                                        <StatCard icon={Clock} label="En attente" value={candidatureStats.en_attente || 0} color="yellow" />
                                        <StatCard icon={Eye} label="Vues" value={candidatureStats.vue || 0} color="blue" />
                                        <StatCard icon={CheckCircle} label="Acceptées" value={candidatureStats.acceptee || 0} color="green" />
                                        <StatCard icon={Star} label="Entretiens" value={candidatureStats.entretien || 0} color="purple" />
                                    </div>
                                </Card>
                            )}

                            {/* Actions rapides */}
                            <Card>
                                <SectionHeader icon={ArrowRight} title="Actions rapides" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* ✅ Postuler → liste des offres */}
                                    <button
                                        onClick={() => navigate('/offres')}
                                        className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-3"
                                    >
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <Send className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-800">Postuler</p>
                                            <p className="text-sm text-gray-600">Parcourir les offres</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => navigate('/chomeur/candidatures')}
                                        className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-3"
                                    >
                                        <div className="p-3 bg-green-100 rounded-lg">
                                            <Briefcase className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-800">Mes candidatures</p>
                                            <p className="text-sm text-gray-600">Suivre mes postulations</p>
                                        </div>
                                    </button>

                                    {/* ✅ Modifier compétences */}
                                    <button
                                        onClick={() => navigate('/chomeur/competences')}
                                        className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-3"
                                    >
                                        <div className="p-3 bg-purple-100 rounded-lg">
                                            <Award className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-800">Mes compétences</p>
                                            <p className="text-sm text-gray-600">Gérer mes compétences</p>
                                        </div>
                                    </button>
                                </div>
                            </Card>

                            {/* Aperçu compétences */}
                            {competences.length > 0 && (
                                <Card>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            Compétences ({competences.length})
                                        </h2>
                                        <button
                                            onClick={() => setActiveTab('competences')}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                        >
                                            Voir tout <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {competences.slice(0, 8).map(comp => (
                                            <span
                                                key={comp.id}
                                                className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-sm font-medium"
                                            >
                                                {comp.competence_nom || comp.competence?.libelle}
                                            </span>
                                        ))}
                                        {competences.length > 8 && (
                                            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">
                                                +{competences.length - 8} autres
                                            </span>
                                        )}
                                    </div>
                                </Card>
                            )}

                            {/* Dernières candidatures */}
                            <Card>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Dernières candidatures</h2>
                                    <button
                                        onClick={() => navigate('/chomeur/candidatures')}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                    >
                                        Voir tout <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                                {candidatures.length === 0 ? (
                                    <div className="text-center py-6 text-gray-500">
                                        <Send className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                        <p>Aucune candidature pour le moment</p>
                                        <button
                                            onClick={() => navigate('/offres')}
                                            className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                        >
                                            Parcourir les offres →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {/* ✅ Utilise les bons champs de CandidatureListSerializer */}
                                        {candidatures.slice(0, 3).map(cand => {
                                            const statutInfo = getStatutInfo(cand.statut);
                                            return (
                                                <div key={cand.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => navigate(`/chomeur/candidatures/${cand.id}`)}>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">
                                                                {cand.offre_titre || 'Offre non renseignée'}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {cand.recruteur_nom || 'Entreprise'}
                                                            </p>
                                                        </div>
                                                        <Badge variant={cand.statut}>
                                                            {statutInfo.label}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(cand.date_postulation)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Coins className="w-3 h-3" />
                                                            {cand.jetons_utilises} jetons
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </Card>
                        </>
                    )}

                    {/* ── COMPÉTENCES ── */}
                    {activeTab === 'competences' && (
                        <Card>
                            <SectionHeader
                                icon={Award}
                                title="Mes compétences"
                                subtitle={`${competences.length} / 20 compétences`}
                                action={
                                    <Button
                                        variant="primary"
                                        icon={Plus}
                                        onClick={() => navigate('/chomeur/competences')}
                                    >
                                        Gérer
                                    </Button>
                                }
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {competences.length === 0 ? (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p>Aucune compétence ajoutée</p>
                                        <button
                                            onClick={() => navigate('/chomeur/competences')}
                                            className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                        >
                                            Ajouter des compétences →
                                        </button>
                                    </div>
                                ) : (
                                    competences.map(comp => (
                                        <CompetenceCard key={comp.id} competence={comp} showActions={false} />
                                    ))
                                )}
                            </div>
                        </Card>
                    )}

                    {/* ── PORTFOLIO / EXPLOITS ── */}
                    {activeTab === 'exploits' && (
                        <Card>
                            <SectionHeader
                                icon={TrendingUp}
                                title="Mon Portfolio"
                                subtitle={`${exploits.length} projet(s)`}
                                action={
                                    <Button
                                        variant="secondary"
                                        icon={Plus}
                                        onClick={() => navigate('/chomeur/exploits')}
                                    >
                                        Gérer
                                    </Button>
                                }
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {exploits.length === 0 ? (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p>Aucun projet ajouté</p>
                                        <button
                                            onClick={() => navigate('/chomeur/exploits')}
                                            className="mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm"
                                        >
                                            Ajouter un projet →
                                        </button>
                                    </div>
                                ) : (
                                    exploits.map(exploit => (
                                        <ExploitCard key={exploit.id} exploit={exploit} showActions={false} />
                                    ))
                                )}
                            </div>
                        </Card>
                    )}

                    {/* ── CANDIDATURES ── */}
                    {activeTab === 'candidatures' && (
                        <Card>
                            <div className="flex items-center justify-between mb-6">
                                <SectionHeader icon={Send} title="Toutes mes candidatures" />
                                <Button
                                    variant="primary"
                                    icon={Plus}
                                    onClick={() => navigate('/offres')}
                                >
                                    Postuler
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {candidatures.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p>Aucune candidature</p>
                                        <button
                                            onClick={() => navigate('/offres')}
                                            className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                        >
                                            Voir les offres →
                                        </button>
                                    </div>
                                ) : (
                                    candidatures.map(cand => {
                                        const statutInfo = getStatutInfo(cand.statut);
                                        return (
                                            <div key={cand.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="font-bold text-gray-800">
                                                                {cand.offre_titre || 'Offre non renseignée'}
                                                            </h3>
                                                            <Badge variant={cand.statut}>
                                                                {statutInfo.label}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-1">
                                                            {cand.recruteur_nom || 'Entreprise'}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Briefcase className="w-3 h-3" />
                                                                {cand.offre_type_contrat || '—'}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {formatDate(cand.date_postulation)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Coins className="w-3 h-3 text-yellow-500" />
                                                                {cand.jetons_utilises} jetons
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        icon={Eye}
                                                        size="sm"
                                                        onClick={() => navigate(`/chomeur/candidatures/${cand.id}`)}
                                                    >
                                                        Voir
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* ===== MODAL EDIT PROFIL ===== */}
            <EditProfilModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profil={profil}
                onSaved={fetchProfilData}
            />
        </ChomeurLayout>
    );
}