import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarDashboard from "../Components/NavbarDashboard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "../css/CalendarPage.css";

const CalendarPage = () => {
  // Stato per il mese e anno correnti
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0 = Gennaio, …, 11 = Dicembre

  const navigate = useNavigate();

  // Calcola il numero di giorni e il nome del mese corrente
  const currentDate = new Date(currentYear, currentMonth, 1);
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Stato per simulare i dati delle attività (da sostituire con chiamate API)
  const [activitiesData, setActivitiesData] = useState({});

  useEffect(() => {
    // Dati fittizi: le chiavi sono il numero del giorno (1,2,...) e il valore un array di attività
    const fakeData = {
      1: [
        { id: 1, name: "Yoga", color: "#ff5733" },
        { id: 2, name: "Pilates", color: "#33c1ff" }
      ],
      2: [
        { id: 3, name: "Running", color: "#33ff57" },
        { id: 4, name: "Swimming", color: "#3357ff" },
        { id: 5, name: "Cycling", color: "#ff33a8" },
        { id: 6, name: "Boxing", color: "#a833ff" }
      ],
      5: [
        { id: 7, name: "Zumba", color: "#ff9933" }
      ],
      10: [
        { id: 8, name: "Crossfit", color: "#33ffcc" },
        { id: 9, name: "HIIT", color: "#cc33ff" }
      ]
      // Aggiungi altre chiavi se necessario
    };

    // Simula una chiamata API con un ritardo di 500ms
    setTimeout(() => {
      setActivitiesData(fakeData);
    }, 500);
  }, [currentMonth, currentYear]);

  // Genera un array contenente i giorni da 1 a daysInMonth
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Funzioni per navigare tra i mesi
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
          {/* Pulsante torna indietro */}
          <div className="header-left">
            <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Torna indietro
            </button>
          </div>
          {/* Titolo con mese e anno */}
          <div className="header-center">
            <h1>
              {monthName} {currentYear}
            </h1>
          </div>
          {/* Navigazione tra i mesi */}
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
            const activities = activitiesData[day] || [];
            const displayActivities = activities.slice(0, 3);
            const hasMore = activities.length > 3;
            return (
              <Link key={day} to={`/dashboard/calendario/day/${day}`} className="calendar-day">
                <div className="day-number">{day}</div>
                <div className="activities-indicator">
                  {displayActivities.map((activity) => (
                    <span
                      key={activity.id}
                      className="activity-dot"
                      style={{ backgroundColor: activity.color }}
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
