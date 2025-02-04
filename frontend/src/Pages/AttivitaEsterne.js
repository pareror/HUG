import React from "react";
import "../css/AttivitaInterne.css"
import NavbarDashboard from "../Components/NavbarDashboard"
import ActivityBar from "../Components/ActivityBar";
export default function AttivitaInterne() {
  return (
    <div className="attivita-interne">
      <NavbarDashboard />
      <ActivityBar />
      <header className="main-content-attivita">
      <p className="page-subtitle">
        Qui troverai la lista delle attività esterne del centro
      </p>

      <div className="activities-grid">
        <div className="activity-card-placeholder" />
        <div className="activity-card-placeholder" />
        <div className="activity-card-placeholder" />
      
        {/* Altri placeholder se necessario */}
      </div>
      </header>

    </div>
  );
}