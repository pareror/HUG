import { useState } from "react"
import "../css/PagamentiPazienti.css"
import PagamentiAttivitaCard from "./PagamentiAttivitaCard"
import { Search } from "lucide-react"

export default function PagamentiAttivitaTab() {
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container">
      <div className="header">
        <h1>Pagamenti per Attività</h1>
        <p>Qui troverai la lista dei pagamenti per attività</p>
      </div>
      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Cerca attività..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="pagamenti-list">
        {filteredActivities.map((activity) => (
          <PagamentiAttivitaCard
            key={activity.id}
            name={activity.name}
            date={activity.date}
            participants={activity.participants}
            amount={activity.amount}
            pendingPayments={activity.pendingPayments}
          />
        ))}
      </div>
    </div>
  )
}

