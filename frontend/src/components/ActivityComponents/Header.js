import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom";


function Header() {
  const navigate = useNavigate();
  return (
    <header className="create-activity-header">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft className="back-icon" />
        <span>Torna indietro </span>
      </button>
      <h1>Crea Nuova Attività</h1>
    </header>
  )
}
export default Header