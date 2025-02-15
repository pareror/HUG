import React from "react";
import "../../css/Pazienti/NotificheTabPazienti.css"; // Usa lo stesso CSS della lista

const NotificaPaziente = ({ titolo, descrizione, tempo }) => {
    return (
        <div className="notification-item">
            <div className="notification-header">
                {/* Contenitore per titolo e badge */}
                <div className="notification-title-container">
                    <h3 className="notification-title">{titolo}</h3>
                </div>
            </div>

            {/* Descrizione della notifica */}
            <p className="notification-description">{descrizione}</p>

            {/* Tempo della notifica */}
            <p className="notification-time">{tempo}</p>

            {/* Linea di separazione */}
            <hr className="notification-divider" />
        </div>
    );
};

export default NotificaPaziente;
