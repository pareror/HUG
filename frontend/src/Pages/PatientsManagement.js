import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Accessibility, Key, Edit2, ArrowLeft, Plus } from "lucide-react";
import "../css/PatientsManagement.css";
import NavbarDashboard from "../Components/NavbarDashboard";
import axios from "axios";
import ForceChangePasswordModal from "../Components/ForceChangePasswordModal";

const PatientsManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      setPatients(response.data.patients);
      console.log("✅ Pazienti recuperati:", response.data.patients);
    } catch (error) {
      console.error("❌ Errore nel recupero dei pazienti:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.codiceFiscale.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (patient) => {
    console.log("Apertura modal per:", patient); // Debug
    setSelectedPatient(patient);
    setShowModal(true);
  };

  return (
    <div className="patients-management-page">
      <NavbarDashboard />
      <div className="main-content">
        <header className="pm-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Torna indietro
            </button>
          </div>
          <div className="header-center">
            <h1>Gestione Pazienti</h1>
          </div>
          <div className="header-right">{/* Vuoto per bilanciare l'header */}</div>
        </header>

        <div className="pm-controls">
          <input
            type="text"
            placeholder="Cerca paziente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <button
            className="add-button"
            onClick={() => navigate("/dashboard/utenza/pazienti/nuovo")}
          >
            <Plus size={20} />
            Aggiungi Paziente
          </button>
        </div>

        <div className="pm-table-container">
          {filteredPatients.length === 0 ? (
            <p className="no-data">Nessun paziente presente nella lista.</p>
          ) : (
            <table className="pm-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Cognome</th>
                  <th>Codice Fiscale</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.nome}</td>
                    <td>{patient.cognome}</td>
                    <td>{patient.codiceFiscale}</td>
                    <td className="actions-cell">
                      {Boolean(patient.disabilita) && (
                        <Accessibility size={16} color="#007bff" />
                      )}
                      <button
                        className="icon-button"
                        onClick={() => handleOpenModal(patient)}
                      >
                        <Key size={16} />
                      </button>
                      <button
                        className="icon-button"
                        onClick={() =>
                          navigate(`/dashboard/utenza/pazienti/${patient.id}/modifica`)
                        }
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Modal viene reso una sola volta, fuori dal mapping */}
      {showModal && selectedPatient && (
        <ForceChangePasswordModal
          userId={selectedPatient.id}
          username={selectedPatient.username}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PatientsManagement;
