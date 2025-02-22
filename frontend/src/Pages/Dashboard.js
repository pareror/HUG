import React from "react";
import "../css/Dashboard.css";
import '../Components/ActivityStats';
import ActivityStats from "../Components/ActivityStats"
import UpcomingActivities from "../Components/UpcomingActivities"
import '../css/UpcomingActivities.css';
import ButtonDashboard from "../Components/ButtonDashboard";    
import '../css/ButtonDashboard.css';
import { useState } from "react"

import NavbarDashboard from "../Components/NavbarDashboard";



function Dashboard() {
  
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
          
                
                 <ActivityStats stats={stats} />
            
            <ButtonDashboard />
            <br />
            <UpcomingActivities/>


            
          </div>
      </div>

    )
  }
  
  
 
export default Dashboard;