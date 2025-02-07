import React from "react";
import { ArrowLeft, Search, Plus } from "lucide-react"
import "../css/AttivitaIntEst.css"
import NavbarDashboard from "../Components/NavbarDashboard"
import ActivityBar from "../Components/ActivityBar";
import AttivitaInterna from "../Components/AttivitaInterna";
import AttivitaInternaTab from "../Components/AttivitaInternaTab";
export default function AttivitaInterne() {
  return (
    <div className="attivita-interne">
      <NavbarDashboard />
      <ActivityBar />
      <header className="main-content-attivita">
      <p className="page-subtitle">
        Qui troverai la lista delle attività interne del centro
      </p>

        <AttivitaInternaTab />
        
      </header>

    </div>
  );
}
