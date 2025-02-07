import React from "react";
import "../css/AttivitaIntEst.css"
import NavbarDashboard from "../Components/NavbarDashboard"
import ActivityBar from "../Components/ActivityBar";
import AttivitaEsternaTab from "../Components/AttivitaEsternaTab";

export default function AttivitaEsterne() {
  return (
    <div className="attivita-interne">
      <NavbarDashboard />
      <ActivityBar />
      <header className="main-content-attivita">
      <p className="page-subtitle">
        Qui troverai la lista delle attività esterne del centro
      </p>

      <AttivitaEsternaTab />
      </header>

    </div>
  );
}