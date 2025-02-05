import React from "react";
import "../css/Impostazioni.css";
import Impostazione from "../Components/Impostazione";
import { useNavigate } from "react-router-dom";


export default function ImpostazioniTab() {
    const navigate = useNavigate();

    const settings = [
        {
            id: 1,
            titolo: "Cambia Password",
            descrizione: "Aggiorna la tua password per mantenere al sicuro il tuo account",
            bottoneText: "Cambia Password",
            bottoneClass: "blue-button",
            onClick: () => navigate("/cambia-password") // Reindirizza alla pagina del cambio password
        },
        {
            id: 2,
            titolo: "Preferenze di notifiche",
            descrizione: "Attiva o disattiva la ricezione di notifiche",
            isToggle: true,
            onClick: (toggle) => alert(toggle ? "Notifiche disattivate!" : "Notifiche attivate!")        },
        {
            id: 3,
            titolo: "Elimina account",
            descrizione: "Elimina permanentemente il tuo account e tutti i dati associati",
            bottoneText: "Elimina Account",
            bottoneClass: "red-button",
            onClick: () => {
                if (window.confirm("Sei sicuro di voler eliminare il tuo account?")) {
                    alert("Account eliminato con successo!"); // Esegui l'azione reale qui
                }
            }
        },
    ];    
    
    return (
        <div className="impostazioni-container">
            <h2 className="impostazioni-title">Impostazioni Account</h2>
            <div className="impostazioni-list">
                
                {/*Cicliamo l'array e passiamo i dati come props al componente Notifica */}
                {settings.map((setting) => (
                    <Impostazione 
                        key={setting.id}
                        titolo={setting.titolo}
                        descrizione={setting.descrizione}
                        bottoneText={setting.bottoneText}
                        bottoneClass={setting.bottoneClass}
                        isToggle={setting.isToggle}
                        onClick={setting.onClick}
                    />
                ))}

            </div>
        </div>
    );
  }
