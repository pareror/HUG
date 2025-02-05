import React from "react";
import NavbarDashboard from "../Components/NavbarDashboard"
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import "../css/PagamentiPazienti.css";
import PagamentoPaziente from "../Components/PagamentoPaziente";
import PagamentiPazientiTab from "../Components/PagamentiPazientiTab";


export default function PagamentiPazienti() {

    const navigate = useNavigate(); //Inizializza navigate

  return (
    <div className="pagamenti-pazienti">
      <NavbarDashboard />    
      <div className = "main-content">
         {/* Bottone per tornare indietro */}
         <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Torna indietro
            </button>
            
              <PagamentiPazientiTab/>

        </div> 
    </div>
  );
}
