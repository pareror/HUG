import React, { useState } from "react";

import NavbarPazienti from  '../../Components/Pazienti/NavbarPazienti'

import '../../css/Pazienti/PazientiPage.css'

import "../../css/Dashboard.css";

import ActivityStatsPazienti from "../../Components/Pazienti/ActivityStatsPazienti"

import UpcomingActivities from "../../Components/UpcomingActivities"
import '../../css/UpcomingActivities.css';

import ButtonDashboardPazienti from "../../Components/Pazienti/ButtonDashboardPazienti";    

const PazientiPage = () => {

        const [activities] = useState([
          {
            name: "Yasdasdoga",
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
      
        const stats = {
          attivitaInterne: 12,
          attivitaEsterne: 4,
          attivitaOggi: 2,
          pagamentiSospeso: 2,
          attivitaCompletate: 10,
        }

    return (
        <div className='pazienti-container'>
            <NavbarPazienti />

            <div className="main-content">
                <ActivityStatsPazienti />
            
                <ButtonDashboardPazienti />
                <br />
                <UpcomingActivities activities={activities}/>  
          </div>
      </div>
    );
};

export default PazientiPage;