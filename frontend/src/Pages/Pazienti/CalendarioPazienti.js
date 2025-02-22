import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti";
import { ArrowLeft, ArrowRight } from "lucide-react";
import axios from "axios";
import "../../css/Pazienti/CalendarioPazienti.css";
import {jwtDecode} from "jwt-decode";

const CalendarioPazienti = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [activitiesData, setActivitiesData] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const currentDate = new Date(currentYear, currentMonth, 1);
  const monthName = currentDate.toLocaleString("it-IT", { month: "long" });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const patientId = jwtDecode(token).id;
        const response = await axios.get(
          `http://localhost:5000/api/pazienti/${patientId}/calendario-attivita`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Attività paziente:", response.data.activities);

        // Formattiamo le attività per renderle facili da usare nel calendario
        const organizedActivities = response.data.activities.reduce((acc, activity) => {
          const date = new Date(activity.datainizio);
          if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
            const day = date.getDate();
            if (!acc[day]) acc[day] = [];
            acc[day].push({
              id: activity.activityId,
              name: activity.titolo,
              type: activity.tipo, // Distinzione interna/esterna
              color: activity.tipo === "I" ? "#007bff" : "#ff5733", // Blu per interne, rosso per esterne
            });
          }
          return acc;
        }, {});

        setActivitiesData(organizedActivities);
      } catch (err) {
        console.error("Errore nel recupero delle attività:", err);
        setError("Errore durante il recupero delle attività.");
      }
    };

    fetchActivities();
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  return (
    <div className="calendar-page-pazienti">
      <NavbarPazienti />
      <div className="main-content-pazienti">
        <main className="calendar-main-pazienti">
          <header className="calendar-header-pazienti">
            <div className="header-left-pazienti">
              <button className="back-button-pazienti" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Torna indietro
              </button>
            </div>
            <div className="header-center-pazienti">
              <h1>
                {monthName} {currentYear}
              </h1>
            </div>
            <div className="header-right-pazienti">
              <button className="month-nav-button-pazienti" onClick={handlePrevMonth}>
                <ArrowLeft size={20} />
              </button>
              <button className="month-nav-button-pazienti" onClick={handleNextMonth}>
                <ArrowRight size={20} />
              </button>
            </div>
          </header>

          <div className="calendar-grid-pazienti">
            {days.map((day) => {
              const activities = activitiesData[day] || [];
              const displayActivities = activities.slice(0, 3);
              const hasMore = activities.length > 3;

              return (
                <Link key={day} to={`/pazienti/calendario/day/${day}`} className="calendar-day-pazienti">
                  <div className="day-number-pazienti">{day}</div>
                  <div className="activities-indicator">
                    {displayActivities.map((activity) => (
                      <span
                        key={activity.id}
                        className="activity-dot"
                        style={{ backgroundColor: activity.color }}
                        title={activity.name}
                      ></span>
                    ))}
                    {hasMore && <span className="more-dots">…</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarioPazienti;
