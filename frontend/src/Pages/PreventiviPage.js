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
          <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Torna indietro
          </button>

          <PreventiviTab />


        
     
        </div> 
    </div>
  );
}
