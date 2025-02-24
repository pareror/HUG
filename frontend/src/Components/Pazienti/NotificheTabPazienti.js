import React from "react";

import "../../css/Pazienti/NotificheTabPazienti.css";
import NotificaPaziente from "./NotificaPaziente";

export default function NotificheTabPazienti() {
    
    const notifications = [
        {
          id: 1,
          titolo: "Visita Confermata",
          descrizione: "La tua visita fisioterapica è stata confermata per domani alle 10:00.",
          tempo: "2 minuti fa",
          nuovo: true
        },
        {
          id: 2,
          titolo: "Ricetta Pronta",
          descrizione: "La tua ricetta per gli esami del sangue è ora disponibile in segreteria.",
          tempo: "1 ora fa",
          nuovo: true
        },
        {
          id: 3,
          titolo: "Aggiornamento Cartella Clinica",
          descrizione: "È stata aggiornata la tua cartella clinica con i risultati delle ultime analisi.",
          tempo: "3 ore fa",
          nuovo: false
        },
        {
          id: 4,
          titolo: "Promemoria Farmaci",
          descrizione: "Ricordati di assumere il farmaco prescritto alle ore 14:00.",
          tempo: "6 ore fa",
          nuovo: false
        },
        {
          id: 5,
          titolo: "Nuovo Corso",
          descrizione: "Hai la possibilità di iscriverti al nuovo corso di ginnastica dolce tra 3 giorni.",
          tempo: "1 giorno fa",
          nuovo: false
        }
      ];
       
    
    return (
        <div className="notifications-container">
            <h2 className="notifications-title">Notifiche</h2>
            <div className="notifications-list">
                
                {/*Cicliamo l'array e passiamo i dati come props al componente Notifica */}
                {notifications.map((notification) => (
                    <NotificaPaziente 
                        key={notification.id}
                        titolo={notification.titolo}
                        descrizione={notification.descrizione}
                        tempo={notification.tempo}
                    />
                ))}

            </div>
        </div>
    );
  }
