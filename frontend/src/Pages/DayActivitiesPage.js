import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavbarDashboard from "../Components/NavbarDashboard";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../css/DayActivitiesPage.css";

const DayActivitiesPage = () => {
  // Ora la route contiene day, month e year
  const { day, month, year } = useParams();
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  // Ottieni token dal localStorage e decodifica per ottenere ruolo e id
  const token = localStorage.getItem("jwt");
  let role = "";
  let userId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;  // Supponiamo che il token contenga una proprietà 'role'
      userId = decoded.id;  // Supponiamo che l'id dell'utente sia in 'id'
    } catch (error) {
      console.error("Errore nella decodifica del JWT:", error);
    }
  }

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const authHeaders = { Authorization: `Bearer ${token}` };
        let response;

        if (role === "paziente") {
          // Se l'utente è un paziente, usa l'API per le attività a cui è iscritto
          response = await axios.get(
            `http://localhost:5000/api/pazienti/${userId}/calendario-attivita`,
            { headers: authHeaders }
          );
        } else {
          // Se l'utente è un centro diurno, usa l'API per le attività interne
          response = await axios.get("http://localhost:5000/api/attivita", {
            headers: authHeaders,
            params: { tipo: "I" },
          });
        }

        // Filtra le attività in base al giorno, mese ed anno specificati
        const filteredActivities = response.data.activities.filter((activity) => {
          const activityDate = new Date(activity.datainizio);
          return (
            activityDate.getDate() === parseInt(day) &&
            (activityDate.getMonth() + 1) === parseInt(month) &&
            activityDate.getFullYear() === parseInt(year)
          );
        });

        // Ordina le attività per orario di inizio
        filteredActivities.sort((a, b) => a.orainizio.localeCompare(b.orainizio));

        setActivities(filteredActivities);
      } catch (err) {
        console.error("Errore nel recupero delle attività:", err);
      }
    };

    fetchActivities();
  }, [day, month, year, role, token, userId]);

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endTime = new Date();
    endTime.setHours(hours);
    endTime.setMinutes(minutes);
    endTime.setHours(endTime.getHours() + parseInt(duration));
    return endTime.toTimeString().slice(0, 5);
  };

  return (
    <div className="day-activities-page">
      <NavbarDashboard />
      <div className="main-content">
        <main className="day-activities-main">
          <header className="day-activities-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Torna indietro
            </button>
            <h1>Attività del Giorno {day}/{month}/{year}</h1>
          </header>
          <div className="activities-list">
            {activities.length === 0 ? (
              <p>Nessuna attività per questo giorno.</p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="activity-item"
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
                  <span
                    className="activity-dot"
                    style={{
                      backgroundColor:
                        activity.tipo === "I" ? "#007bff" : "#ff5733",
                    }}
                  ></span>
                  <div className="activity-details">
                    <h3>{activity.titolo}</h3>
                    <p>
                      {activity.orainizio} - {calculateEndTime(activity.orainizio, activity.durata)}
                    </p>
                    <p>
                      <strong>Sala:</strong> {activity.luogo}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DayActivitiesPage;
