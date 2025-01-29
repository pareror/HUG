import React, { useState } from "react";
import HeroSection from '../Components/HeroSection';
import Navbar from '../Components/Navbar'
import '../css/App.css'
import CardSlider from '../Components/CardSlider';
function App() {
  const items = [{name: "Home", fragment: "#home"}, {name: "Servizi", fragment: "#services"}, {name: "Chi siamo", fragment: "#aboutus"}, {name: "Contatti", fragment: "#contact"}, {name: "Accedi", fragment: "#signin"}];
  const [sectionTitle, setSectionTitle] = useState("Gestione e Organizzazione");
  return (
    <div className="App">
      <Navbar items={items}/>
      <HeroSection />
      <h2 className="section-title">{sectionTitle}</h2>
      <CardSlider setSectionTitle={setSectionTitle} />
      <h2 className="section-title">I Nostri Servizi: Centri Diurni</h2><h2 className="section-title">I Nostri Servizi: Centri Diurni</h2><h2 className="section-title">I Nostri Servizi: Centri Diurni</h2><h2 className="section-title">I Nostri Servizi: Centri Diurni</h2><h2 className="section-title">I Nostri Servizi: Centri Diurni</h2><h2 className="section-title">I Nostri Servizi: Centri Diurni</h2>
    </div>
  );
}

export default App;
