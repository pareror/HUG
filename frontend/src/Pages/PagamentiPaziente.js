import React from "react";
import NavbarDashboard from "../Components/NavbarDashboard"
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import "../css/PagamentiPaziente.css";
import PagamentoPerPaziente from "../Components/PagamentoPerPaziente";



export default function PagamentiPaziente() {

    const navigate = useNavigate(); //Inizializza navigate

  return (
    <div className="pagamenti-pazienti">
      <NavbarDashboard />    
      <div className = "main-content">
         {/* Bottone per tornare indietro */}
         <div className="button-title-header">
         <button className="pagamenti-back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Torna indietro
            </button>
            <h1>Mario Rossi</h1>
            </div>  
                <PagamentoPerPaziente/>
        </div> 
    </div>
  );
}
