import React, { useState } from "react";
import HeroSection from '../Components/HeroSection';
import Navbar from '../Components/Navbar'
import '../css/App.css'
import CardSlider from '../Components/CardSlider';
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import Footer from "../Components/Footer"
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
        <ContactUs />
      </div>
    <Footer />
    </div>
  );
}

export default App;
