import React from "react";
import "../css/NotificheTab.css";
import Notifica from "./Notifica";

export default function NotificheTab() {
    
    const notifications = [
        {
            id: 1,
            titolo: "Nuovo Pagamento",
            descrizione: "Mario Rossi ha effettuato un pagamento per Corso di Pittura",
            tempo: "2 minuti fa",
            nuovo: true
        },
        {
            id: 2,
            titolo: "Iscrizione confermata",
            descrizione: "Giulia Bianchi si è iscritta a Yoga per Anziani",
            tempo: "1 ora fa",
            nuovo: true
        },
        {
            id: 3,
            titolo: "Promemoria",
            descrizione: "Laboratorio di Cucina inizierà tra 30 minuti",
            tempo: "3 ore fa",
            nuovo: false
        },
        {
            id: 4,
            titolo: "Promemoria",
            descrizione: "Laboratorio di Cucina inizierà tra 30 minuti",
            tempo: "3 ore fa",
            nuovo: false
        },
        {
            id: 5,
            titolo: "Promemoria",
            descrizione: "Laboratorio di Cucina inizierà tra 30 minuti",
            tempo: "3 ore fa",
            nuovo: false
        }
    ];    
    
    return (
        <div className="notifications-container">
            <h2 className="notifications-title">Notifiche</h2>
            <div className="notifications-list">
                
                {/*Cicliamo l'array e passiamo i dati come props al componente Notifica */}
                {notifications.map((notification) => (
                    <Notifica 
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
