import "../../css/PagamentiPazienti.css";
import { useNavigate } from "react-router-dom";

export default function PagamentiAttivitaCardPazienti({ id, name, date, amount, isPaid, tipo }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (tipo === "I") {
      navigate(`/pazienti/attivita/interna/${id}`);
    } else if (tipo === "E") {
      navigate(`/pazienti/attivita/esterna/${id}`);
    }
  };
  

  return (
    <div className="activity-card" onClick={handleCardClick}>
      <div className="card-content">
        <div className="user-info">
          <h3 className="user-name">{name}</h3>
          <p className="activity-count">Data: {date}</p>
        </div>
        <div className="payment-info">
          {amount === "Gratuito" ? (
            <span className="total-amount"></span>
          ) : (
            <span className="total-amount">€{amount}</span>
          )}
          <button
            className={`pazienti-pay-button ${
              isPaid 
                ? "paid" 
                : amount === "Gratuito" 
                  ? "free" 
                  : "unpaid"
            }`}
          >
            {amount === "Gratuito" ? "Gratuito" : isPaid ? "Pagato" : "Da pagare"}
          </button>
        </div>
      </div>
    </div>
  );
}
