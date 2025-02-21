import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/PagamentiPaziente.css';

const PagamentoPerPaziente = () => {
  // Estrae l'id del paziente dai parametri della route
  const { id } = useParams();
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  // Funzione per chiamare l'API e recuperare i pagamenti relativi al paziente
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.get(`http://localhost:5000/api/pazienti/${id}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.payments);
      setPayments(response.data.payments);
    } catch (err) {
      console.error("Errore nel recupero dei pagamenti:", err);
      setError("Errore durante il recupero dei pagamenti.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [id]);

  // Funzione per registrare il pagamento: mostra un popup di conferma e poi chiama l'endpoint PUT
  const handleRegisterPayment = async (activityId) => {
    // Popup di conferma
    const confirm = window.confirm(
      "Confermi la registrazione del pagamento? Una volta confermato, non potrai annullare l'operazione."
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.put(
        `http://localhost:5000/api/pazienti/${id}/payments/${activityId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      // Ricarica i pagamenti aggiornati dopo la registrazione
      fetchPayments();
    } catch (err) {
      console.error("Errore nella registrazione del pagamento:", err);
      setError("Errore nella registrazione del pagamento.");
    }
  };

  // Calcola il totale delle attività e l'importo totale
  const totalActivities = payments.length;
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  // Se la response include il campo patientName, lo estraiamo dal primo record, altrimenti lasciamo una stringa vuota
  const patientName = payments.length > 0 ? payments[0].patientName : '';

  return (
    <div className='container'>
      <div className='container-header'>
        <div className='container-header-title'>
          <h1>Pagamenti per {patientName || 'Il Paziente'}</h1>
          <p>{totalActivities} attività totali</p>
        </div>
        <div className='container-header-info'>
          <p>Totale pagamenti: €{totalPayments}</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="table-wrapper">
        <div className="table-scroll">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Attività</th>
                <th>Data</th>
                <th>Importo</th>
                <th>Stato</th>
                <th>Data pagamento</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.activity}</td>
                  <td>{payment.date}</td>
                  <td>€{payment.amount}</td>
                  <td>
                    {payment.status === "pending" ? (
                      <button className="payment-needed">Da pagare</button>
                    ) : (
                      <button className="payment-done">Pagato</button>
                    )}
                  </td>
                  <td>
                    {payment.status === "pending" ? (
                      <button
                        className="register-payment"
                        onClick={() => handleRegisterPayment(payment.activityId)}
                      >
                        Registra Pagamento
                      </button>
                    ) : (
                      payment.paymentDate || ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PagamentoPerPaziente;
