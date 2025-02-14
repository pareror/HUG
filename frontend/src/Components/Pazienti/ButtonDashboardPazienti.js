import { Plus, Users, FileText, Calculator } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../../css/Pazienti/ButtonDashboardPazienti.css"

const ButtonDashboard = () => {
  const navigate = useNavigate()

  const buttons = [
    {
      id: 1,
      text: "Calendario attività",
      icon: <Plus className="button-icon" />,
      variant: "dark",
      path: "/pazienti/calendario",
    },
    {
      id: 2,
      text: "Gestisci pagamenti attività",
      icon: <Users className="button-icon" />,
      variant: "light",
      path: "/pazienti/pagamenti/attivita",
    },

  ]

  return (
    <div className="pazienti-button-dashboard-container">
      {buttons.map((button) => (
        <button
          key={button.id}
          className={`dashboard-button ${button.variant === "dark" ? "dark" : "light"}`}
          onClick={() => navigate(button.path)}
        >
          {button.icon}
          <span>{button.text}</span>
        </button>
      ))}
    </div>
  )
}

export default ButtonDashboard

