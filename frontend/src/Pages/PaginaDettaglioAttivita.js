import React from "react";
import { useParams } from "react-router-dom"; // Importa useParams
import NavbarDashboard from "../Components/NavbarDashboard";
import DatiAttivita from "../Components/DatiAttivita";

function PaginaDettaglioAttivita() {
  const { id } = useParams(); // Ottiene l'id dall'URL

  return (
    <div className="activity-detail">
      <NavbarDashboard />
      <div className="main-content-dettaglio">
        <DatiAttivita selectedKey={id} /> {/* Passa l'id come prop */}
      </div>
    </div>
  );
}

export default PaginaDettaglioAttivita;
