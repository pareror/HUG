import React from "react";
import '../css/Dashboard.css';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import '../css/Sidebar.css';
/*import ActivityStats from "../Components/ActivityStats"
import '../css/ActivityStats.css';*/
import UpcomingActivities from "../Components/UpcomingActivities"
import '../css/UpcomingActivities.css';
import PaymentsTable from "../Components/PaymentsTable"
import '../css/PaymentsTable.css';
import { useState } from "react"

import { Info } from "lucide-react";
import Logout from "../Components/LogoutButton";
/*function Dashboard() {
    return (
        <div className="Dashboard">

            <Sidebar />

            <div className="dashboard-main">
                <Navbar />

                <div className="dashboard-content">
                    <h1>Benvenuto Korian!</h1>
                    <div className="info-boxes">
                        <InfoBox title="Attività interne questo mese" value="12" />
                        <InfoBox title="Pagamenti in sospeso" value="2" />
                        <InfoBox title="Attività attive oggi" value="3" />
                        <InfoBox title="utenti Registrati" value="27" />
                    </div>
                    </div>
            </div>

            
            
            
          
          
        </div>
    );
}*/



function Dashboard() {
    const [activities] = useState([
      {
        name: "Yoga",
        date: "11 gen 2025",
        time: "16:00",
        status: "In progress",
        participants: "6/12",
      },
      {
        name: "Tennis",
        date: "11 gen 2025",
        time: "15:00",
        status: "In arrivo",
        participants: "22/22",
      },
      {
        name: "Ping Pong",
        date: "11 gen 2025",
        time: "17:00",
        status: "Da approvare",
        participants: "2/10",
      },
    ])
  
    const [payments] = useState([
      {
        activity: "Gita a Lecce",
        total: "300 €",
        status: "Da pagare",
      },
      {
        activity: "Gita in barca",
        total: "120 €",
        status: "Pagato",
      },
      {
        activity: "Visita al museo",
        total: "100 €",
        status: "Da pagare",
      },
    ])
  
    /*const stats = {
      attivitaInterne: 12,
      attivitaEsterne: 4,
      pazientiRegistrati: 2,
      utentiRegistrati: 27,
    }*/
  
    return (
      <div className="flex h-screen bg-gray-100">
         <div className="Dashboard">
            <Navbar />
              <div className="dashboard">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-2xl font-semibold mb-8">Benvenuto Korian!</h1>
  
              {/*  <ActivityStats stats={stats} />*/}
  
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                     <div>
                       <h2 className="text-xl font-semibold mb-4">Prossime Attività</h2>
                     <UpcomingActivities activities={activities} />
                    </div>
                <div>
                <h2 className="text-xl font-semibold mb-4">Pagamenti</h2>
                <PaymentsTable payments={payments} />
                <Logout />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </div>
    )
  }
  
  
 
export default Dashboard;