import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";
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

function UpcomingActivities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Decodifica il token per ottenere ruolo e userId
  const token = localStorage.getItem("jwt");
  let role = "";
  let userId = "";
  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
    userId = decoded.id;
  } catch (err) {
    console.error("Errore nella decodifica del JWT:", err);
  }

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const authHeaders = { Authorization: `Bearer ${token}` };
        let response;
        if (role === "paziente") {
          // Endpoint specifico per i pazienti
          response = await axios.get(
            `http://localhost:5000/api/pazienti/${userId}/attivita-prossime`,
            { headers: authHeaders }
          );
          // Supponiamo che l'API restituisca { attivita: [...] }
          setActivities(response.data.attivita || []);
        } else {
          // Per i centri: usa l'endpoint per le attività interne
          response = await axios.get("http://localhost:5000/api/attivita", {
            headers: authHeaders,
            params: { tipo: "I" },
          });
          // Filtra le attività future (data di inizio >= oggi)
          const today = new Date().toISOString().slice(0, 10);
          const upcoming = (response.data.activities || []).filter(
            (activity) => activity.datainizio >= today
          );
          setActivities(upcoming);
        }
      } catch (err) {
        console.error("Errore nel recupero delle attività:", err);
        setError("Impossibile caricare le attività upcoming.");
      }
    };

    fetchActivities();
  }, [token, role, userId]);

  // Limita il numero di attività visualizzate
  const limit = role === "paziente" ? 3 : 5;
  const limitedActivities = activities.slice(0, limit);

  // Ordina le attività per data e orario
  const sortedActivities = [...limitedActivities].sort((a, b) => {
    const dateA = new Date(`${a.datainizio}T${a.orainizio}:00`);
    const dateB = new Date(`${b.datainizio}T${b.orainizio}:00`);
    return dateA - dateB;
  });

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endTime = new Date();
    endTime.setHours(hours);
    endTime.setMinutes(minutes);
    endTime.setHours(endTime.getHours() + parseInt(duration));
    return endTime.toTimeString().slice(0, 5);
  };

  // Gestione del pulsante "Mostra altro"
  const handleShowMore = () => {
    if (role === "paziente") {
      navigate("/pazienti/attivita/iscritto");
    } else {
      navigate("/dashboard/attivita/interna");
    }
  };

  // Ritorna la tabella con i dati formattati
  return (
    <div className="activities-table-container">
      {error && <p className="error">{error}</p>}
      <table className="activities-table">
        <thead>
          <tr>
            <th>{role === "paziente" ? "Attività Iscritto" : "Attività Interne"}</th>
            <th>Data</th>
            <th>Ora</th>
            <th>Stato</th>
            <th>Partecipanti</th>
          </tr>
        </thead>
        <tbody>
          {sortedActivities.map((activity, index) => {
            // Format della data in "27 novembre 2024"
            const activityStart = new Date(`${activity.datainizio}T${activity.orainizio}:00`);
            const formattedDate = activityStart.toLocaleDateString("it-IT", {
              day: "2-digit",
              month: "long",
              year: "numeric"
            });
            // Calcola stato basato sull'orario corrente
            const now = new Date();
            const activityEnd = new Date(activityStart.getTime() + activity.durata * 3600000);
            const status = (now >= activityStart && now <= activityEnd) ? "In progress" : "In arrivo";

            return (
              <tr
                key={index}
                onClick={() => {
                  if (role === "paziente") {
                    if (activity.tipo === "I") {
                      navigate(`/pazienti/attivita/interna/${activity.activityId}`);
                    } else if (activity.tipo === "E") {
                      navigate(`/pazienti/attivita/esterna/${activity.activityId}`);
                    }
                  } else {
                    navigate(`/dashboard/attivita/interna/${activity.id}`);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <td>{activity.titolo}</td>
                <td>{formattedDate}</td>
                <td>
                  {activity.orainizio} - {calculateEndTime(activity.orainizio, activity.durata)}
                </td>
                <td>
                  <StatusBadge status={status} />
                </td>
                <td>{activity.numeroIscritti}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="show-more-container">
        <button className="show-more-button" onClick={handleShowMore}>
          Mostra altro
        </button>
      </div>
    </div>
  );
}
export default UpcomingActivities;
