import React, {useEffect, useState} from 'react'
import { useAuth } from '../context/AuthContext';
import { ResponsiveLine } from '@nivo/line';
import axios from "@/services/axiosInstance";
import { ClockFading,BriefcaseBusiness,ShieldUser,FileUser,OctagonAlert, MapPin,ChartColumn } from 'lucide-react';
import './dashboard.css'
import { getStats } from '../api/AdminApi';
import {europeanDate, formatForNivo} from '../utilities';
import Menu from '../components/Menu';

function Dashboard() {
    const { adminRole, name, email, codeAdmin,idAdmin  } = useAuth()
    const [greetings,setGreetings] = useState("");
    const [statistics, setStatistics] = useState([])
    const [history,setListHistory] = useState([]);
    const [chartData,setChartData] = useState([]);

    const adminInfo = {
        codeAdmin: codeAdmin,
        idAdmin: idAdmin
    
    }

    useEffect(()=>{
        checkDay();
        getStatistics();
        fetchListHistory();
        fetchStats();
    },[])

    const checkDay = () =>{
        var hourNow = new Date().getHours();
        if(hourNow < 17) setGreetings(`Bonjour ${name}!`) 
        else setGreetings(`Bonsoir ${name}!`)
    }
    
    const getStatistics = async () =>{
        try{
            const data = await getStats();
            setStatistics(data[0]);
        }catch(error) {
            console.error("Error fetching demande:", error);
        }
    }
    const fetchListHistory = async () =>{
            try{
                const {data} = await axios.get(`admin/historique/${adminInfo["codeAdmin"]}?admin=0`)
                setListHistory(data.list.slice(0, 5));
            }catch (error) {
                console.error("Erreur de récupération des historiques:", error.response?.data || error.message);
            }
        }
const fetchStats = async () => {
    try {
        const [offreRes, candidatureRes] = await Promise.all([
            axios.get(`admin/stats/offre`),
            axios.get(`admin/stats/candidature`)
        ]);

        const offre = offreRes.data.list;   
        const candidature = candidatureRes.data.list;

        const formatted = formatForNivo(offre, candidature);
        setChartData(formatted);

    } catch (error) {
        console.error("Erreur:", error.response?.data || error.message);
    }
};
  return (
    <div>
        <Menu
        name={name}
        email={email}
        role={adminRole}
    />
        <div className='right-pane flex-1 p-8 overflow-hidden'>
            <div className='flex justify-between'>
                <div className='column-1'>
                    <h3 className="text-4xl font-bold text-gray-800 mb-6">{greetings}</h3>
                    <div className='chart-section' style={{height:"70vh",padding:"30px"}}>
                        <div className='notice-title'>
                            <ChartColumn size={20} strokeWidth={1.25} /><span style={{padding:"0 7px"}}>Effectif mensuel des offres et candidatures</span>
                        </div>
                        <ResponsiveLine 
                            data={chartData}
                            margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
                            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                            axisBottom={{ legend: 'transportation', legendOffset: 36 }}
                            axisLeft={{ legend: 'count', legendOffset: -40 }}
                            pointSize={10}
                            pointColor={{ theme: 'background' }}
                            pointBorderWidth={2}
                            pointBorderColor={{ from: 'seriesColor' }}
                            pointLabelYOffset={-12}
                            enableTouchCrosshair={true}
                            useMesh={true}
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    translateX: 100,
                                    itemWidth: 80,
                                    itemHeight: 22,
                                    symbolShape: 'circle'
                                }
                            ]}
                             colors={d => {
                                if (d.id === "offres") return "#15e415";        
                                if (d.id === "candidatures") return "#d226ed";   
                                return "#000";
                            }}
                            />
                    </div>
                </div>
                <div className='column-2'>
                    <div className='notice history'>
                        <div className='notice-title'>
                            <ClockFading size={20} strokeWidth={1.25} /> <span style={{padding:"0 7px"}}>Historique des actions</span>
                        </div>
                        <div className='notice-content'>
                            <table className='history-table'>
                                <tbody>
                                    {
                                        history.map((hist,index)=>(
                                            <tr key={index}>
                                                 <td><span style={{ whiteSpace: "pre-line" }}>{europeanDate(hist.date_action)}</span></td>
                                                <td>{hist.details}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>     
                    </div>
                    <div className='notice resume'>
                        <div className='notice-title'>
                            <BriefcaseBusiness size={20} strokeWidth={1.25}/> <span style={{padding:"0 7px"}}>Chômeurs</span>
                        </div>
                        <div className='notice-content'>
                            {statistics.chomeur} utilisateur(s)
                        </div> 
                    </div>
                    <div className='notice resume'>
                        <div className='notice-title'>
                            <FileUser size={20} strokeWidth={1.25} /> <span style={{padding:"0 7px"}}>Recruteurs</span>
                        </div>
                        <div className='notice-content'>
                            {statistics.recruteur} utilisateur(s)
                        </div> 
                    </div>
                </div>
            </div>
            <div className='bottom-part'>
                 <div className='notice reminder' style={{display:"flex",justifyContent:"between"}}>
                    <div className='notice-logo'>
                        <ShieldUser size={40} strokeWidth={0.75} color='#2d21d4' />
                    </div>
                    <div className='notice-content'>
                        <div className='notice-title '><span style={{padding:"0 7px",color:"#2d21d4"}}>Validation identité</span></div>
                        <div style={{padding:"0 7px"}}>{ (statistics.identite == 0) ? "Aucun" : statistics.identite+ " à traiter"
                            
                            }</div>
                    </div>
                </div>
                <div className='notice reminder' style={{display:"flex",justifyContent:"between"}}>
                    <div className='notice-logo'>
                        <MapPin size={40} strokeWidth={0.75} color='#dd9822' />
                    </div>
                    <div className='notice-content'>
                        <div className='notice-title'><span style={{padding:"0 7px",color:"#dd9822"}}>Vérification localisation</span></div>
                        <div style={{padding:"0 7px"}}>{ (statistics.localisation == 0) ? "Aucun" : statistics.localisation+ " à traiter"
                            
                            }</div>
                    </div>
                </div>
                <div className='notice reminder' style={{display:"flex",justifyContent:"between"}}>
                    <div className='notice-logo'>
                        <OctagonAlert size={40} strokeWidth={0.75} color="#eb0000" />
                    </div>
                    <div className='notice-content'>
                        <div className='notice-title'><span style={{padding:"0 7px",color:"#eb0000"}}>Signalement</span></div>
                        <div style={{padding:"0 7px"}}>{ (statistics.signalement == 0) ? "Aucun" : statistics.signalement+ " à traiter"
                            
                            }</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Dashboard