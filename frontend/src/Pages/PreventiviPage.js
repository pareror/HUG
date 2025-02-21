import React from "react";
import "../css/PreventiviPage.css"
import NavbarDashboard from "../Components/NavbarDashboard"
import "../css/ActivityBar.css";

import PreventiviTab from "../Components/PreventiviTab";

export default function PreventiviPage() {



  //Inizializza navigate

  return (
    <div className="preventivi">
      <NavbarDashboard />    
      <div className = "main-content">
         {/* Bottone per tornare indietro */}
          
          <PreventiviTab />


        
     
        </div> 
    </div>
  );
}
