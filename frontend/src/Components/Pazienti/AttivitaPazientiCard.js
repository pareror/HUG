import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Pazienti/AttivitaPazientiCard.css";

export default function AttivitaPazientiCard({
  id,
  name,
  date,
  tipo,
  image,
  durata,
  istruttore,
  luogo,
  orainizio,
}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (tipo === "I") {
      navigate(`/pazienti/attivita/interna/${id}`);
    } else if (tipo === "E") {
      navigate(`/pazienti/attivita/esterna/${id}`);
    }
  };

  return (
    <div className="attivita-pazienti-card" onClick={handleCardClick}>
      <div className="card-image">
        <img src={image || "/placeholder.jpg"} alt={name} />
      </div>
      <div className="card-details">
        <h3 className="card-title">{name}</h3>
        <p className="card-date"><strong>Data:</strong> {date} - {orainizio}</p>
        <div className="card-extra-info">
          <p className="card-duration"><strong>Durata:</strong> {durata} ore</p>
          <p className="card-instructor"><strong>Istruttore:</strong> {istruttore}</p>
          <p className="card-location"><strong>Luogo:</strong> {luogo}</p>
        </div>
      </div>
      <div className="card-type-section">
        <span className={`list-att-paz-status-badge list-att-paz-status-${tipo === "I" ? "interna" : "esterna"}`}>
          {tipo === "I" ? "Interna" : "Esterna"}
        </span>
      </div>
    </div>
  );
}
