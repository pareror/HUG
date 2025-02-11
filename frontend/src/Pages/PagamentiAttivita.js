import NavbarDashboard from "../Components/NavbarDashboard"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import "../css/PagamentiPazienti.css"
import PagamentiAttivitaTab from "../Components/PagamentiAttivitaTab"

export default function PagamentiAttivita() {
  const navigate = useNavigate()

  return (
    <div className="pagamenti-pazienti">
      <NavbarDashboard />
      <div className="main-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Torna indietro
        </button>
        <PagamentiAttivitaTab />
      </div>
    </div>
  )
}