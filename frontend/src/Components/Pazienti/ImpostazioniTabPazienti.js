import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../css/Pazienti/ImpostazioniPazienti.css";

import Impostazione from "../../Components/Pazienti/ImpostazionePazienti";

import ChangePasswordModal from "../../Components/ChangePasswordModal"; // Import del popup

export default function ImpostazioniTabPazienti() {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false); // Stato per mostrare il popup

  const settings = [
    {
      id: 1,
      titolo: "Cambia Password",
      descrizione: "Aggiorna la tua password per mantenere al sicuro il tuo account",
      bottoneText: "Cambia Password",
      bottoneClass: "blue-button",
      onClick: () => setShowPasswordModal(true), // Mostra il popup
    },
    {
      id: 2,
      titolo: "Preferenze di notifiche",
      descrizione: "Attiva o disattiva la ricezione di notifiche",
      isToggle: true,
      onClick: (toggle) =>
        alert(toggle ? "Notifiche disattivate!" : "Notifiche attivate!"),
    }
  ];

  return (
    <div className="pazienti-impostazioni-container">
      <h2 className="pazienti-impostazioni-title">Impostazioni Account</h2>
      <div className="pazienti-impostazioni-list">
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

      {/* Popup per il cambio password */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
