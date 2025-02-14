import { useState } from "react";
import "../../css/PagamentiPazienti.css";
import PagamentiAttivitaCardPazienti from "./PagamentiAttivitaCardPazienti";
import { Search } from "lucide-react";

export default function PagamentiAttivitaPazientiTab() {
  const [searchQuery, setSearchQuery] = useState("");

  // Stato per gestire il pagamento di ogni attività
  const [activities, setActivities] = useState([
    { 
      id: 1, 
      name: "Visita al museo", 
      date: "27/11/2024", 
      amount: 240.0, 
      isPaid: false 
    },
    { 
      id: 2, 
      name: "Gita al Lago", 
      date: "28/11/2024", 
      amount: 120.0, 
      isPaid: false 
    },
    { 
      id: 3, 
      name: "Visita ai Mercatini", 
      date: "29/11/2024", 
      amount: 300.0, 
      isPaid: true 
    },
    { 
      id: 4, 
      name: "Corso di Informatica", 
      date: "30/11/2024", 
      amount: 250.0, 
      isPaid: true 
    },
    { 
      id: 5, 
      name: "Corso di Teatro", 
      date: "4/12/2024", 
      amount: 180.0, 
      isPaid: true 
    },
  ]);

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <h1>Pagamenti</h1>
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
          <PagamentiAttivitaCardPazienti
            key={activity.id}
            name={activity.name}
            date={activity.date}
            amount={activity.amount}
            isPaid={activity.isPaid} // Passiamo lo stato dell'attività
          />
        ))}
      </div>
    </div>
  );
}
