import "../css/PaymentsTable.css"
import React from "react"
export default function PaymentsTable({ payments }) {
  return (
    <div className="payments-table-container">
      <table className="payments-table">
        <thead>
          <tr>
            <th>Attività</th>
            <th>Totale</th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.activity}</td>
              <td>{payment.total}</td>
              <td>
                <PaymentStatus status={payment.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PaymentStatus({ status }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "Da pagare":
        return "payment-pending"
      case "Pagato":
        return "payment-completed"
      default:
        return "payment-default"
    }
  }

  return <span className={`payment-status ${getStatusClass(status)}`}>{status}</span>
}

