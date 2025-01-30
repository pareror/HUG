import React, { useState } from "react";
import HeroSection from '../Components/HeroSection';
import Navbar from '../Components/Navbar'
import '../css/App.css'
import CardSlider from '../Components/CardSlider';
import AboutUs from "./AboutUs";

function App() {
  const items = [
    { name: "Home", fragment: "#home" },
    { name: "Servizi", fragment: "#services" },
    { name: "Chi siamo", fragment: "#aboutus" },
    { name: "Contatti", fragment: "#contact" }
  ];

  const [sectionTitle, setSectionTitle] = useState("Gestione e Organizzazione");

  return (
    <div className="App">
      {/* Navbar con link agli ID delle sezioni */}
      <Navbar items={items} />

      {/* Sezione Home */}
      <div id="home">
        <HeroSection />
      </div>

      {/* Sezione Servizi */}
      <div id="services">
        <h2 className="section-title">{sectionTitle}</h2>
        <CardSlider setSectionTitle={setSectionTitle} />
      </div>

      {/* Sezione Chi Siamo */}
      <div id="aboutus">
        <AboutUs />
      </div>

      {/* Sezione Contatti */}
      <div id="contact">
        <h2 className="section-title">Contattaci</h2>
        <p className="section-content">
          Per qualsiasi informazione, puoi contattarci via email o telefono.
        </p>
      </div>

      {/* Sezione Accedi */}
      <div id="signin">
        <h2 className="section-title">Accedi</h2>
        <p className="section-content">
          Effettua l'accesso per gestire le tue attività e servizi.
        </p>
      </div>
    </div>
  );
}

export default App;
