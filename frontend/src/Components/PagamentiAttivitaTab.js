import { useState, useEffect } from "react";
import axios from "axios";
import "../css/PagamentiPazienti.css";
import PagamentiAttivitaCard from "./PagamentiAttivitaCard";
import { Search } from "lucide-react";

export default function PagamentiAttivitaTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  // **Funzione per recuperare le attività con pagamenti**
  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("jwt"); // Recupera il JWT
      const response = await axios.get("http://localhost:5000/api/pagamenti-attivita", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Attività con pagamenti:", response.data.attivita);
      setActivities(response.data.attivita || []);
    } catch (err) {
      console.error("Errore nel recupero delle attività:", err);
      setError("Errore durante il recupero delle attività.");
    }
  };

  // **Effettua la chiamata API al primo rendering**
  useEffect(() => {
    fetchActivities();
  }, []);

  // Filtra le attività in base alla ricerca
  const filteredActivities = activities.filter((activity) =>
    activity.titolo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ordina in ordine decrescente in base al totale da recuperare
  const sortedActivities = [...filteredActivities].sort(
    (a, b) => b.totaleDaRecuperare - a.totaleDaRecuperare
  );

  return (
    <div className="container">
      <div className="header">
        <h1>Pagamenti per Attività</h1>
        <p>Qui troverai la lista dei pagamenti per attività</p>
      </div>

      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Cerca attività..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Mostra errore se presente */}
      {error && <p className="error">{error}</p>}

      <div className="pagamenti-list">
        {sortedActivities.length > 0 ? (
          sortedActivities.map((activity) => (
            <PagamentiAttivitaCard
              key={activity.id}
              id={activity.id}
              name={activity.titolo}
              date={activity.dataAttivita}
              participants={activity.numeroPartecipanti}
              amount={activity.totaleDaRecuperare}
              pendingPayments={activity.numeroNonPaganti}
            />
          ))
        ) : (
          <p>Nessuna attività trovata.</p>
        )}
      </div>
    </div>
  );
}
