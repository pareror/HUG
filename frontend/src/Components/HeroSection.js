import React from "react";
import "../css/HeroSection.css";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Benvenuti in H.U.G.</h1>
        <p>
          La piattaforma digitale che connette centri diurni, anziani, caregiver, enti esterni e tour operator.
          H.U.G. semplifica la gestione e promuove la socializzazione attraverso attività socioculturali proposte dagli enti esterni
          e trasporti efficienti garantiti dai tour operator, migliorando il benessere degli utenti e rendendo ogni esperienza accessibile e organizzata.
        </p>
        <button className="cta-button" onClick={() => navigate("/register")}>Non hai ancora un account? REGISTRATI ORA</button>
      </div>
      <div className="hero-image">
        <img src="/images/community.jpg" alt="Anziani che giocano a carte"/>
      </div>
    </section>
  );
};

export default HeroSection;
