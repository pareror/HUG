import "../css/ActivityStats.css"

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

