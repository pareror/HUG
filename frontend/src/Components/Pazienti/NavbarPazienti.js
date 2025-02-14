import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ChevronUp, User, Settings, LogOut, Menu, X } from "lucide-react"
import "../../css/Pazienti/NavbarPazienti.css"
import LogoutButton from "../LogoutButton"
import NotificationDropdown from "../NotificationDropdown"
import axios from "axios"

const NavbarPazienti = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [profileInfo, setProfileInfo] = useState({
    username: "",
    email: "",
    role: "",
    emailPec: "",
    foto: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profilo", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        })
        if (response.data.profile) {
          const p = response.data.profile
          setProfileInfo({
            username: p.username || "",
            email: p.email || "",
            role: p.role || "",
            emailPec: p.emailPec || "",
            fotoProfilo: p.fotoProfilo || "/images/profilo.png",
          })
        }
      } catch (err) {
        console.error("Errore nel caricamento del profilo:", err)
      }
    }
    fetchProfile()
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const toggleDropdown = (section) => {
    setActiveDropdown((prev) => (prev === section ? null : section))
  }

  const closeMenu = () => {
    setMenuOpen(false)
    setActiveDropdown(null)
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleMenu()
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".pazienti-navbar-dashboard")) {
        setMenuOpen(false)
        setActiveDropdown(null)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        closeMenu()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [closeMenu]) // Added closeMenu to dependencies

  return (
    <nav className="pazienti-navbar-dashboard">
      <Link to="/dashboard" className="pazienti-navbar-logo" onClick={handleLinkClick}>
        <img src="/images/logo.png" alt="Logo" className="pazienti-logo" />
      </Link>

      <div className={`pazienti-navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/pazienti/calendario" onClick={handleLinkClick}>
          Calendario Attività
        </Link>

        <Link to="/pazienti/attivita/iscritto" onClick={handleLinkClick}>
          Attività a cui sei iscritto
        </Link>

        <div className="pazienti-dropdown">
          <button className="pazienti-dropdown-toggle" onClick={() => toggleDropdown("attivita")}>
            Attività {activeDropdown === "attivita" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <div className={`pazienti-dropdown-menu ${activeDropdown === "attivita" ? "show" : ""}`}>
            <Link to="/pazienti/attivita/interna" onClick={handleLinkClick}>
              Interna
            </Link>
            <Link to="/pazienti/attivita/esterna" onClick={handleLinkClick}>
              Esterna
            </Link>
          </div>
        </div>

        <div className="pazienti-dropdown">
          <button className="pazienti-dropdown-toggle" onClick={() => toggleDropdown("gestionePagamenti")}>
            Gestione Pagamenti{" "}
            {activeDropdown === "gestionePagamenti" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <div className={`pazienti-dropdown-menu ${activeDropdown === "gestionePagamenti" ? "show" : ""}`}>
            <Link to="/pazienti/pagamenti/attivita" onClick={handleLinkClick}>
              Pag. per attività
            </Link>
          </div>
        </div>
      </div>

      <div className="pazienti-navbar-right">
        <button className="pazienti-menu-toggle" onClick={toggleMenu} aria-label="Apri menu">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <NotificationDropdown />

        <div className="pazienti-dropdown pazienti-profile-dropdown">
          <button className="pazienti-profile-toggle" onClick={() => toggleDropdown("profilo")}>
            <img
              src={profileInfo.fotoProfilo || "/images/profilo.png"}
              alt="Profilo"
              className="pazienti-profile-pic"
            />
            <span>Profilo</span>
            {activeDropdown === "profilo" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <div className={`pazienti-dropdown-menu pazienti-profile-menu ${activeDropdown === "profilo" ? "show" : ""}`}>
            <div className="pazienti-profile-info">
              <strong>{profileInfo.username}</strong>
              {profileInfo.email && <p>{profileInfo.email}</p>}
              {(profileInfo.role === "direttorecentro" ||
                profileInfo.role === "touroperator" ||
                profileInfo.role === "enteesterno") &&
                profileInfo.emailPec && <p>Email: {profileInfo.emailPec}</p>}
            </div>
            <hr />
            <Link to="/pazienti/profilo" onClick={handleLinkClick}>
              <User size={16} /> Profilo
            </Link>
            <Link to="/pazienti/impostazioni" onClick={handleLinkClick}>
              <Settings size={16} /> Impostazioni
            </Link>
            <hr />
            <div className="pazienti-logout-container" onClick={handleLinkClick}>
              <LogOut size={16} />
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavbarPazienti

