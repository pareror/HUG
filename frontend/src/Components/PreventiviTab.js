import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, ArrowLeft } from "lucide-react";
import "../css/PreventiviPage.css";
import Preventivo from "./Preventivo"; // Componente che mostra un singolo preventivo
import { Link, useNavigate } from "react-router-dom";
export default function PreventiviTab() {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  // Funzione per recuperare le attività esterne dal backend e aggiornare ciascuna con il numero di preventivi
  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("jwt");
      // Recupera le attività esterne
      const response = await axios.get("http://localhost:5000/api/attivita", {
        headers: { Authorization: `Bearer ${token}` },
        params: { tipo: "E" },
      });
      
      const activitiesFetched = response.data.activities || [];
      
      // Per ogni attività, richiedi il numero di preventivi
      const activitiesWithPreventivi = await Promise.all(
        activitiesFetched.map(async (activity) => {
          try {
            const countResponse = await axios.get(
              `http://localhost:5000/api/attivita/${activity.id}/preventivi/count`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...activity, numeroPreventivi: countResponse.data.numeroPreventivi };
          } catch (err) {
            console.error(`Errore nel recupero dei preventivi per l'attività ${activity.id}:`, err);
            // In caso di errore, imposta il numero di preventivi a 0
            return { ...activity, numeroPreventivi: 0 };
          }
        })
      );
      
      // Ordina le attività per data di inizio: dalla più recente a quella meno recente
      const sortedActivities = activitiesWithPreventivi.sort(
        (a, b) => new Date(b.datainizio) - new Date(a.datainizio)
      );
      setActivities(sortedActivities);
    } catch (err) {
      console.error("Errore nel recupero delle attività:", err);
      setError("Errore durante il recupero delle attività.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Filtra le attività in base al termine di ricerca (per titolo)
  const filteredActivities = activities.filter((activity) =>
    activity.titolo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    Torna indietro
                </button>
      
      <div className="header">
        <h1>Preventivi Attività Esterne</h1>
        <p>
          Qui troverai la lista delle attività esterne, ordinate dalla più recente a quella meno recente, con il numero dei preventivi effettuati per ciascuna.
        </p>
      </div>

      <div className="search-containerr">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Cerca attività..."
          className="search-inputt"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Caricamento in corso...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredActivities.length === 0 ? (
        <p className="no-data">Nessuna attività trovata.</p>
      ) : (
        <div className="activities-list">
          {filteredActivities.map((activity) => (
            <Preventivo
              key={activity.id}
              idAttivita={activity.id}
              titoloPreventivo={activity.titolo}
              data={activity.datainizio}
              numeroPreventivi={activity.numeroPreventivi}
            />
          ))}
        </div>
      )}
    </div>
  );
}
