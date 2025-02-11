import React from "react";
import { ArrowLeft, Search, Plus } from "lucide-react"
import "../css/AttivitaIntEst.css"
import NavbarDashboard from "../Components/NavbarDashboard"
import ActivityBar from "../Components/ActivityBar";
import AttivitaInterna from "../Components/AttivitaInterna";
import AttivitaInternaTab from "../Components/AttivitaInternaTab";
export default function AttivitaInterne() {
  const handleSearch = (searchTerm) => {
    // Implementa qui la logica di ricerca
    console.log('Searching for:', searchTerm);
  };
  return (
    <div className="attivita-interne">
      <NavbarDashboard />
      <ActivityBar onSearch={handleSearch} />
      <header className="main-content-attivita">
      <p className="page-subtitle">
        Qui troverai la lista delle attività interne del centro
      </p>

        <AttivitaInternaTab />
        
      </header>

    </div>
  );
}
