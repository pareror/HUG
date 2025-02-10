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

  const navigate = useNavigate();

  const currentDate = new Date(currentYear, currentMonth, 1);
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/attivita-interna", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        const activities = response.data.activities;
        const organizedActivities = {};

        activities.forEach(activity => {
          const date = new Date(activity.datainizio);
          if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
            const day = date.getDate();
            if (!organizedActivities[day]) {
              organizedActivities[day] = [];
            }
            organizedActivities[day].push({
              id: activity.id,
              name: activity.titolo,
              color: "#" + Math.floor(Math.random()*16777215).toString(16) // Colore casuale
            });
          }
        });

        setActivitiesData(organizedActivities);
      } catch (error) {
        console.error("Errore nel recupero delle attività:", error);
      }
    };

    fetchActivities();
  }, [currentMonth, currentYear]);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

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
