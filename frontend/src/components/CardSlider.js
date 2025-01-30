import React, { useState } from "react";
import Card from "./Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../css/CardSlider.css";

const cardsData = [
  { id: 1, title: "Gestione Centralizzata delle Attività", description: "Pianificazione e iscrizione delle attività.", icon: "📊", sectionTitle: "Gestione e Organizzazione" },
  { id: 2, title: "Monitoraggio e Amministrazione dei Pazienti", description: "Tracciamento delle presenze e gestione dei pagamenti.", icon: "📋", sectionTitle: "Gestione e Organizzazione" },
  { id: 3, title: "Coordinamento dei Trasporti e Collaborazioni Esterne", description: "Gestione dei trasporti per le attività esterne.", icon: "🚌", sectionTitle: "Gestione e Organizzazione" },

  { id: 4, title: "Supporto ai Caregiver", description: "Strumenti per facilitare il supporto ai caregiver.", icon: "🤝", sectionTitle: "Servizi di Supporto" },
  { id: 5, title: "Gestione delle Prenotazioni", description: "Sistema per eventi, visite e servizi.", icon: "📅", sectionTitle: "Servizi di Supporto" },
  { id: 6, title: "Attività Ricreative e Culturali", description: "Organizzazione di attività culturali e sociali.", icon: "🎭", sectionTitle: "Servizi di Supporto" },

  { id: 7, title: "Gestione della Salute", description: "Monitoraggio dello stato di salute degli utenti.", icon: "⚕️", sectionTitle: "Attività e Comunicazione" },
  { id: 8, title: "Comunicazione con i Familiari", description: "Strumenti per mantenere i familiari informati.", icon: "📞", sectionTitle: "Attività e Comunicazione" },
  { id: 9, title: "Servizi Personalizzati", description: "Piani di assistenza personalizzati per gli utenti.", icon: "🛠", sectionTitle: "Attività e Comunicazione" },
];

const CardSlider = ({ setSectionTitle }) => {
  const [index, setIndex] = useState(0);
  const cardsPerPage = 3;
  const totalSlides = Math.ceil(cardsData.length / cardsPerPage);

  const nextSlide = () => {
    const slider = document.querySelector(".slider-content");
    slider.style.transition = "transform 0.6s ease-in-out"; // Durata più lenta
    slider.style.transform = "translateX(-100%)"; // Movimento più naturale
  
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
      slider.style.transition = "none"; // Reset della transizione per evitare scatti
      slider.style.transform = "translateX(0)";
    }, 600); // Stesso valore della transizione
  };
  
  const prevSlide = () => {
    const slider = document.querySelector(".slider-content");
    slider.style.transition = "transform 0.6s ease-in-out"; // Durata più lenta
    slider.style.transform = "translateX(100%)"; // Movimento più naturale
  
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      slider.style.transition = "none"; // Reset della transizione
      slider.style.transform = "translateX(0)";
    }, 600); // Stesso valore della transizione
  };

  return (
    <div className="slider-container">
      {/* Pulsante sinistra */}
      <button className="slider-button left" onClick={prevSlide}>
        <ChevronLeft size={24} />
      </button>

      {/* Card visibili */}
      <div className="slider-content">
        {cardsData.slice(index * cardsPerPage, index * cardsPerPage + cardsPerPage).map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>

      {/* Pulsante destra */}
      <button className="slider-button right" onClick={nextSlide}>
        <ChevronRight size={24} />
      </button>

      {/* Indicatori sotto le card */}
      <div className="slider-indicators">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
          key={i}
          className={`dot ${i === index ? "active" : ""}`}
          onClick={() => setIndex(i)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              setIndex((prev) => (prev + 1) % totalSlides);
            } else if (e.key === "ArrowLeft") {
              setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
            }
          }}
          aria-label={`Vai alla slide ${i + 1}`}
        >
        </button>
        
        ))}
      </div>
    </div>
  );
};

export default CardSlider;
