import { useState } from "react"
import NavbarDashboard from "../Components/NavbarDashboard"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react"
import "../css/PagamentiAttivita.css"

export default function PagamentiAttivita() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for activities
  const activities = [
    {
      id: 1,
      name: "Visita al museo",
      date: "27/11/2024",
      participants: 12,
      amount: 240.0,
      pendingPayments: 3,
    },
    {
      id: 2,
      name: "Gita al Lago",
      date: "28/11/2024",
      participants: 10,
      amount: 120.0,
      pendingPayments: 2,
    },
    {
      id: 3,
      name: "Visita ai Mercatini",
      date: "29/11/2024",
      participants: 8,
      amount: 300.0,
      pendingPayments: 2,
    },
    {
      id: 4,
      name: "Corso di Informatica",
      date: "30/11/2024",
      participants: 12,
      amount: 250.0,
      pendingPayments: 2,
    },
    {
      id: 5,
      name: "Corso di Teatro",
      date: "4/12/2024",
      participants: 15,
      amount: 180.0,
      pendingPayments: 1,
    },
  ]

  // Filter activities based on search query
  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="pag-main-content">
      <NavbarDashboard />
      <div className="pag-activities-list">
        <button className="pag-back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} />
          Torna indietro
        </button>

        <div className="pag-container">
          <div className="pag-header">
            <h1>Pagamenti per Attività</h1>
            <p className="pag-subtitle">Qui troverai la lista dei pagamenti per attività</p>
          </div>

          <div className="pag-search-container">
            <div className="pag-search-wrapper">
              <Search className="pag-search-icon" size={20} />
              <input
                type="text"
                placeholder="Cerca attività..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pag-search-input"
              />
            </div>
          </div>

          <div className="pag-activities-list">
            {filteredActivities.map((activity) => (
              <Link
                key={activity.id}
                to={`/dashboard/pagamenti/attivita/${activity.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="pag-activity-card">
                  <div className="pag-activity-info">
                    <h2>{activity.name}</h2>
                    <div className="pag-activity-details">
                      <p>Data: {activity.date}</p>
                      <p>Partecipanti: {activity.participants}</p>
                    </div>
                  </div>
                  <div className="pag-activity-payment">
                    <span className="pag-amount">€{activity.amount.toFixed(2)}</span>
                    <div className="pag-pending-payments">{activity.pendingPayments} pagamenti in sospeso</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

