import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../css/DettaglioPagamenti.css";
import NavbarDashboard from "../Components/NavbarDashboard";
import axios from "axios";

export default function DettaglioPagamenti() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chiamata API per ottenere i dettagli dell'attività e dei pagamenti
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(
          `http://localhost:5000/api/attivita/${activityId}/pazienti-pagamenti`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Payment details:", response.data);
        setActivityData(response.data);
      } catch (err) {
        console.error("Errore nel recupero dei pagamenti per l'attività:", err);
        setError("Errore durante il recupero dei pagamenti.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [activityId]);

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>{error}</p>;

  // Controlla se la risposta ha la struttura attesa
  if (!activityData || !activityData.activity) {
    console.error("La risposta dell'API non contiene 'activity'.", activityData);
    return <p>Dettagli non trovati.</p>;
  }

  // Destrutturiamo i dati ottenuti dall'API
  const { activity, summary, patients } = activityData;

  // Funzione per registrare il pagamento di un partecipante (simulazione)
  const handleRegisterPayment = async (patientId) => {
    // Qui dovresti chiamare l'API per registrare il pagamento e poi aggiornare i dati.
    // Per questo esempio simuliamo l'aggiornamento locale:
    setActivityData((prevData) => ({
      ...prevData,
      patients: prevData.patients.map((p) =>
        p.patientId === patientId
          ? { ...p, stato: "paid", paymentDate: new Date().toLocaleDateString("it-IT") }
          : p
      ),
      summary: {
        ...prevData.summary,
        totaleDaRecuperare: prevData.summary.totaleDaRecuperare - 
          prevData.patients.find((p) => p.patientId === patientId).importo,
      },
    }));
  };

  return (
    <div className="det-pag-main">
      <NavbarDashboard />
      <div className="det-pag-container">
        <div className="det-pag-header">
          <button className="det-pag-back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Torna indietro
          </button>
          <h1 className="det-pag-title">{activity.titolo}</h1>
          <p className="det-pag-date">
            Data: {new Date(activity.datainizio).toLocaleDateString("it-IT")}
          </p>
        </div>

        <div className="det-pag-payment-status-card">
          <div className="det-pag-status-header">
            <h2>Stato Pagamenti</h2>
            <div className="det-pag-total-info">
              <span className="det-pag-participants-count">
                {summary.totalePartecipanti} partecipanti totali
              </span>
              <div className="det-pag-total-amount">
                <span>Totale da riscuotere:</span>
                <span className="det-pag-amount">€{summary.totaleDaRecuperare.toFixed(2)}</span>
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
              {patients.map((participant) => (
                <div key={participant.patientId} className="det-pag-table-row">
                  <div className="det-pag-col det-pag-col-participant">
                    {participant.patientName}
                  </div>
                  <div className="det-pag-col det-pag-col-amount">€{participant.importo}</div>
                  <div className="det-pag-col det-pag-col-status">
                    <span className={`det-pag-status-badge ${participant.stato}`}>
                      {participant.stato === "pending" ? "Da pagare" : "Pagato"}
                    </span>
                  </div>
                  <div className="det-pag-col det-pag-col-date">
                    {participant.paymentDate || "-"}
                  </div>
                  <div className="det-pag-col det-pag-col-actions">
                    {participant.stato === "pending" ? (
                      <button
                        className="det-pag-register-payment-button"
                        onClick={() => handleRegisterPayment(participant.patientId)}
                      >
                        Registra Pagamento
                      </button>
                    ) : (
                      <>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
