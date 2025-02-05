import "../css/PagamentiPazienti.css"

export default function ActivityCard({ name, activitiesCount, totalAmount, amountToPay}) {
  return (
    <div className="activity-card">
      <div className="card-content">
        <div className="user-info">
          <h3 className="user-name">{name}</h3>
          <p className="activity-count">Attività partecipate: {activitiesCount}</p>
        </div>
        <div className="payment-info">
          <span className="total-amount">€{totalAmount}</span>
          <button className="pay-button">€{amountToPay} da pagare</button>
        </div>
      </div>
    </div>
  )
}

