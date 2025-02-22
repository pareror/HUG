import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarDashboard from "../Components/NavbarDashboard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import axios from "axios";
import "../css/CalendarPage.css";

const CalendarPage = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [activitiesData, setActivitiesData] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Imposta la data di inizio del mese corrente per visualizzare il nome del mese
  const currentDate = new Date(currentYear, currentMonth, 1);
  const monthName = currentDate.toLocaleString("it-IT", { month: "long" });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:5000/api/attivita", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { tipo: "I" } // Recupera solo attività interne
        });

        const activities = response.data.activities;
        const organizedActivities = {};

        // Raggruppa le attività solo se la data (anno e mese) corrispondono a quelli correnti
        activities.forEach(activity => {
          const activityDate = new Date(activity.datainizio);
          if (
            activityDate.getFullYear() === currentYear &&
            activityDate.getMonth() === currentMonth
          ) {
            const day = activityDate.getDate();
            if (!organizedActivities[day]) {
              organizedActivities[day] = [];
            }
            organizedActivities[day].push({
              id: activity.id,
              name: activity.titolo,
              // Usa un colore fisso per le attività interne (puoi modificarlo se necessario)
              color: "#007bff"
            });
          }
        });

        setActivitiesData(organizedActivities);
      } catch (error) {
        console.error("Errore nel recupero delle attività:", error);
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
    <div className="calendar-page">
      <NavbarDashboard />
      <div className="main-content">
        <main className="calendar-main">
          <header className="calendar-header">
            <div className="header-left">
              <button className="back-button" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Torna indietro
              </button>
            </div>
            <div className="header-center">
              <h1>
                {monthName} {currentYear}
              </h1>
            </div>
            <div className="header-right">
              <button className="month-nav-button" onClick={handlePrevMonth}>
                <ArrowLeft size={20} />
              </button>
              <button className="month-nav-button" onClick={handleNextMonth}>
                <ArrowRight size={20} />
              </button>
            </div>
          </header>

          <div className="calendar-grid">
            {days.map((day) => {
              const dayActivities = activitiesData[day] || [];
              const displayActivities = dayActivities.slice(0, 3);
              const hasMore = dayActivities.length > 3;
              // Costruiamo l'URL includendo giorno, mese e anno
              const url = `/dashboard/calendario/day/${day}/${currentMonth + 1}/${currentYear}`;

              return (
                <Link key={day} to={url} className="calendar-day">
                  <div className="day-number">{day}</div>
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

export default CalendarPage;
