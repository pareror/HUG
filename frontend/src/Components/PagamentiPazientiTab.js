import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/PagamentiPazienti.css";
import PagamentoPaziente from "./PagamentoPaziente";
import { ArrowLeft, Search } from "lucide-react";

export default function PagamentiPazientiTab() {
  const [pagamenti, setPagamenti] = useState([]);
  const [error, setError] = useState("");

  // Funzione per recuperare i dati statistici dei pazienti dal backend
  const fetchPatientStats = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get("http://localhost:5000/api/pazienti/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.patients);

      // Mappiamo i dati ricevuti in modo da adattarli al componente PagamentoPaziente:
      // - name: concatenazione di nome e cognome
      // - totalAmount: totale spesa (totaleSpesa)
      // - activitiesCount: numero di attività (numeroAttivita)
      // - amountToPay: qui impostato uguale a totalAmount, ma potrebbe essere personalizzato
      const mappedData = response.data.patients.map((paziente) => ({
        idPaziente: paziente.id,
        name: `${paziente.nome} ${paziente.cognome}`,
        totalAmount: paziente.totaleSpesa,
        activitiesCount: paziente.numeroAttivita,
        amountToPay: paziente.totaleSpesa,
      }));
      setPagamenti(mappedData);
    } catch (err) {
      console.error("Errore nel recupero dei dati dei pazienti:", err);
      setError("Errore durante il recupero dei dati dei pazienti.");
    }
  };

  useEffect(() => {
    fetchPatientStats();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Pagamenti per paziente</h1>
        <p>Qui troverai la lista dei pagamenti per ogni paziente</p>
      </div>
      <div className="search-container">
        <Search className="search-icon" />
        <input type="text" placeholder="Cerca paziente..." className="search-input" />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="pagamenti-list">
        {pagamenti.map((pagamento, index) => (
          <PagamentoPaziente
            key={index}
            id={pagamento.idPaziente}
            name={pagamento.name}
            totalAmount={pagamento.totalAmount}
            activitiesCount={pagamento.activitiesCount}
            amountToPay={pagamento.amountToPay}
          />
        ))}
      </div>
    </div>
  );
}
