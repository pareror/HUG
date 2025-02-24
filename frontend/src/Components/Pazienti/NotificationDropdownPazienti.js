import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronUp, ChevronDown } from "lucide-react";
import "../../css/Pazienti/NotificationDropdownPazienti.css"; // New CSS file for patients

const NotificationDropdownPazienti = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Simulated patient notifications
  const patientNotifications = [
    {
      id: 1,
      title: "Visista Confermata",
      description: "La tua visita fiosioterapica è stata confermata per domani alle 10:00.",
      time: "2 minuti fa",
    },
    {
      id: 2,
      title: "Ricetta pronta",
      description: "La tua ricetta per gli esami del sangue è ora disponibile in segreteria.",
      time: "1 ore fa",
    },
    {
      id: 3,
      title: "Nuovo corso",
      description: "Hai la possibilità di iscriverti al nuovo corso di ginnastica dolce tra 3 giorni.",
      time: "1 giorno fa",
    },
  ];

  // Closes the menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown patient-notification-dropdown" ref={dropdownRef}>
      <button
        className="patient-notification-btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Bell size={22} />
        <span className="patient-notification-badge">{patientNotifications.length}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="dropdown-menu patient-notification-menu">
          <div className="patient-notification-header">
            <strong>Notifiche Pazienti</strong>
            <Link to="/pazienti/notifiche" className="see-all">
              Vedi tutte
            </Link>
          </div>
          {patientNotifications.length > 0 ? (
            patientNotifications.map((notification) => (
              <div key={notification.id} className="patient-notification">
                <strong>{notification.title}</strong>
                <p>{notification.description}</p>
                <span className="patient-notification-time">{notification.time}</span>
              </div>
            ))
          ) : (
            <p className="no-patient-notifications">Nessuna notifica disponibile</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdownPazienti;
