import React from "react";
import "../../css/DettaglioAttivita.css";
import DettaglioAttivitaEsterne from "./DettaglioAttivitaEsterne";

const DatiAttivitaEsterne = ({ selectedKey }) => {
  // Dati fittizi dell'attività
  const activityData = {
    id: 1,
    titolo: "Titolo fittizio",
    immagine: "/placeholder.svg",
    datainizio: "2025-06-15",
    orainizio: "09:00",
    durata: 2,
    luogo: "Luogo di esempio",
    numeroIscritti: 5,
    numeroMinimoPartecipanti: 8,
    numeroMassimoPartecipanti: 20,
    istruttore: "Mario Rossi",
    scadenzaIscrizioni: "2025-06-10",
    descrizione: "Questa è una descrizione di prova dell'attività esterna."
  };

  // Invece di effettuare chiamate al server, passiamo direttamente i dati fittizi
  return <DettaglioAttivitaEsterne {...activityData} />;
};

export default DatiAttivitaEsterne;
