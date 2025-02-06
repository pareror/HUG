import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom";


function Header() {
  const navigate = useNavigate();
  return (
    <header className="create-activity-header">
      <button onClick={() => navigate(-1)} className="create-activity-back-button">
        <ArrowLeft className="create-activity-back-icon" />
        <span>Torna indietro </span>
      </button>
      <h1>Crea Nuova Attività</h1>
    </header>
  )
}
export default Header