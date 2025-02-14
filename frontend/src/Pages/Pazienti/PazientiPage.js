import React from 'react';
import NavbarPazienti from  '../../Components/Pazienti/NavbarPazienti'

import '../../css/Pazienti/PazientiPage.css'

import "../../css/Dashboard.css";

import ActivityStatsPazienti from "../../Components/Pazienti/ActivityStatsPazienti"

import UpcomingActivities from "../../Components/UpcomingActivities"
import '../../css/UpcomingActivities.css';

import PaymentsTable from "../../Components/PaymentsTable"
import '../../css/PaymentsTable.css';

import ButtonDashboardPazienti from "../../Components/Pazienti/ButtonDashboardPazienti";    

import { useState } from "react"

const PazientiPage = () => {

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
          attivitaOggi: 2,
          pagamentiSospeso: 2,
          attivitaCompletate: 10,
        }

    return (
        <div className='pazienti-container'>
            <NavbarPazienti />

            <div className="main-content">
                <ActivityStatsPazienti stats={stats} />
            
                <ButtonDashboardPazienti />
                <br />
                <UpcomingActivities activities={activities}/>
                <br />
                <PaymentsTable payments={payments}/>    
          </div>
      </div>
    );
};

export default PazientiPage;