// modules/chomeurs/pages/ProfilChomeur.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Briefcase, Award,
    TrendingUp, Send, Edit2, Plus, Coins,
    Calendar, CheckCircle, Star, ArrowRight, Eye, Clock
} from 'lucide-react';

// API
import { getMonProfil } from '@/modules/chomeurs/api/chomeur.api';
import { getCandidatureStats } from '@/modules/candidatures/api/candidatures.api';

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

export default function ProfilChomeur() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('apercu');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                getCandidatureStats()
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
        { id: 'exploits', label: 'Exploits', icon: TrendingUp },
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
                {/* Header Profile */}
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
                                        {utilisateur.nom_complet}
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-2">
                                        {profil?.profession || 'Profession non renseignée'}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {getNiveauBadge(profil?.niveau_expertise).label && (
                                            <Badge variant={profil?.niveau_expertise}>
                                                {getNiveauBadge(profil?.niveau_expertise).label}
                                            </Badge>
                                        )}
                                        <span className="text-sm text-gray-500">
                                            • Code: {profil?.code_chomeur}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="primary"
                                    icon={Edit2}
                                    onClick={() => navigate('/chomeur/parametres')}
                                >
                                    Modifier
                                </Button>
                            </div>

                            <p className="text-gray-700 mb-4">
                                {profil?.description || 'Aucune description'}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm">{utilisateur.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm">{utilisateur.telephone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
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

                {/* Tabs Navigation */}
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

                {/* Tab Content */}
                <div className="space-y-6">
                    {/* APERÇU */}
                    {activeTab === 'apercu' && (
                        <>
                            {/* Stats candidatures */}
                            {candidatureStats && (
                                <Card>
                                    <SectionHeader icon={Send} title="Mes candidatures" />
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <StatCard icon={Briefcase} label="Total" value={candidatureStats.total} color="gray" />
                                        <StatCard icon={Clock} label="En attente" value={candidatureStats.en_attente} color="yellow" />
                                        <StatCard icon={Eye} label="Vues" value={candidatureStats.vue} color="blue" />
                                        <StatCard icon={CheckCircle} label="Acceptées" value={candidatureStats.acceptee} color="green" />
                                        <StatCard icon={Star} label="Entretiens" value={candidatureStats.entretien} color="purple" />
                                    </div>
                                </Card>
                            )}

                            {/* Actions rapides */}
                            <Card>
                                <SectionHeader icon={ArrowRight} title="Actions rapides" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                                    <button
                                        onClick={() => navigate('/chomeur/jetons')}
                                        className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors flex items-center gap-3"
                                    >
                                        <div className="p-3 bg-yellow-100 rounded-lg">
                                            <Coins className="w-6 h-6 text-yellow-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-800">Acheter jetons</p>
                                            <p className="text-sm text-gray-600">Recharger</p>
                                        </div>
                                    </button>
                                </div>
                            </Card>

                            {/* Dernières candidatures */}
                            <Card>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Dernières candidatures</h2>
                                    <button
                                        onClick={() => setActiveTab('candidatures')}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                    >
                                        Voir tout
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {candidatures.slice(0, 3).map(cand => {
                                        const statutInfo = getStatutInfo(cand.statut);
                                        return (
                                            <div key={cand.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{cand.offre?.titre}</h3>
                                                        <p className="text-sm text-gray-600">{cand.offre?.entreprise}</p>
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
                            </Card>
                        </>
                    )}

                    {/* COMPÉTENCES */}
                    {activeTab === 'competences' && (
                        <Card>
                            <SectionHeader
                                icon={Award}
                                title="Mes compétences"
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
                                        Aucune compétence ajoutée
                                    </div>
                                ) : (
                                    competences.map(comp => (
                                        <CompetenceCard key={comp.id} competence={comp} showActions={false} />
                                    ))
                                )}
                            </div>
                        </Card>
                    )}

                    {/* EXPLOITS */}
                    {activeTab === 'exploits' && (
                        <Card>
                            <SectionHeader
                                icon={TrendingUp}
                                title="Portfolio"
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
                                        Aucun projet ajouté
                                    </div>
                                ) : (
                                    exploits.map(exploit => (
                                        <ExploitCard key={exploit.id} exploit={exploit} showActions={false} />
                                    ))
                                )}
                            </div>
                        </Card>
                    )}

                    {/* CANDIDATURES */}
                    {activeTab === 'candidatures' && (
                        <Card>
                            <SectionHeader icon={Send} title="Toutes mes candidatures" />
                            <div className="space-y-4">
                                {candidatures.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        Aucune candidature
                                    </div>
                                ) : (
                                    candidatures.map(cand => {
                                        const statutInfo = getStatutInfo(cand.statut);
                                        return (
                                            <div key={cand.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-bold text-gray-800">{cand.offre?.titre}</h3>
                                                            <Badge variant={cand.statut}>
                                                                {statutInfo.label}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-1">{cand.offre?.entreprise}</p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Briefcase className="w-3 h-3" />
                                                                {cand.offre?.type_contrat}
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
        </ChomeurLayout>
    );
}