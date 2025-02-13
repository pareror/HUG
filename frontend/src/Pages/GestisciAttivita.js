import { ArrowLeft, Search } from "lucide-react";
import { useState, useEffect } from "react";
import "../css/PagamentiPazienti.css";
import NavbarDashboard from "../Components/NavbarDashboard";
import { useNavigate } from "react-router-dom";
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
        const response = await axios.get("http://localhost:5000/api/attivita-esterne/gestione", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setActivities(response.data.activities || []);
      } catch (err) {
        console.error("Errore nel recupero delle attività non approvate:", err);
        setError("Impossibile caricare le attività non approvate.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((activity) =>
    activity.titolo.toLowerCase().includes(searchTerm.toLowerCase())
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
            <p>{error}</p>
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
            <p className="activity-count">0 preventivi</p>
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
