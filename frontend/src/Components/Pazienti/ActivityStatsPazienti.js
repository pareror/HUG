// ActivityStats.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/ActivityStats.css";

export default function ActivityStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:5000/api/pazienti/stats-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Supponiamo che l'API restituisca un oggetto { stats: { attivitaInterne, attivitaOggi, pagamentiSospeso, attivitaCompletate } }
        setStats(response.data.stats);
      } catch (err) {
        console.error("Errore nel recupero delle statistiche:", err);
        setError("Errore nel recupero delle statistiche.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Caricamento statistiche...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return <div>Nessuna statistica disponibile.</div>;

  const metricsData = [
    {
      title: "Attività Totali",
      value: stats.attivitaInterne, // Numero di attività interne totali disponibili
      subtitle: "Attività interne totali disponibili",
      icon: "📊",
      color: "blue",
    },
    {
      title: "Attività attive oggi",
      value: stats.attivitaOggi, // Numero di attività interne attive oggi
      subtitle: "Attività interne attive oggi",
      icon: "📝",
      color: "yellow",
    },
    {
      title: "Pagamenti in sospeso",
      value: stats.pagamentiSospeso, // Numero di attività da pagare
      subtitle: "Attività da pagare",
      icon: "💰",
      color: "green",
    },
    {
      title: "Totale attività completate",
      value: stats.attivitaCompletate, // Numero di attività (interne ed esterne) completate
      subtitle: "Attività completate (interne ed esterne)",
      icon: "✅",
      color: "purple",
    },
  ];

  return (
    <div className="stats-grid">
      {metricsData.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <div className={`metric-icon-wrapper ${color}`}>{icon}</div>
      </div>
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <p className="metric-value">{value.toLocaleString()}</p>
        <p className="metric-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}
