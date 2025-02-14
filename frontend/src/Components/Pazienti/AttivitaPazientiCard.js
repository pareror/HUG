import "../../css/Pazienti/ListaAttivitaPazienti.css"
import { useNavigate } from "react-router-dom"

export default function AttivitaPazientiCard({ name, date, amount, status, paymentDate }) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate("/dashboard/pazienti/attivita/dettaglio")
  }

  return (
    <div className="list-att-paz-activity-card" onClick={handleCardClick}>
      <div className="list-att-paz-card-content">
        <div className="list-att-paz-activity-info">
          <h3 className="list-att-paz-activity-name">{name}</h3>
          <p className="list-att-paz-activity-date">Data: {date}</p>
        </div>
        <div className="list-att-paz-status-section">
          <span
            className={`list-att-paz-status-badge list-att-paz-status-${status.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {status}
          </span>
          {status !== "Da pagare" && paymentDate && (
            <p className="list-att-paz-payment-date">Data pagamento: {paymentDate}</p>
          )}
        </div>
        <div className="list-att-paz-payment-info">
          <span className="list-att-paz-total-amount">€{amount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
