import { useState } from "react"
import "../../css/Pazienti/ListaAttivitaPazienti.css"
import AttivitaPazientiCard from "./AttivitaPazientiCard"
import { Search } from "lucide-react"

export default function AttivitaIscrittoPazientiTab() {
    const [searchQuery, setSearchQuery] = useState("")
  
    const activities = [
      {
        id: 1,
        name: "Visita al museo",
        date: "27/11/2024",
        amount: 40.0,
        status: "Da pagare",
        paymentDate: "20/11/2024",
      },
      {
        id: 2,
        name: "Gita al Lago",
        date: "28/11/2024",
        amount: 25.0,
        status: "Pagato",
        paymentDate: "15/11/2024",
      },
      {
        id: 3,
        name: "Visita ai Mercatini",
        date: "29/11/2024",
        amount: 0,
        status: "Gratuito",
        paymentDate: "-",
      },
      {
        id: 4,
        name: "Corso di Informatica",
        date: "30/11/2024",
        amount: 50.0,
        status: "Da pagare",
        paymentDate: "25/11/2024",
      },
      {
        id: 5,
        name: "Corso di Teatro",
        date: "4/12/2024",
        amount: 30.0,
        status: "Pagato",
        paymentDate: "01/11/2024",
      },
    ]
  
    const filteredActivities = activities.filter((activity) =>
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  
    return (
      <div className="list-att-paz-container">
        <div className="list-att-paz-header">
          <h1>Attività a cui sei iscritto</h1>
          <p>Qui troverai la lista delle attività a cui sei iscritto</p>
        </div>
        <div className="list-att-paz-search-container">
          <Search className="list-att-paz-search-icon" />
          <input
            type="text"
            placeholder="Cerca attività..."
            className="list-att-paz-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="list-att-paz-pagamenti-list">
          {filteredActivities.map((activity) => (
            <AttivitaPazientiCard
              key={activity.id}
              name={activity.name}
              date={activity.date}
              amount={activity.amount}
              status={activity.status}
              paymentDate={activity.paymentDate}
            />
          ))}
        </div>
      </div>
    )
  }

