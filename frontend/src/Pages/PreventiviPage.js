import React from "react";
import "../css/PreventiviPage.css"
import NavbarDashboard from "../Components/NavbarDashboard"
import { Link, useNavigate } from "react-router-dom";
import "../css/ActivityBar.css";
import { ArrowLeft } from "lucide-react";
import PreventiviTab from "../Components/PreventiviTab";

export default function PreventiviPage() {



    const navigate = useNavigate(); //Inizializza navigate

  return (
    <div className="preventivi">
      <NavbarDashboard />    
      <div className = "main-content">
         {/* Bottone per tornare indietro */}
         <button onClick={() => navigate(-1)} className="back-link">
            <ArrowLeft className="back-icon" />
            <span className="back-text">Torna indietro</span>
          </button>

          <PreventiviTab />


        
     
        </div> 
    </div>
  );
}
