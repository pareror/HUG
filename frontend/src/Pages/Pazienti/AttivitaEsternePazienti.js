import React from "react";
import "../../css/AttivitaIntEst.css"
import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti"
import ActivityBarPazienti from "../../Components/Pazienti/ActivityBarPazienti";
import AttivitaEsternaTab from "../../Components/AttivitaEsternaTab";

export default function AttivitaEsterne() {
  return (
    <div className="attivita-interne">
      <NavbarPazienti />
      <ActivityBarPazienti />
      <header className="main-content-attivita">
      <p className="page-subtitle">
        Qui troverai la lista delle attività esterne del centro
      </p>

      <AttivitaEsternaTab />
      </header>

    </div>
  );
}