import React from 'react';
import "../css/AttivitaIntEst.css"

const AttivitaInterna = ({image, titolo, descrizione, data, orarioInizio, orarioFine, luogo, part, minPart, istruttore, scadIscData, scadIscOrario}) => {
    return (

            <div className="activity-card-placeholder">

                <img src={image} alt="Activity" className="image-card" />

                <div className = "attivita-card-content">
                <div className="course-header">
                <h2 className="course-title">{titolo}</h2>
                    <p className="course-description">
                        {descrizione}
                    </p>
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
                    <span className="label">Luogo:</span>
                    <span className="value">{luogo}</span>
                </div>

                <div className="detail-row">
                    <span className="label">Partecipanti:</span>
                    <span className="value">8/12</span>
                </div>

                <div className="detail-row">
                    <span className="label">Minimo partecipanti:</span>
                    <span className="value">{minPart}</span>
                </div>

                <div className="detail-row">
                    <span className="label">Istruttore:</span>
                    <span className="value">{istruttore}</span>
                </div>

                <div className="detail-row deadline">
                    <span className="label">Scadenza Iscrizioni:</span>
                    <span className="value">{scadIscData} {scadIscOrario}</span>
                </div>
                
                </div>
                <button className="open-activity-btn">Apri Attività</button>
                </div>

                </div>
    );
};

export default AttivitaInterna;