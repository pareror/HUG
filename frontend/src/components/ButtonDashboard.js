"use client"

import { Plus, Users, FileText, Calculator } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../css/ButtonDashboard.css"

const ButtonDashboard = () => {
  const navigate = useNavigate()

  const buttons = [
    {
      id: 1,
      text: "Attività interna",
      icon: <Plus className="button-icon" />,
      variant: "dark",
      path: "/dashboard/attivita/interna",
    },
    {
      id: 2,
      text: "Gestisci Pazienti",
      icon: <Users className="button-icon" />,
      variant: "light",
      path: "/dashboard/utenza/pazienti",
    },
    {
      id: 3,
      text: "Gestisci Pagamenti Attività",
      icon: <FileText className="button-icon" />,
      variant: "light",
      path: "/dashboard/pagamenti/attivita",
    },
    {
      id: 4,
      text: "Gestisci Preventivi",
      icon: <Calculator className="button-icon" />,
      variant: "light",
      path: "/dashboard/preventivi",
    },
  ]

  return (
    <div className="button-dashboard-container">
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

