import React from "react";
import { useParams } from "react-router-dom";
import NavbarDashboard from "../Components/NavbarDashboard";
import DatiAttivitaEsterne from "../Components/CartellaAttivitaEsterna/DatiAttivitaEsterne";

function PaginaDettaglioAttivitaEsterne() {
  // Recuperiamo l'id dall'URL, ma non lo usiamo per chiamate al backend
  const { id } = useParams();

  return (
    <div className="activity-detail">
      <NavbarDashboard />
      <div className="main-content-dettaglio">
        {/*
          Passiamo l'id a DatiAttivitaEsterne che ora usa dati fittizi
          e non effettua alcuna chiamata al server.
        */}
        <DatiAttivitaEsterne selectedKey={id} />
      </div>
    </div>
  );
}

export default PaginaDettaglioAttivitaEsterne;
