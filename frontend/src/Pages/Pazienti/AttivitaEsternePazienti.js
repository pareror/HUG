import React from "react";
import "../../css/Pazienti/AttivitaIntEstPazienti.css"; // Updated import (renamed CSS file)
import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti";
import ActivityBarPazienti from "../../Components/Pazienti/ActivityBarPazienti";
import AttivitaEsternaTabPazienti from "../../Components/Pazienti/AttivitaEsternaTabPazienti";

export default function AttivitaEsternePazienti() {
  return (
    <div className="attivita-esterne-pazienti">
      <NavbarPazienti />
      <ActivityBarPazienti />
      <header className="main-content-attivita-pazienti">
        <p className="page-subtitle-pazienti">
          Qui troverai la lista delle attività esterne del centro
        </p>
        <AttivitaEsternaTabPazienti />
      </header>
    </div>
  );
}
