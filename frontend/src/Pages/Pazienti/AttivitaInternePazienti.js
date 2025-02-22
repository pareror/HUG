import React from "react";
import "../../css/AttivitaIntEst.css"

import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti"
import ActivityBarPazienti from "../../Components/Pazienti/ActivityBarPazienti";

import AttivitaInternaPazientiTab from "../../Components/Pazienti/AttivitaInternaPazientiTab";
export default function AttivitaInternePazienti() {
  const handleSearch = (searchTerm) => {
    // Implementa qui la logica di ricerca
    console.log('Searching for:', searchTerm);
  };
  return (
    <div className="attivita-interne">
      <NavbarPazienti />
      <ActivityBarPazienti onSearch={handleSearch} />
      <header className="main-content-attivita">
      <p className="page-subtitle">
        Qui troverai la lista delle attività interne del centro
      </p>

        <AttivitaInternaPazientiTab />
        
      </header>

    </div>
  );
}
