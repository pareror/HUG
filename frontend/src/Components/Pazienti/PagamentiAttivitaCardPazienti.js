import "../../css/PagamentiPazienti.css";
import { useNavigate } from "react-router-dom";

export default function PagamentiAttivitaCardPazienti({ name, date, amount, isPaid}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/pazienti/pagamenti/attivita/dettaglio");
  };

  return (
    <div className="activity-card" onClick={handleCardClick}>
      <div className="card-content">
        <div className="user-info">
          <h3 className="user-name">{name}</h3>
          <p className="activity-count">Data: {date}</p>
        </div>
        <div className="payment-info">
          <span className="total-amount">€{amount.toFixed(2)}</span>
          <button className={`pazienti-pay-button ${isPaid ? "paid" : "unpaid"}`}>
            {isPaid ? "Pagato" : "Da pagare"}
          </button>
        </div>
      </div>
    </div>
  );
}
