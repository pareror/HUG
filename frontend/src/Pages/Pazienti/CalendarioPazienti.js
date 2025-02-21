import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarPazienti from "../Components/NavbarPazienti";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "../css/CalendarPage.css";

const CalendarioPazienti = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const navigate = useNavigate();

  const currentDate = new Date(currentYear, currentMonth, 1);
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

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
      <NavbarPazienti />
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
            {days.map((day) => (
              <Link key={day} to={`/pazienti/calendario/day/${day}`} className="calendar-day">
                <div className="day-number">{day}</div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}; 

export default CalendarioPazienti;
