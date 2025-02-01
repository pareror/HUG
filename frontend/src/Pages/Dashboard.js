import React from "react";
import '../Components/ActivityStats';
import ActivityStats from "../Components/ActivityStats"
import UpcomingActivities from "../Components/UpcomingActivities"
import '../css/UpcomingActivities.css';
import PaymentsTable from "../Components/PaymentsTable"
import '../css/PaymentsTable.css';
import { useState } from "react"

import NavbarDashboard from "../Components/NavbarDashboard";



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
  
    const stats = {
      attivitaInterne: 12,
      attivitaEsterne: 4,
      pazientiRegistrati: 2,
      utentiRegistrati: 27,
    }
  
    return (

      <div className="Dashboard">
        <NavbarDashboard />
          <div className="main-content">
          <br />
                <br />
                 <ActivityStats stats={stats} />
            <br />
            <UpcomingActivities activities={activities}/>
            <br />
            <PaymentsTable payments={payments}/>

            
          </div>
      </div>

    )
  }
  
  
 
export default Dashboard;