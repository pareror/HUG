import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "../css/NavbarDashboard.css";

const NavbarDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Apertura/chiusura menu mobile
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Gestione apertura dei dropdown: se uno è già aperto, chiude il precedente
  const toggleDropdown = (section) => {
    setActiveDropdown((prev) => (prev === section ? null : section));
  };

  // Chiude menu e dropdown se si clicca fuori dalla navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".navbar-dashboard")) {
        setMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar-dashboard">
      {/* Logo a sinistra */}
      <Link to="/dashboard" className="navbar-logo">
        <img src="/images/logo.png" alt="Logo" className="logo" />
      </Link>

      {/* Menu Desktop (le voci principali) */}
      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/dashboard/calendario" onClick={toggleMenu}>
          Calendario Attività
        </Link>

        {/* Dropdown Attività */}
        <div className="dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => toggleDropdown("attivita")}
          >
            Attività{" "}
            {activeDropdown === "attivita" ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          <div
            className={`dropdown-menu ${
              activeDropdown === "attivita" ? "show" : ""
            }`}
          >
            <Link to="/dashboard/attivita/interna" onClick={toggleMenu}>
              Interna
            </Link>
            <Link to="/dashboard/attivita/esterna" onClick={toggleMenu}>
              Esterna
            </Link>
          </div>
        </div>

        {/* Dropdown Gestione Utenza */}
        <div className="dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => toggleDropdown("gestioneUtenza")}
          >
            Gestione Utenza{" "}
            {activeDropdown === "gestioneUtenza" ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          <div
            className={`dropdown-menu ${
              activeDropdown === "gestioneUtenza" ? "show" : ""
            }`}
          >
            <Link to="/dashboard/utenza/pazienti" onClick={toggleMenu}>
              Pazienti
            </Link>
            <Link to="/dashboard/utenza/caregiver" onClick={toggleMenu}>
              Caregiver
            </Link>
          </div>
        </div>

        {/* Dropdown Gestione Pagamenti */}
        <div className="dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => toggleDropdown("gestionePagamenti")}
          >
            Gestione Pagamenti{" "}
            {activeDropdown === "gestionePagamenti" ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          <div
            className={`dropdown-menu ${
              activeDropdown === "gestionePagamenti" ? "show" : ""
            }`}
          >
            <Link to="/dashboard/pagamenti/paziente" onClick={toggleMenu}>
              Pag. per paziente
            </Link>
            <Link to="/dashboard/pagamenti/attivita" onClick={toggleMenu}>
              Pag. per attività
            </Link>
          </div>
        </div>

        <Link to="/dashboard/preventivi" onClick={toggleMenu}>
          Lista Preventivi
        </Link>
      </div>

      {/* Sezione a destra */}
      <div className="navbar-right">
        {/* Menu Toggle (hamburger) - visibile solo su mobile */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Apri menu">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Notifiche */}
        <button className="notification-btn">
          <Bell size={22} />
          <span className="notification-badge">2</span>
        </button>

        {/* Profilo */}
        <div className="dropdown profile-dropdown">
          <button
            className="profile-toggle"
            onClick={() => toggleDropdown("profilo")}
          >
            <img src="/images/profile.png" alt="Profilo" className="profile-pic" />
            <span>Profilo</span>
            {activeDropdown === "profilo" ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          <div
            className={`dropdown-menu profile-menu ${
              activeDropdown === "profilo" ? "show" : ""
            }`}
          >
            <div className="profile-info">
              <strong>Korian</strong>
              <p>korian.centro@example.com</p>
            </div>
            <hr />
            <Link to="/dashboard/profilo" onClick={toggleMenu}>
              <User size={16} /> Profilo
            </Link>
            <Link to="/dashboard/impostazioni" onClick={toggleMenu}>
              <Settings size={16} /> Impostazioni
            </Link>
            <hr />
            <Link to="/logout" className="logout-btn" onClick={toggleMenu}>
              <LogOut size={16} /> Esci
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
