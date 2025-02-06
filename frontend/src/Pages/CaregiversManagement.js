import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Key, Edit2 } from "lucide-react";
import "../css/PatientsManagement.css"; // Puoi rinominarlo se vuoi, ad es. CaregiverManagement.css
import NavbarDashboard from "../Components/NavbarDashboard";
import axios from "axios";

const CaregiverManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [caregivers, setCaregivers] = useState([]);

  // Funzione per recuperare i caregiver dall'API
  const fetchCaregivers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/caregivers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      setCaregivers(response.data.caregivers);
      console.log("✅ Caregiver recuperati:", response.data.caregivers);
    } catch (error) {
      console.error("❌ Errore nel recupero dei caregiver:", error);
    }
  };

  useEffect(() => {
    fetchCaregivers();
  }, []);

  // Filtra i caregiver in base al termine di ricerca (nome, cognome, codice fiscale, id)
  const filteredCaregivers = caregivers.filter(
    (caregiver) =>
      caregiver.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caregiver.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caregiver.codiceFiscale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caregiver.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1>Gestione Caregiver</h1>
          </div>
          <div className="header-right">
            {/* Vuoto per bilanciare l'header */}
          </div>
        </header>

        <div className="pm-controls">
          <input
            type="text"
            placeholder="Cerca caregiver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <button
            className="add-button"
            onClick={() => navigate("/dashboard/utenza/caregiver/nuovo")}
          >
            <Plus size={20} />
            Aggiungi Caregiver
          </button>
        </div>

        <div className="pm-table-container">
          {filteredCaregivers.length === 0 ? (
            <p className="no-data">Nessun caregiver presente nella lista.</p>
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
                {filteredCaregivers.map((caregiver) => (
                  <tr key={caregiver.id}>
                    <td>{caregiver.id}</td>
                    <td>{caregiver.nome}</td>
                    <td>{caregiver.cognome}</td>
                    <td>{caregiver.codiceFiscale}</td>
                    <td className="actions-cell">
                      {/* Ad esempio: se vuoi mostrare le credenziali */}
                      <button
                        className="icon-button"
                        onClick={() =>
                          navigate(
                            `/dashboard/utenza/caregiver/${caregiver.id}/credenziali`
                          )
                        }
                      >
                        <Key size={16} />
                      </button>
                      <button
                        className="icon-button"
                        onClick={() =>
                          navigate(
                            `/dashboard/utenza/caregiver/${caregiver.id}/modifica`
                          )
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
    </div>
  );
};

export default CaregiverManagement;
