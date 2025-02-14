import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react"; // Icona per chiudere il modal
import "../css/CCM.css"; // CSS per il modal
import "../css/ErrorPopup.css"; // CSS per il popup di errore
import "../css/SuccessPopup.css"; // CSS per il popup di successo

const ForceChangePasswordModal = ({ userId, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Se viene impostato un errore, nascondilo dopo 3 secondi
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Se viene impostato il successo, nascondilo dopo 3 secondi
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Controlla che le due password coincidano
    if (newPassword !== confirmNewPassword) {
      setError("Le password non coincidono.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `http://localhost:5000/api/force-change-password/${userId}`,
        { newPassword, confirmNewPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      // Chiudi il modal dopo un breve ritardo se l'operazione va a buon fine
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Errore durante il cambio della password:", err);
      const errorMessage =
        err.response?.data?.error || "Errore durante l'aggiornamento della password.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2>Cambia Password Forzata</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nuova Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Conferma Nuova Password:</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-popup">{error}</div>}
          {success && <div className="success-popup">Password aggiornata con successo.</div>}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Aggiornamento..." : "Aggiorna Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForceChangePasswordModal;
