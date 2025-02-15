import React from "react";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PreventivoCard = ({ idPrev, idAttivita, titolo, data, cifra, luogoPartenza, luogoArrivo }) => {
  const navigate = useNavigate();
  return (
    <div className="preventivi-card">
      <div className="preventivi-content">
        <div className="preventivi-info">
          <h2>{titolo}</h2>
          <div className="preventivi-details">
            <div className="detail-item">
              <Calendar className="icon" />
              <p>Ricevuto il {data}</p>
            </div>
            <div className="detail-item">
              <p>
                <strong>Partenza:</strong> {luogoPartenza}
              </p>
            </div>
            <div className="detail-item">
              <p>
                <strong>Arrivo:</strong> {luogoArrivo}
              </p>
            </div>
          </div>
        </div>
        <div className="preventivi-actions">
          <p className="cifra">{cifra}€</p>
          <button
            className="manage-button"
            onClick={() =>
              navigate(`/dashboard/attivita/esterna/preventivi/${idAttivita}/preventivo/${idPrev}`)
            }
          >
            Visualizza preventivo
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreventivoCard;
