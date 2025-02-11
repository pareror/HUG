import { ArrowLeft, Search } from "lucide-react"
import { useState } from "react"
import "../css/PagamentiPazienti.css"
import NavbarDashboard from "../Components/NavbarDashboard"
import { useNavigate } from "react-router-dom"

const activities = [
  {
    id: 1,
    title: "Visita al museo archeologico",
    date: "27/11/2024",
    estimates: 2,
    status: "In attesa di approvazione",
  },
  {
    id: 2,
    title: "Gita al lago di Como",
    date: "27/11/2024",
    estimates: 2,
    status: "In attesa di approvazione",
  },
  {
    id: 3,
    title: "Tour delle ville Venete",
    date: "27/11/2024",
    estimates: 2,
    status: "In attesa di approvazione",
  },
  {
    id: 4,
    title: "Tour delle Campagne",
    date: "27/11/2024",
    estimates: 2,
    status: "In attesa di approvazione",
  },
]

export default function GestisciAttivita() {
    const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("")

  const filteredActivities = activities.filter((activity) =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()),


)

  return (
    <div className="pagamenti-pazienti">
        <NavbarDashboard />
      <div className="main-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Torna indietro
        </button>
        <div className="container">
        <div className="header">
          <h1>Attività esterne da Mostrare</h1>
          <p>Qui troverai la lista delle attività esterne da mostrare</p>
        </div>

        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Cerca attività..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="pagamenti-list">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

function ActivityCard({ activity }) {
    
  return (
    <div className="activity-card">
      <div className="card-content">
        <div className="user-info">
          <h3 className="user-name">{activity.title}</h3>
          <div className="flex items-center gap-4">
            <p className="activity-count">{activity.date}</p>
            <p className="activity-count">{activity.estimates} preventivi</p>
          </div>
        </div>
        <div className="payment-info">
          <span className="status-label">{activity.status}</span>
          <button className="open-activity-button">Apri Attività</button>
        </div>
      </div>
    </div>
  )
}

