import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronUp, ChevronDown } from "lucide-react";
import "../css/NotificationDropdown.css"; // Import del CSS

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Simuliamo alcune notifiche
  const notifications = [
    {
      id: 1,
      title: "Nuovo Pagamento",
      description: "Mario Rossi ha effettuato un pagamento per Corso di Pittura",
      time: "2 minuti fa",
    },
    {
      id: 2,
      title: "Iscrizione confermata",
      description: "Giulia Bianchi si è iscritta a Yoga per Anziani",
      time: "1 ora fa",
    },
    {
      id: 3,
      title: "Promemoria",
      description: "Laboratorio di Cucina inizierà tra 30 minuti",
      time: "3 ore fa",
    },
  ];

  // Chiude il menu notifiche se si clicca fuori
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
    <div className="dropdown notification-dropdown" ref={dropdownRef}>
      <button
        className="notification-btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Bell size={22} />
        <span className="notification-badge">{notifications.length}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="dropdown-menu notification-menu">
          <div className="notification-header">
            <strong>Notifiche</strong>
            <Link to="/dashboard/notifiche" className="see-all">
              Vedi tutte
            </Link>
          </div>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="notification">
                <strong>{notification.title}</strong>
                <p>{notification.description}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
            ))
          ) : (
            <p className="no-notifications">Nessuna notifica disponibile</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
