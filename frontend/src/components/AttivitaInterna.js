import React from 'react';
import "../css/AttivitaIntEst.css";
import { useNavigate } from 'react-router-dom';

const calcolaOrarioFine = (orarioInizio, durata) => {
  const [ore, minuti] = orarioInizio.split(':').map(Number);
  const fine = new Date();
  fine.setHours(ore);
  fine.setMinutes(minuti);
  
  // Aggiungi la durata in ore
  fine.setHours(fine.getHours() + parseInt(durata));

  const orarioFine = fine.toTimeString().slice(0, 5); // Restituisce l'orario nel formato HH:MM
  return orarioFine;
};

const AttivitaInterna = ({
  id,
  image,
  titolo,
  descrizione,
  data,
  orarioInizio,
  durata,
  scadenzaIscrizioni,
  numeroMinimoPartecipanti,
  numeroMassimoPartecipanti,
  luogo,
  istruttore
}) => {
  const orarioFine = calcolaOrarioFine(orarioInizio, durata);

  const navigate = useNavigate();
  const handleOpenActivity = () => {
    navigate(`/dashboard/attivita/interna/${id}`);
  };
  return (
    <div className="activity-card-placeholder">
      <img src={image} alt="Attività" className="image-card" />

      <div className="attivita-card-content">
        <div className="course-header">
          <h2 className="course-title">{titolo}</h2>
          <p className="course-description">{descrizione}</p>
        </div>

        <div className="course-details">
          <div className="detail-row">
            <span className="label">Data:</span>
            <span className="value"><strong>{data}</strong></span>
          </div>

          <div className="detail-row">
            <span className="label">Orario:</span>
            <span className="value"><strong>{orarioInizio} - {orarioFine}</strong></span>
          </div>

          <div className="detail-row">
            <span className="label">Durata:</span>
            <span className="value"><strong>{durata}h</strong></span>
          </div>

          <div className="detail-row">
            <span className="label">Luogo:</span>
            <span className="value"><strong>{luogo}</strong></span>
          </div>

          <div className="detail-row">
            <span className="label">Partecipanti:</span>
            <span className="value"><strong>{numeroMinimoPartecipanti} / {numeroMassimoPartecipanti}</strong></span>
          </div>

          <div className="detail-row">
            <span className="label">Istruttore:</span>
            <span className="value"><strong>{istruttore}</strong></span>
          </div>

          <div className="detail-row deadline">
            <span className="label">Scadenza Iscrizioni:</span>
            <span className="value"><strong>{scadenzaIscrizioni}</strong></span>
          </div>
        </div>

        {/* Pulsante per aprire l'attività specifica */}
        <button className="open-activity-btn" onClick={handleOpenActivity}>
          Apri Attività
        </button>
      </div>
    </div>
  );
};

export default AttivitaInterna;
