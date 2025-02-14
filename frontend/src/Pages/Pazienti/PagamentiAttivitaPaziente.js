import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import "../../css/PagamentiPazienti.css"
import PagamentiAttivitaPazientiTab from "../../Components/Pazienti/PagamentiAttivitaPazientiTab"

export default function PagamentiAttivitaPaziente() {
  const navigate = useNavigate()

  return (
    <div className="pagamenti-pazienti">
      <NavbarPazienti />
      <div className="main-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Torna indietro
        </button>
        <PagamentiAttivitaPazientiTab />
      </div>
    </div>
  )
}