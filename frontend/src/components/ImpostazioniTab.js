import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../css/Impostazioni.css";
import Impostazione from "../Components/Impostazione";
import ChangePasswordModal from "../Components/ChangePasswordModal"; // Import del popup

export default function ImpostazioniTab() {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false); // Stato per mostrare il popup

  // Recupera l'ID dal JWT
  let userId = null;
  try {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    }
  } catch (error) {
    console.error("Errore nel decoding del JWT:", error);
  }

  // Funzione per eliminare l'account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare definitivamente il tuo account?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/profilo/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      localStorage.removeItem("jwt");
      alert("Account eliminato con successo!");
      navigate("/");
    } catch (err) {
      console.error("Errore durante l'eliminazione dell'account:", err);
      alert("Impossibile eliminare l'account. Contatta il supporto.");
    }
  };

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
    },
    {
      id: 3,
      titolo: "Elimina account",
      descrizione: "Elimina permanentemente il tuo account e tutti i dati associati",
      bottoneText: "Elimina Account",
      bottoneClass: "red-button",
      onClick: handleDeleteAccount,
    },
  ];

  return (
    <div className="impostazioni-container">
      <h2 className="impostazioni-title">Impostazioni Account</h2>
      <div className="impostazioni-list">
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
