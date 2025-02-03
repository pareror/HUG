import { Plus, Users, FileText, Calculator } from "lucide-react"
import "../css/ButtonDashboard.css"

const ButtonDashboard = () => {
  const buttons = [
    {
      id: 1,
      text: "Attività interna",
      icon: <Plus className="button-icon" />,
      variant: "dark",
    },
    {
      id: 2,
      text: "Gestisci Pazienti",
      icon: <Users className="button-icon" />,
      variant: "light",
    },
    {
      id: 3,
      text: "Gestisci Pagamenti Attività",
      icon: <FileText className="button-icon" />,
      variant: "light",
    },
    {
      id: 4,
      text: "Gestisci Preventivi",
      icon: <Calculator className="button-icon" />,
      variant: "light",
    },
  ]

  return (
    <div className="button-dashboard-container">
      {buttons.map((button) => (
        <button key={button.id} className={`dashboard-button ${button.variant === "dark" ? "dark" : "light"}`}>
          {button.icon}
          <span>{button.text}</span>
        </button>
      ))}
    </div>
  )
}

export default ButtonDashboard

