import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../../css/Pazienti/ListaAttivitaPazienti.css";
import AttivitaPazientiCard from "./AttivitaPazientiCard";

export default function AttivitaIscrittoPazientiTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funzione per formattare la data (da YYYY-MM-DD a DD-MM-YYYY)
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const decoded = jwtDecode(token);
        const patientId = decoded.id;
        // API per recuperare le attività future a cui il paziente è iscritto
        const response = await axios.get(
          `http://localhost:5000/api/pazienti/${patientId}/attivita-prossime`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Supponiamo che la risposta abbia il formato { attivita: [...] }
        setActivities(response.data.attivita || []);
      } catch (err) {
        console.error("Errore nel recupero delle attività:", err);
        setError("Errore durante il recupero delle attività.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((activity) =>
    activity.titolo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ordina le attività per data (le più prossime in cima)
  filteredActivities.sort((a, b) => new Date(a.datainizio) - new Date(b.datainizio));

  if (loading) return <div>Caricamento...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="attivita-tab-container">
      <div className="attivita-tab-header">
        <h1>Attività a cui sei iscritto</h1>
        <p>Qui troverai le attività future a cui sei iscritto</p>
      </div>
      <div className="attivita-tab-search-container">
        <Search className="attivita-search-icon" />
        <input
          type="text"
          placeholder="Cerca attività..."
          className="attivita-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="attivita-tab-list">
        {filteredActivities.map((activity) => (
          <AttivitaPazientiCard
            key={activity.id}
            id={activity.id}
            name={activity.titolo}
            date={formatDate(activity.datainizio)}
            tipo={activity.tipo} // "I" oppure "E"
            image={activity.immagine}
            luogo={activity.luogo}
            istruttore={activity.istruttore}
            durata={activity.durata}
            orainizio={activity.orainizio}
          />
        ))}
      </div>
    </div>
  );
}
