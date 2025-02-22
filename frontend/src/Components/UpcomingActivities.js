import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/UpcomingActivities.css";

function StatusBadge({ status }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "In progress":
        return "status-progress";
      case "In arrivo":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  return <span className={`status-badge ${getStatusClass(status)}`}>{status}</span>;
}

export default function UpcomingActivities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:5000/api/attivita", {
          headers: { Authorization: `Bearer ${token}` },
          params: { tipo: "I" } // Recupera solo attività interne
        });
        console.log("Internal activities:", response.data.activities);

        // Data odierna in formato ISO (YYYY-MM-DD)
        const today = new Date().toISOString().slice(0, 10);
        // Filtra le attività upcoming: la data di inizio deve essere >= oggi
        const upcomingActivities = response.data.activities.filter(
          (activity) => activity.datainizio >= today
        );

        const now = new Date();
        // Mappa le attività, formattando la data e calcolando lo stato
        const mappedActivities = upcomingActivities.map((activity) => {
          // Costruisci l'oggetto Date combinando data e orario (assumendo formato "YYYY-MM-DD" e "HH:mm")
          const activityStart = new Date(`${activity.datainizio}T${activity.orainizio}:00`);
          const activityEnd = new Date(activityStart.getTime() + activity.durata * 3600000);

          // Formatta la data in formato "27 novembre 2024"
          const formattedDate = activityStart.toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          });

          // Calcola lo stato: "In progress" se il tempo corrente rientra nell'intervallo, altrimenti "In arrivo"
          let status = now >= activityStart && now <= activityEnd ? "In progress" : "In arrivo";
          
          return {
            name: activity.titolo,
            rawDate: activity.datainizio, // Per l'ordinamento
            date: formattedDate,
            time: activity.orainizio,
            status,
            participants: activity.numeroIscritti
          };
        });

        // Ordina in ordine ascendente per data (l'attività più vicina viene per prima)
        mappedActivities.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

        setActivities(mappedActivities);
      } catch (err) {
        console.error("Errore fetch attività:", err);
        setError("Impossibile caricare le attività interne upcoming.");
      }
    };

    fetchActivities();
  }, []);

  // Limita la visualizzazione a 5 attività
  const limitedActivities = activities.slice(0, 5);

  return (
    <div className="activities-table-container">
      {error && <p className="error">{error}</p>}
      <table className="activities-table">
        <thead>
          <tr>
            <th>Attività Interne</th>
            <th>Data</th>
            <th>Ora</th>
            <th>Stato</th>
            <th>Partecipanti</th>
          </tr>
        </thead>
        <tbody>
          {limitedActivities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.name}</td>
              <td>{activity.date}</td>
              <td>{activity.time}</td>
              <td>
                <StatusBadge status={activity.status} />
              </td>
              <td>{activity.participants}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pulsante "Mostra altro" visibile sempre */}
      <div className="show-more-container">
        <button className="show-more-button" onClick={() => navigate("/dashboard/attivita/interna")}>
          Mostra altro
        </button>
      </div>
    </div>
  );
}
