import React from "react";
import "../css/Notifiche.css"
import NavbarDashboard from "../Components/NavbarDashboard"
import NotificheTab from "../Components/NotificheTab"
import { Link, useNavigate } from "react-router-dom";
import "../css/ActivityBar.css";
import { ArrowLeft } from "lucide-react";

export default function Notifiche() {

    const navigate = useNavigate(); //Inizializza navigate

  return (
    <div className="notifiche">
      <NavbarDashboard />    
      <div className = "main-content">
         {/* Bottone per tornare indietro */}
         <button onClick={() => navigate(-1)} className="back-link">
            <ArrowLeft className="back-icon" />
            <span className="back-text">Torna indietro</span>
          </button>

        <NotificheTab />

        </div> 
    </div>
  );
}
