import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"
import "../css/DettaglioPagamenti.css"
import NavbarDashboard from "../Components/NavbarDashboard";
export default function DettaglioPagamenti() {
    const { activityId } = useParams();
  const navigate = useNavigate()

  // MOCK: Recupera i dati dell'attività in base all'activityId
  // In un'app reale, qui faresti una chiamata API per caricare i dati.
  const activity = {
    id:activityId,
    title: "Visita al museo",
    date: "27/11/2024",
    totalParticipants: 3,
    totalAmount: 40.0,
    participants: [
      {
        id: "1", // Utilizza ID univoci per ogni partecipante
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
  };

  const handleRegisterPayment = (participantId) => {
    console.log("Registering payment for participant:", participantId);
    // Qui inserisci la logica per registrare il pagamento
  };

  return (
    <div className="dettaglio-pagamenti-container">
        <NavbarDashboard />
        <div className="dettaglio-pagamenti-header">
        <button className="dettaglio-pagamenti-back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Torna indietro</span>
        </button>
        <h1 className="dettaglio-pagamenti-title">{activity.title}</h1>
        <p className="dettaglio-pagamenti-date">Data: {activity.date}</p>
      </div>

      <div className="dp-payment-status-card">
        <div className="dp-status-header">
          <h2>Stato Pagamenti</h2>
          <div className="dp-total-info">
            <span className="dp-participants-count">
              {activity.totalParticipants} partecipanti totali
            </span>
            <div className="dp-total-amount">
              <span>Totale da riscuotere:</span>
              <span className="dp-amount">
                €{activity.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="dp-payments-table">
          <div className="dp-table-header">
            <div className="dp-col dp-col-participant">Partecipante</div>
            <div className="dp-col dp-col-amount">Importo</div>
            <div className="dp-col dp-col-status">Stato</div>
            <div className="dp-col dp-col-date">Data pagamento</div>
            <div className="dp-col dp-col-actions">Azioni</div>
          </div>

          <div className="dp-table-body">
            {activity.participants.map((participant) => (
              <div key={participant.id} className="dp-table-row">
                <div className="dp-col dp-col-participant">
                  {participant.name}
                </div>
                <div className="dp-col dp-col-amount">
                  €{participant.amount}
                </div>
                <div className="dp-col dp-col-status">
                  <span
                    className={`dp-status-badge ${participant.status}`}
                  >
                    {participant.status === "pending" ? "Da pagare" : "Pagato"}
                  </span>
                </div>
                <div className="dp-col dp-col-date">
                  {participant.paymentDate}
                </div>
                <div className="dp-col dp-col-actions">
                  {participant.status === "pending" && (
                    <button
                      className="dp-register-payment-button"
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
  );
}
