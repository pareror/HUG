import React from "react";
import "../css/AboutUs.css";

const AboutUs = () => {
  return (
    <section className="about-us" id="aboutus">
      <div className="about-us-container">
        {/* Testo e Immagine */}
        <div className="about-us-content">
          <div className="about-us-text">
            <h2 className="section-title">About Us</h2>
            <p>
              H.U.G è nata dalla passione e dall’impegno di un team di professionisti 
              dedicati al miglioramento della qualità della vita degli anziani. La nostra 
              missione è quella di fornire strumenti innovativi per semplificare la gestione 
              dei centri diurni e promuovere la socializzazione e il benessere degli ospiti.
            </p>
            <p>
              Fondata nel 2024, la nostra piattaforma è il risultato di anni di ricerca e 
              collaborazione con esperti del settore, operatori sanitari e famiglie. 
              Crediamo fermamente che la tecnologia possa fare la differenza nella vita 
              degli anziani, offrendo opportunità di coinvolgimento, connessione e cura personalizzata.
            </p>
          </div>
          <div className="about-us-image">
            <img src="/images/aboutus.jpg" alt="About Us - Team handshake" />
          </div>
        </div>

        {/* Sezione Valori */}
        <h2 className="section-title">Our Values</h2>
        <div className="values-container">
          <div className="value-card">
          <span className="value-icon">💚</span>
            <h3>Compassione</h3>
            <p>Poniamo il benessere e la dignità degli anziani al centro di tutto ciò che facciamo.</p>
            </div>

            <div className="value-card">
              <span className="value-icon">🔗</span>
              <h3>Comunità</h3>
              <p>Crediamo nel potere della connessione e della socializzazione per migliorare la qualità della vita.</p>
            </div>

            <div className="value-card">
              <span className="value-icon">💡</span>
              <h3>Innovazione</h3>
              <p>Utilizziamo la tecnologia in modo creativo per affrontare le sfide dell'invecchiamento e dell'assistenza sanitaria.</p>
            </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;
