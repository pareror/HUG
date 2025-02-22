import "../css/PagamentiPazienti.css"
import { useNavigate } from "react-router-dom"

export default function AttivitaCard({ id, name, date, participants, amount, pendingPayments }) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/dashboard/pagamenti/attivita/${id}`)
  }

  return (
    <div className="activity-card" onClick={handleCardClick}>
      <div className="card-content">
        <div className="user-info">
          <h3 className="user-name">{name}</h3>
          <p className="activity-count">
            Data: {date} | Partecipanti: {participants}
          </p>
        </div>
        <div className="payment-info">
          <span className="total-amount">€{amount.toFixed(2)}</span>
          <button className="pazienti-pay-button">{pendingPayments} pagamenti in sospeso</button>
        </div>
      </div>
    </div>
  )
}

