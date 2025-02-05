import React from "react";
import NavbarDashboard from "../Components/NavbarDashboard"
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../css/PagamentiPazienti.css";
import "../css/ActivityBar.css";


export default function PagamentiPazienti() {

    const navigate = useNavigate(); //Inizializza navigate

  return (
    <div className="pagamenti-pazienti">
      <NavbarDashboard />    
      <div className = "main-content">
         {/* Bottone per tornare indietro */}
         <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft className="back-icon" />
            <span className="back-text">Torna indietro</span>
          </button>


        
     
        </div> 
    </div>
  );
}
