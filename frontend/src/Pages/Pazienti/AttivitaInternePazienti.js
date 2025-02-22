import React from "react";
import "../../css/Pazienti/AttivitaIntEstPazienti.css"; // Updated import (renamed CSS file)
import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti";
import ActivityBarPazienti from "../../Components/Pazienti/ActivityBarPazienti";
import AttivitaInternaTabPazienti from "../../Components/Pazienti/AttivitaInternaTabPazienti";
import AttivitaInternaPazientiTab from "../../Components/Pazienti/AttivitaInternaPazientiTab";

export default function AttivitaInternePazienti() {
  const handleSearch = (searchTerm) => {
    // Implementa la logica di ricerca
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="attivita-interne-pazienti">
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
