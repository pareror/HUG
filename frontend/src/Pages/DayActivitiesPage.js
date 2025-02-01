import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavbarDashboard from "../Components/NavbarDashboard";
import { ArrowLeft } from "lucide-react";
import "../css/DayActivitiesPage.css";

const DayActivitiesPage = () => {
  const { day } = useParams();
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  // Simula il recupero delle attività per il giorno selezionato
  useEffect(() => {
    const fakeData = {
      1: [
        { id: 1, name: "Yoga", color: "#ff5733", description: "Lezione di yoga mattutina" },
        { id: 2, name: "Pilates", color: "#33c1ff", description: "Sessione di pilates" }
      ],
      2: [
        { id: 3, name: "Running", color: "#33ff57", description: "Corsa serale" },
        { id: 4, name: "Swimming", color: "#3357ff", description: "Allenamento in piscina" },
        { id: 5, name: "Cycling", color: "#ff33a8", description: "Giro in bicicletta" },
        { id: 6, name: "Boxing", color: "#a833ff", description: "Sessione di boxe" }
      ]
      // Aggiungi altri giorni se necessario
    };

    setTimeout(() => {
      setActivities(fakeData[day] || []);
    }, 500);
  }, [day]);

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
          <h1>Attività del Giorno {day}</h1>
        </header>
        <div className="activities-list">
          {activities.length === 0 ? (
            <p>Nessuna attività per questo giorno.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <span
                  className="activity-dot"
                  style={{ backgroundColor: activity.color }}
                ></span>
                <div className="activity-details">
                  <h3>{activity.name}</h3>
                  <p>{activity.description}</p>
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
