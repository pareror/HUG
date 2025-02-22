import React from "react";
import "../../css/AttivitaIntEst.css"
import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti"
import ActivityBarPazienti from "../../Components/Pazienti/ActivityBarPazienti";
import AttivitaEsternaPazientiTab from "../../Components/Pazienti/AttivitaEsternaPazientiTab";
export default function AttivitaEsterne() {
  return (
    <div className="attivita-interne">
      <NavbarPazienti />
      <ActivityBarPazienti />
      <header className="main-content-attivita">
      <p className="page-subtitle">
        Qui troverai la lista delle attività esterne del centro
      </p>

      <AttivitaEsternaPazientiTab />
      </header>

    </div>
  );
}