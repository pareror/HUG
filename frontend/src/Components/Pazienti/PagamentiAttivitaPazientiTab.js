import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/PagamentiPazienti.css";
import PagamentiAttivitaCardPazienti from "./PagamentiAttivitaCardPazienti";
import { Search } from "lucide-react";

export default function PagamentiAttivitaPazientiTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funzione per formattare la data (da YYYY-MM-DD a DD-MM-YYYY)
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:5000/api/pagamenti-attivita", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ci aspettiamo che l'API restituisca { payments: [...] }
        setPayments(response.data.payments || []);
      } catch (err) {
        console.error("Errore nel recupero dei pagamenti:", err);
        setError("Errore durante il recupero dei pagamenti.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filtra per attività in base al termine di ricerca
  let filteredPayments = payments.filter((payment) =>
    payment.titolo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ordina le attività: "da pagare" prima, poi "pagato"
  const statusOrder = { "da pagare": 0, "pagato": 1 };
  filteredPayments.sort((a, b) => {
    return statusOrder[a.status.toLowerCase()] - statusOrder[b.status.toLowerCase()];
  });

  if (loading) return <div>Caricamento...</div>;
  if (error) return <div>{error}</div>;

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
        {filteredPayments.map((payment) => (
          <PagamentiAttivitaCardPazienti
            key={payment.id}
            id={payment.id}
            name={payment.titolo}
            date={formatDate(payment.dataAttivita)}
            amount={payment.costoTotale === 0 ? "Gratuito" : payment.costoTotale}
            isPaid={payment.status.toLowerCase() === "pagato"}
          />
        ))}
      </div>
    </div>
  );
}
