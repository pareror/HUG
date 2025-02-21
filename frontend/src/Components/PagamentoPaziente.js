import "../css/PagamentiPazienti.css"
import { useNavigate } from "react-router-dom";

export default function ActivityCard({ id, name, activitiesCount, totalAmount, amountToPay}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/dashboard/pagamenti/paziente/${id}`);
  };

  return (
    <div className="activity-card" onClick={handleCardClick}>
      <div className="card-content">
        <div className="user-info">
          <h3 className="user-name">{name}</h3>
          <p className="activity-count">Attività partecipate: {activitiesCount}</p>
        </div>
        <div className="payment-info">
          <span className="total-amount">€{totalAmount}</span>
          <button className="pay-button" onClick={() => navigate(`/dashboard/pagamenti/paziente/${id}`)}>€{amountToPay} da pagare</button>
        </div>
      </div>
    </div>
  )
}

