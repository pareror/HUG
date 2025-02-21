import React, { useState, useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/PagamentiPazienti.css";
import NavbarDashboard from "../Components/NavbarDashboard";
import axios from "axios";

export default function GestisciAttivita() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("jwt");
        // Recupera le attività esterne da approvare
        const response = await axios.get("http://localhost:5000/api/attivita-esterne/gestione", {
          headers: { Authorization: `Bearer ${token}` },
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

        setActivities(activitiesWithPreventivi);
      } catch (err) {
        console.error("Errore nel recupero delle attività non approvate:", err);
        setError("Impossibile caricare le attività non approvate.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Filtra le attività in base al termine di ricerca (per titolo)
  const filteredActivities = activities.filter((activity) =>
    (activity.titolo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pagamenti-pazienti">
      <NavbarDashboard />
      <div className="main-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Torna indietro
        </button>

        <div className="container">
          <div className="header">
            <h1>Attività esterne da Mostrare</h1>
            <p>Qui troverai la lista delle attività esterne che ancora devono essere approvate.</p>
          </div>

          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Cerca attività..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p>Caricamento...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="pagamenti-list">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))
              ) : (
                <p style={{ textAlign: "center" }}>Nessuna attività in attesa di approvazione.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ activity }) {
  const navigate = useNavigate();
  return (
    <div className="activity-card">
      <div className="card-content">
        <div className="user-info">
          <h3 className="user-name">{activity.titolo}</h3>
          <div className="flex items-center gap-4">
            <p className="activity-count">{activity.datainizio}</p>
            <p className="activity-count">{activity.numeroPreventivi} preventivi</p>
          </div>
        </div>
        <div className="payment-info">
          <span className="status-label">In attesa di approvazione</span>
          <button
            className="open-activity-button"
            onClick={() => navigate(`/dashboard/attivita/esterna/${activity.id}`)}
          >
            Apri Attività
          </button>
        </div>
      </div>
    </div>
  );
}
