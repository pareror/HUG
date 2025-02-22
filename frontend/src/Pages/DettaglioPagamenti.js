import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import "../css/DettaglioPagamenti.css";
import NavbarDashboard from "../Components/NavbarDashboard";
import axios from "axios";

export default function DettaglioPagamenti() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Stato per la ricerca

  // Funzione per ottenere i dettagli dell'attività e i pagamenti dei partecipanti
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

  // Funzione per registrare il pagamento per un partecipante tramite l'API
  const handleRegisterPayment = async (patientId) => {
    try {
      const confirm = window.confirm(
        "Confermi la registrazione del pagamento? Una volta confermato, non potrai annullare l'operazione."
      );
      if (!confirm) return;
      
      const token = localStorage.getItem("jwt");
      const paymentDate = new Date().toISOString().slice(0, 10);

      await axios.put(
        `http://localhost:5000/api/pazienti/${patientId}/payments/${activityId}`,
        { paymentDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Dopo la registrazione, ricarica i dettagli aggiornati
      const refreshResponse = await axios.get(
        `http://localhost:5000/api/attivita/${activityId}/pazienti-pagamenti`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivityData(refreshResponse.data);
    } catch (err) {
      console.error("Errore nella registrazione del pagamento:", err);
      setError("Errore nella registrazione del pagamento.");
    }
  };

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>{error}</p>;
  if (!activityData || !activityData.activity) {
    console.error("La risposta dell'API non contiene 'activity'.", activityData);
    return <p>Dettagli non trovati.</p>;
  }

  const { activity, summary, patients } = activityData;

  // Filtra i pazienti in base al search query
  const filteredPatients = patients.filter((participant) =>
    participant.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          {/* Campo di ricerca per filtrare i pazienti */}
          <div className="det-pag-search-container">
            
            <input
              type="text"
              placeholder="Cerca paziente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="det-pag-search-input"
            />
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
              {filteredPatients.length > 0 ? (
                filteredPatients.map((participant) => (
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
                        <></>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>Nessun partecipante trovato.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
