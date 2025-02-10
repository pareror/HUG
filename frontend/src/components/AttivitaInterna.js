import React from 'react';
import "../css/AttivitaIntEst.css";

// Funzione per calcolare l'orario di fine attività
const calcolaOrarioFine = (orarioInizio, durata) => {
  const [ore, minuti] = orarioInizio.split(':').map(Number);
  const fine = new Date();
  fine.setHours(ore);
  fine.setMinutes(minuti + parseInt(durata));
  
  const orarioFine = fine.toTimeString().slice(0, 5);
  return orarioFine;
};

const AttivitaInterna = ({
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
            <span className="value">{data}</span>
          </div>

          <div className="detail-row">
            <span className="label">Orario:</span>
            <span className="value">{orarioInizio} - {orarioFine}</span>
          </div>

          <div className="detail-row">
            <span className="label">Durata:</span>
            <span className="value">{durata}h</span>
          </div>

          <div className="detail-row">
            <span className="label">Luogo:</span>
            <span className="value">{luogo}</span>
          </div>

          <div className="detail-row">
            <span className="label">Partecipanti:</span>
            <span className="value">{numeroMinimoPartecipanti} / {numeroMassimoPartecipanti}</span>
          </div>

          <div className="detail-row">
            <span className="label">Istruttore:</span>
            <span className="value">{istruttore}</span>
          </div>

          <div className="detail-row deadline">
            <span className="label">Scadenza Iscrizioni:</span>
            <span className="value">{scadenzaIscrizioni}</span>
          </div>
        </div>

        <button className="open-activity-btn">Apri Attività</button>
      </div>
    </div>
  );
};

export default AttivitaInterna;
