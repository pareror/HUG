import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/ActivityStats.css";

export default function ActivityStats() {
  const [stats, setStats] = useState({
    attivitaInterne: 0,
    attivitaEsterne: 0,
    totaleAttivita: 0,
    pazientiRegistrati: 0,
    caregiverRegistrati: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:5000/api/stats/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (err) {
        console.error("Errore nel recupero delle statistiche:", err);
        setError("Errore nel recupero delle statistiche.");
      }
    };

    fetchDashboardStats();
  }, []);

  const metricsData = [
    {
      title: "Attività Totali",
      value: stats.totaleAttivita, // ✅ Ora è la somma di interne + esterne
      subtitle: "Numero totale di attività interne ed esterne",
      icon: "📊",
      color: "blue",
    },
    {
      title: "Attività Interne",
      value: stats.attivitaInterne, // ✅ Mostra solo le interne create dal centro
      subtitle: "Attività interne organizzate dal centro",
      icon: "🏠",
      color: "purple",
    },
    {
      title: "Pazienti Registrati",
      value: stats.pazientiRegistrati, // ✅ Numero totale di pazienti registrati
      subtitle: "Totale pazienti iscritti al centro",
      icon: "🧑‍⚕️",
      color: "green",
    },
    {
      title: "Caregiver Registrati",
      value: stats.caregiverRegistrati, // ✅ Numero totale di caregiver registrati
      subtitle: "Totale caregiver registrati al centro",
      icon: "🧑‍🤝‍🧑",
      color: "yellow",
    },
  ];

  return (
    <div className="stats-grid">
      {error && <p className="error">{error}</p>}
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
