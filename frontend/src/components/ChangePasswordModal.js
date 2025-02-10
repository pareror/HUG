import React, { useState } from "react";
import axios from "axios";
import "../css/ChangePassword.css"; // Usa lo stesso CSS o personalizzalo

const ChangePasswordModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Compila tutti i campi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Le password nuove non coincidono.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/change-password",
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => onClose(), 2000); // Chiude il popup dopo 2 secondi
    } catch (err) {
      console.error("Errore nel cambio password:", err);
      setError(err.response?.data?.error || "Errore durante il cambio password.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Cambia Password</h2>

        <form className="change-password-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Password aggiornata con successo!</div>}

          <div className="form-group">
            <label>Password attuale</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Inserisci la password attuale"
              required
            />
          </div>

          <div className="form-group">
            <label>Nuova Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Inserisci la nuova password"
              required
            />
          </div>

          <div className="form-group">
            <label>Conferma Nuova Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Conferma la nuova password"
              required
            />
          </div>

          <button type="submit" className="btn-green">Aggiorna Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
