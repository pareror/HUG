import { BarChart3, Users, ShoppingCart, Activity } from "lucide-react"
import "../css/ActivityStats.css"
/*import React from "react";*/
{/* import "../css/ActivityStats.css"

export default function ActivityStats({ stats }) {
  return (
    <div className="stats-grid">
      <StatCard title="Attività Interne" value={stats.attivitaInterne} icon="📊" />
      <StatCard title="Attività Esterne" value={stats.attivitaEsterne} icon="🌍" />
      <StatCard title="Pazienti Registrati" value={stats.pazientiRegistrati} icon="👥" />
      <StatCard title="Utenti Registrati" value={stats.utentiRegistrati} icon="📝" />
    </div>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
        <span className="stat-icon">{icon}</span>
      </div>
    </div>
  )
}


*/}



export default function ActivityStats({ stats }) {
  const metricsData = [
    {
      title: "Attività Totali",
      value: stats.attivitaInterne + stats.attivitaEsterne,
      change: "+12.5%",
      subtitle: "Target mensile: 20",
      icon: <Activity className="h-4 w-4" />,
      progress: 75,
      color: "blue",
    },
    {
      title: "Utenti Attivi",
      value: stats.utentiRegistrati,
      change: "+8.2%",
      subtitle: "Crescita utenti mensile",
      icon: <Users className="h-4 w-4" />,
      progress: 65,
      color: "yellow",
    },
    {
      title: "Pazienti",
      value: stats.pazientiRegistrati,
      change: "+15.7%",
      subtitle: "Tasso completamento mensile",
      icon: <ShoppingCart className="h-4 w-4" />,
      progress: 85,
      color: "green",
    },
    {
      title: "Attività Interne",
      value: stats.attivitaInterne,
      change: "+10.3%",
      subtitle: "Crescita attività interne",
      icon: <BarChart3 className="h-4 w-4" />,
      progress: 70,
      color: "purple",
    },
  ]

  return (
    <div className="stats-grid">
      {metricsData.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  )
}

function MetricCard({ title, value, change, subtitle, icon, progress, color }) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <div className={`metric-icon-wrapper ${color}`}>{icon}</div>
        <div className="metric-change">{change}</div>
      </div>

      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <p className="metric-value">{value.toLocaleString()}</p>
        <p className="metric-subtitle">{subtitle}</p>
      </div>

      <div className="metric-progress-wrapper">
        <div className={`metric-progress-bar ${color}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

