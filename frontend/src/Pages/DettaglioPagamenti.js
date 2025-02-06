import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"
import "../css/DettaglioPagamenti.css"
import NavbarDashboard from "../Components/NavbarDashboard";

export default function DettaglioPagamenti() {
    const { activityId } = useParams();
  const navigate = useNavigate()

  // Mock data for the activity
  const activity = {
    id:activityId,
    title: "Visita al museo",
    date: "27/11/2024",
    totalParticipants: 3,
    totalAmount: 40.0,
    participants: [
      {
        id: "1",
        name: "Mario Rossi",
        amount: 40,
        status: "pending",
        paymentDate: "20/11/2024",
      },
      {
        id: "2",
        name: "Giulia Bianchi",
        amount: 40,
        status: "paid",
        paymentDate: "20/11/2024",
      },
      {
        id: "3",
        name: "Luca Verdi",
        amount: 40,
        status: "paid",
        paymentDate: "20/11/2024",
      },
    ],
  }

  const handleRegisterPayment = (participantId) => {
    console.log("Registering payment for participant:", participantId)
    // Add your payment registration logic here
  }

  return (
    <div className="det-pag-container">
        <NavbarDashboard />
      <div className="det-pag-header">
        <button className="det-pag-back-button" onClick={() => navigate(-1)}>
                  <ArrowLeft size={20} /> Torna indietro
                </button>
        <h1 className="det-pag-title">{activity.title}</h1>
        <p className="det-pag-date">Data: {activity.date}</p>
      </div>

      <div className="det-pag-payment-status-card">
        <div className="det-pag-status-header">
          <h2>Stato Pagamenti</h2>
          <div className="det-pag-total-info">
            <span className="det-pag-participants-count">{activity.totalParticipants} partecipanti totali</span>
            <div className="det-pag-total-amount">
              <span>Totale da riscuotere:</span>
              <span className="det-pag-amount">€{activity.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="det-pag-payments-table">
          <div className="det-pag-table-header">
            <div className="det-pag-col det-pag-col-participant">Partecipante</div>
            <div className="det-pag-col det-pag-col-amount">Importo</div>
            <div className="det-pag-col det-pag-col-status">Stato</div>
            <div className="det-pag-col det-pag-col-date">Data pagamento</div>
            <div className="det-pag-col det-pag-col-actions">Azioni</div>
          </div>

          <div className="det-pag-table-body">
            {activity.participants.map((participant) => (
              <div key={participant.id} className="det-pag-table-row">
                <div className="det-pag-col det-pag-col-participant">{participant.name}</div>
                <div className="det-pag-col det-pag-col-amount">€{participant.amount}</div>
                <div className="det-pag-col det-pag-col-status">
                  <span className={`det-pag-status-badge ${participant.status}`}>
                    {participant.status === "pending" ? "Da pagare" : "Pagato"}
                  </span>
                </div>
                <div className="det-pag-col det-pag-col-date">{participant.paymentDate}</div>
                <div className="det-pag-col det-pag-col-actions">
                  {participant.status === "pending" && (
                    <button
                      className="det-pag-register-payment-button"
                      onClick={() => handleRegisterPayment(participant.id)}
                    >
                      Registra Pagamento
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

