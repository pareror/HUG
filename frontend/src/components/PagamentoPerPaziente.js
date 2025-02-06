import React from 'react';
import '../css/PagamentiPaziente.css';

const PagamentoPerPaziente = () => {

    const payments = [
        {
          activity: "Visita al museo",
          date: "27/11/2024",
          amount: 40,
          status: "pending",
          paymentDate: null,
        },
        {
          activity: "Gita al Lago",
          date: "28/11/2024",
          amount: 60,
          status: "paid",
          paymentDate: "20/11/2024",
        },
        {
          activity: "Spettacolo Teatrale",
          date: "22/11/2024",
          amount: 50,
          status: "paid",
          paymentDate: "20/11/2024",
        },
        {
            activity: "Spettacolo Teatrale",
            date: "22/11/2024",
            amount: 50,
            status: "paid",
            paymentDate: "20/11/2024",
          },
          {
            activity: "Spettacolo Teatrale",
            date: "22/11/2024",
            amount: 50,
            status: "paid",
            paymentDate: "20/11/2024",
          },
          {
            activity: "Spettacolo Teatrale",
            date: "22/11/2024",
            amount: 50,
            status: "paid",
            paymentDate: "20/11/2024",
          },
          {
            activity: "Spettacolo Teatrale",
            date: "22/11/2024",
            amount: 50,
            status: "paid",
            paymentDate: "20/11/2024",
          },
      ]

      const handleRegisterPayment = (activity) => {
        console.log(`Registering payment for ${activity}`)
      }

    return (
        <div className='container'>
            <div className='container-header'>
                <div className='container-header-title'>
                    <h1>Attività e pagamenti</h1>
                    <p>3 attività totali</p>
                </div>
                <div className='container-header-info'>
                    <p>Totale pagamenti: 40€</p>
                </div>
            </div>
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
                    <button className="register-payment" onClick={() => handleRegisterPayment(payment.activity)}>
                      Registra Pagamento
                    </button>
                  ) : (
                    payment.paymentDate
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