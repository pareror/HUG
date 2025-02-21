import React from "react";
import "../../css/Pazienti/AttivitaIntEstPazienti.css"; // Updated import (renamed CSS file)
import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti";
import ActivityBarPazienti from "../../Components/Pazienti/ActivityBarPazienti";
import AttivitaInternaTabPazienti from "../../Components/Pazienti/AttivitaInternaTabPazienti";

export default function AttivitaInternePazienti() {
  const handleSearch = (searchTerm) => {
    // Implementa la logica di ricerca
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="attivita-interne-pazienti">
      <NavbarPazienti />
      <ActivityBarPazienti onSearch={handleSearch} />
      <header className="main-content-attivita-pazienti">
        <p className="page-subtitle-pazienti">
          Qui troverai la lista delle attività interne del centro
        </p>
        <AttivitaInternaTabPazienti />
      </header>
    </div>
  );
}
