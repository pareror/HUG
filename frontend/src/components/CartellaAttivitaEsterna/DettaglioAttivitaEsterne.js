import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Users, User2, Trash2 } from "lucide-react";
import '../../css/DettaglioAttivita.css';

function DettaglioAttivitaEsterne() {
  // Navigazione
  const navigate = useNavigate();

  // Esempio di dati mock (fittizi) per l'attività
  const [activity] = useState({
    titolo: "Titolo di prova",
    immagine: "/placeholder.svg",
    datainizio: "2025-06-15",
    orainizio: "09:00",
    durata: 2,
    luogo: "Location di esempio",
    numeroIscritti: 5,
    numeroMinimoPartecipanti: 8,
    numeroMassimoPartecipanti: 20,
    istruttore: "Mario Rossi",
    scadenzaIscrizioni: "2025-06-10",
    descrizione: "Questa è una descrizione di prova dell'attività esterna."
  });

  // Funzione di navigazione per modificare l'attività
  const handleModifyActivity = () => {
    // Qui avviene soltanto la navigazione verso una pagina di modifica
    navigate(`/dashboard/attivita/esterna/1/modifica`);
  };

  // Funzione di esempio per l'eliminazione (senza backend)
  const handleDeleteActivity = () => {
    if (window.confirm("Sei sicuro di voler eliminare questa attività?")) {
      // Logica solo lato client, senza chiamate a server
      alert("Attività (fittizia) eliminata.");
      navigate("/dashboard/attivita/esterna");
    }
  };

  // Funzione per formattare la data
  const formattaData = (data) => {
    const [anno, mese, giorno] = data.split("-");
    return `${giorno}-${mese}-${anno}`;
  };

  return (
    <div className="activity-detail">
      <button onClick={() => navigate(-1)} className="details-back-button">
        <ArrowLeft className="details-back-icon" />
        <span className="details-back-text">Torna indietro</span>
      </button>

      <h1 className="activity-title">{activity.titolo}</h1>

      <div className="content-wrapper">
        <img
          src={activity.immagine}
          alt={activity.titolo}
          className="activity-image"
        />

        <div className="details-grid">
          <div className="detail-item">
            <Calendar className="detail-icon" />
            <div>
              <strong>Data:</strong> {formattaData(activity.datainizio)}
            </div>
          </div>

          <div className="detail-item">
            <Clock className="detail-icon" />
            <div>
              <strong>Ora inizio:</strong> {activity.orainizio}
            </div>
          </div>

          <div className="detail-item">
            <Clock className="detail-icon" />
            <div>
              <strong>Durata:</strong> {activity.durata} ore
            </div>
          </div>

          <div className="detail-item">
            <MapPin className="detail-icon" />
            <div>
              <strong>Luogo:</strong> {activity.luogo}
            </div>
          </div>

          <div className="detail-item">
            <Users className="detail-icon" />
            <div>
              <strong>Iscritti attuali:</strong> {activity.numeroIscritti || 0}
            </div>
          </div>

          <div className="detail-item">
            <Users className="detail-icon" />
            <div>
              <strong>Minimo partecipanti:</strong> {activity.numeroMinimoPartecipanti}
            </div>
          </div>

          <div className="detail-item">
            <Users className="detail-icon" />
            <div>
              <strong>Massimo partecipanti:</strong> {activity.numeroMassimoPartecipanti}
            </div>
          </div>

          <div className="detail-item">
            <User2 className="detail-icon" />
            <div>
              <strong>Istruttore:</strong> {activity.istruttore}
            </div>
          </div>

          <div className="detail-item">
            <Calendar className="detail-icon" />
            <div>
              <strong>Scadenza iscrizioni:</strong> {formattaData(activity.scadenzaIscrizioni)}
            </div>
          </div>
        </div>
      </div>

      <div className="description-section">
        <h2 className="description-title">Descrizione</h2>
        <p>{activity.descrizione}</p>
      </div>

      <div className="button-container">
        <button className="button button-primary" onClick={handleModifyActivity}>
          Modifica Attività
        </button>
        <button className="button button-secondary" >Gestisci Utenza</button>
       
        {/* Esempio di pulsante senza alcuna chiamata al backend */}
        <button className="button button-danger" onClick={handleDeleteActivity}>
          <Trash2 size={18} /> Elimina Attività
        </button>
      </div>
    </div>
  );
}

export default DettaglioAttivitaEsterne;
