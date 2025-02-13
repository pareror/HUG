import React from 'react';
import { Calendar, FileText } from "lucide-react"


const PreventivoCard = ({id, titolo, data, cifra}) => {
    return (
        <div className="preventivi-card">
        <div className="preventivi-content">
            <div className="preventivi-info">
            <h2>{titolo}</h2>
            <div className="preventivi-details">
                <div className="detail-item">
                <Calendar className="icon"/>
                <p>Ricevuto il {data}</p>
                </div>
            </div>
            </div>
            <div className="preventivi-actions">
            <p className='cifra'>{cifra}</p>
            <button className="manage-button">Visualizza preventivo</button>
            </div>
        </div>
        </div>
    );
};

export default PreventivoCard;