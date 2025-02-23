import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import "../../css/CaregiverModal.css"; // Usa un file CSS dedicato, oppure aggiorna ChangePassword.css

const VisualizzaCaregiverModal = ({ onClose, activityId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [caregivers, setCaregivers] = useState([]);

  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(
          `http://localhost:5000/api/attivita/${activityId}/caregiver`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Caregiver trovati:", response.data);
        // Filtra solo i caregiver assegnati (iscritto === 1)
        const assignedCaregivers = response.data.filter(
          (user) => user.iscritto === 1
        );
        setCaregivers(assignedCaregivers);
      } catch (error) {
        console.error("Errore nel recupero dei caregiver:", error);
      }
    };

    fetchCaregivers();
  }, [activityId]);

  const filteredCaregivers = caregivers.filter((user) =>
    `${user.nome} ${user.cognome} ${user.codiceFiscale}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
      <div className="modal-content caregiver-modal">
        <button className="close-button" onClick={onClose}>
          <X />
        </button>
        <h2>Caregiver Assegnati</h2>
        <div className="form-group">
          <label>Cerca Caregiver</label>
          <input
            type="text"
            placeholder="Cerca caregiver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="caregiver-list">
          {filteredCaregivers.length === 0 ? (
            <p style={{ textAlign: "center" }}>Nessun caregiver assegnato trovato</p>
          ) : (
            filteredCaregivers.map((user) => (
              <div className="caregiver-list-item" key={user.id}>
                <span>
                  <strong>{user.nome} {user.cognome}</strong> - {user.codiceFiscale}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizzaCaregiverModal;
