import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarDashboard from "../Components/NavbarDashboard";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import "../css/DayActivitiesPage.css";

const DayActivitiesPage = () => {
  const { day } = useParams();
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/attivita", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          params: { tipo: "I" } // ✅ Recupera solo attività interne
        });

        const activities = response.data.activities.filter((activity) => {
          const activityDate = new Date(activity.datainizio);
          return activityDate.getDate() === parseInt(day);
        });

        // ✅ Ordina le attività per orario di inizio
        activities.sort((a, b) => a.orainizio.localeCompare(b.orainizio));

        setActivities(activities);
      } catch (error) {
        console.error("Errore nel recupero delle attività:", error);
      }
    };

    fetchActivities();
  }, [day]);


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
            <h1>Attività del Giorno {day}</h1>
          </header>
          <div className="activities-list">
            {activities.length === 0 ? (
              <p>Nessuna attività per questo giorno.</p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="activity-item"
                  onClick={() => navigate(`/dashboard/attivita/interna/${activity.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <span
                    className="activity-dot"
                    style={{ backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16) }}
                  ></span>
                  <div className="activity-details">
                    <h3>{activity.titolo}</h3>
                    <p>{activity.orainizio} - {calculateEndTime(activity.orainizio, activity.durata)}</p>
                    <p><strong>Sala:</strong> {activity.luogo}</p>
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
