import React from "react";
import "../../css/Pazienti/NotifichePazienti.css"
import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti"

import NotificheTabPazienti from "../../Components/Pazienti/NotificheTabPazienti"
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotifichePazienti() {

    const navigate = useNavigate(); //Inizializza navigate

  return (
    <div className="notifiche">
      <NavbarPazienti />    
      <div className = "main-content">
         {/* Bottone per tornare indietro */}
         <button onClick={() => navigate(-1)} className="back-link">
            <ArrowLeft className="back-icon" />
            <span className="back-text">Torna indietro</span>
          </button>

        <NotificheTabPazienti />

        </div> 
    </div>
  );
}
