import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarDashboard from "../Components/NavbarDashboard";
import "../css/DettaglioPreventivo.css";

const DettaglioPreventivo = () => {
  const { idPreventivo } = useParams(); // L'URL contiene :idPreventivo
  const navigate = useNavigate();
  const [preventivo, setPreventivo] = useState(null);
  const [accettato, setAccettato] = useState(null); // 0 = non accettato, 1 = accettato
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funzione per recuperare i dettagli del preventivo dal backend
  const fetchPreventivo = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        `http://localhost:5000/api/preventivi/${idPreventivo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data.preventivo;
      setPreventivo(data);
      setAccettato(data.accettato);
    } catch (err) {
      console.error("Errore nel recupero del preventivo:", err);
      setError("Errore durante il recupero dei dettagli del preventivo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreventivo();
  }, [idPreventivo]);

  // Funzione per gestire il toggle dell'accettazione
  const handleToggleAccettazione = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (accettato === 1) {
        // Annulla l'accettazione
        await axios.put(
          `http://localhost:5000/api/preventivi/${idPreventivo}/annulla`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Accetta il preventivo
        await axios.put(
          `http://localhost:5000/api/preventivi/${idPreventivo}/accetta`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      // Ricarica i dati per aggiornare lo stato
      fetchPreventivo();
    } catch (err) {
      console.error("Errore durante il toggle dell'accettazione:", err);
      setError("Errore durante l'aggiornamento dello stato del preventivo.");
    }
  };

  if (loading) {
    return (
      <div className="pre-det-base">
        <NavbarDashboard />
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pre-det-base">
        <NavbarDashboard />
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!preventivo) {
    return (
      <div className="pre-det-base">
        <NavbarDashboard />
        <p>Nessun preventivo trovato.</p>
      </div>
    );
  }

  return (
    <div className="pre-det-base">
      <NavbarDashboard />
      <div className="pre-det-container">
        <div className="pre-det-content-box">
          <div className="pre-det-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Torna indietro
            </button>
            <h1 className="pre-det-title">Dettagli preventivo</h1>
            {/* Banner di stato (in alto a destra) */}
            {accettato === 1 && (
              <div className="accepted-banner">
                Preventivo accettato
              </div>
            )}
          </div>

          <h2 className="pre-det-subtitle">{preventivo.titolo}</h2>

          <div className="pre-det-main-info">
            <div className="pre-det-left-section">
              <div className="pre-det-row">
                <div className="pre-det-field">
                  <span className="pre-det-label">Ragione Sociale</span>
                  <span>{preventivo.ragioneSociale}</span>
                </div>
                <div className="pre-det-field">
                  <span className="pre-det-label">Data</span>
                  <span>{preventivo.dataPreventivo}</span>
                </div>
              </div>
              <div className="pre-det-row">
                <div className="pre-det-field">
                  <span className="pre-det-label">Durata</span>
                  <span>{preventivo.durataViaggio}</span>
                </div>
                <div className="pre-det-field">
                  <span className="pre-det-label">N. min. Partecipanti</span>
                  <span>{preventivo.numPartecipanti}</span>
                </div>
              </div>
              <div className="pre-det-row">
                <div className="pre-det-field">
                  <span className="pre-det-label">Luogo di Partenza</span>
                  <span>{preventivo.luogoPartenza}</span>
                </div>
                <div className="pre-det-field">
                  <span className="pre-det-label">Luogo di Arrivo</span>
                  <span>{preventivo.luogoArrivo}</span>
                </div>
              </div>
            </div>
            <div className="pre-det-right-section">
              <div className="pre-det-servizi">
                <h3 className="pre-det-label">Servizi inclusi:</h3>
                <ul>
                  {preventivo.servizi.map((servizio, index) => (
                    <li key={index}>{servizio}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="pre-det-pricing-row">
            <div className="pre-det-price-item">
              <span className="pre-det-label">Prezzo per Persona</span>
              <span className="pre-det-price">€{preventivo.prezzoPerPersona.toFixed(2)}</span>
            </div>
            <div className="pre-det-price-item">
              <span className="pre-det-label">N. min. Partecipanti</span>
              <span className="pre-det-price">{preventivo.numPartecipanti}</span>
            </div>
            <div className="pre-det-price-item">
              <span className="pre-det-label">Prezzo Totale</span>
              <span className="pre-det-price">€{preventivo.prezzoTotale.toFixed(2)}</span>
            </div>
          </div>

          <div className="pre-det-transport">
            <h3 className="pre-det-label">Dettagli Trasporto:</h3>
            <p>{preventivo.dettagliTrasporto}</p>
          </div>

          <div className="pre-det-section">
            <h3 className="pre-det-label">Itinerario:</h3>
            <ul className="pre-det-itinerario">
              {preventivo.itinerario.map((tappa, index) => (
                <li key={index}>{tappa}</li>
              ))}
            </ul>
          </div>

          <div className="pre-det-footer">
            <p className="pre-det-nota">Il prezzo include tutti i servizi elencati.</p>
            <button className="pre-det-submit" onClick={handleToggleAccettazione}>
              {accettato === 1 ? "Annulla accettazione" : "Accetta preventivo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DettaglioPreventivo;
