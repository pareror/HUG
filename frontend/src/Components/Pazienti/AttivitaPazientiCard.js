import "../../css/Pazienti/ListaAttivitaPazienti.css"
import { useNavigate } from "react-router-dom"

export default function AttivitaPazientiCard({ name, date, amount, status, paymentDate }) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate("/dashboard/pazienti/attivita/dettaglio")
  }

  const renderDateInfo = () => {
    if (status === "Gratuito") {
      return <p className="list-att-paz-payment-date">Data iscrizione: {paymentDate}</p>
    }
    if (status === "Da pagare") {
      return null // Non mostrare nessuna data per le attività da pagare
    }
    return <p className="list-att-paz-payment-date">Data pagamento: {paymentDate}</p>
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
          {renderDateInfo()}
        </div>
        <div className="list-att-paz-payment-info">
          <span className="list-att-paz-total-amount">€{amount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
