import React from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavbarDashboard from "../Components/NavbarDashboard";
import NavbarPazienti from "../Components/Pazienti/NavbarPazienti";
import DatiAttivita from "../Components/DatiAttivita";

function PaginaDettaglioAttivita() {
  const { id } = useParams();
  const token = localStorage.getItem("jwt");
  let role = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (error) {
      console.error("Errore nella decodifica del JWT:", error);
    }
  }
  
  const NavbarComponent = role === "paziente" ? NavbarPazienti : NavbarDashboard;

  return (
    <div className="activity-detail">
      <NavbarComponent />
      <div className="main-content-dettaglio">
        <DatiAttivita selectedKey={id} />
      </div>
    </div>
  );
}

export default PaginaDettaglioAttivita;
