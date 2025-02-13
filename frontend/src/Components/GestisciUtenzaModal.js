import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import "../css/ChangePassword.css";

const GestisciUtenzaModal = ({ onClose, activityId }) => {
  const [userType, setUserType] = useState("Pazienti");
  const [searchTerm, setSearchTerm] = useState("");
  const [pazienti, setPazienti] = useState([]);
  const [caregiver, setCaregiver] = useState([]);

  // 🔄 Recupera pazienti e caregiver dal backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("jwt");

        const [pazientiRes, caregiverRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/attivita/${activityId}/pazienti`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/attivita/${activityId}/caregiver`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        console.log(pazientiRes.data);
        console.log(caregiverRes.data);
        setPazienti(pazientiRes.data);
        setCaregiver(caregiverRes.data);
      } catch (error) {
        console.error("Errore nel recupero utenti:", error);
      }
    };

    fetchUsers();
  }, [activityId]);

  // ✅ Funzione per iscrivere/disiscrivere utenti
  const handleToggleUser = async (userId, isIscritto) => {
    try {
      const token = localStorage.getItem("jwt");

      if (isIscritto) {
        await axios.delete(`http://localhost:5000/api/attivita/${activityId}/disiscrivi`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId },
        });
      } else {
        await axios.post(`http://localhost:5000/api/attivita/${activityId}/iscrivi`, { userId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // 🔄 Aggiorna lo stato locale dopo l'iscrizione/disiscrizione
      if (userType === "Pazienti") {
        setPazienti((prev) =>
          prev.map((p) => (p.id === userId ? { ...p, iscritto: !isIscritto } : p))
        );
      } else {
        setCaregiver((prev) =>
          prev.map((c) => (c.id === userId ? { ...c, iscritto: !isIscritto } : c))
        );
      }
    } catch (error) {
      console.error("Errore nell'iscrizione/disiscrizione:", error);
    }
  };

  // 🔎 Filtra utenti in base alla ricerca
  const filteredUsers = (userType === "Pazienti" ? pazienti : caregiver).filter((user) =>
    `${user.nome} ${user.cognome} ${user.codiceFiscale}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <X />
        </button>

        <h2>Gestisci Utenza</h2>

        <div className="change-password-form">
          <div className="form-group">
            <label>Tipo di Utenza</label>
            <select value={userType} onChange={(e) => setUserType(e.target.value)}>
              <option value="Pazienti">Pazienti</option>
              <option value="Caregiver">Caregiver</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cerca</label>
            <input
              type="text"
              placeholder={`Cerca ${userType}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="gestisci-utenza-list">
          {filteredUsers.length === 0 ? (
            <p style={{ textAlign: "center" }}>Nessun utente trovato</p>
          ) : (
            filteredUsers.map((user) => (
              <div className="gestisci-utenza-list-item" key={user.id}>
                <span>
                  <strong>{user.nome} {user.cognome}</strong> - {user.codiceFiscale}
                  {userType === "Pazienti" && user.disabilita && (
                    <span style={{ marginLeft: "8px", color: "#00a783" }}>♿</span>
                  )}
                </span>
                <button
                  type="button"
                  className={user.iscritto ? "sub-btn-red" : "sub-btn-green"}
                  onClick={() => handleToggleUser(user.id, user.iscritto)}
                >
                  {user.iscritto ? "Rimuovi" : "Aggiungi"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GestisciUtenzaModal;
