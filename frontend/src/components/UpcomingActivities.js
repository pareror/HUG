import "../css/UpcomingActivities.css"
import React from "react";
export default function UpcomingActivities({ activities }) {
  return (
    <div className="activities-table-container">
      <table className="activities-table">
        <thead>
          <tr>
            <th>Attività</th>
            <th>Data</th>
            <th>Ora</th>
            <th>Stato</th>
            <th>Partecipanti</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.name}</td>
              <td>{activity.date}</td>
              <td>{activity.time}</td>
              <td>
                <StatusBadge status={activity.status} />
              </td>
              <td>{activity.participants}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "In progress":
        return "status-progress"
      case "Da approvare":
        return "status-pending"
      default:
        return "status-default"
    }
  }

  return <span className={`status-badge ${getStatusClass(status)}`}>{status}</span>
}

