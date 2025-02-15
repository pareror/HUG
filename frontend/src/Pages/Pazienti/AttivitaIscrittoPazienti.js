import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import "../../css/Pazienti/ListaAttivitaPazienti.css"
import AttivitaIscrittoPazientiTab from "../../Components/Pazienti/AttivitaIscrittoPazientiTab"
export default function AttivitaIscrittoPazienti() {
  const navigate = useNavigate()

  return (
    <div className="lista-pazienti">
      <NavbarPazienti />
      <div className="lista-main-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Torna indietro
        </button>
        <AttivitaIscrittoPazientiTab />
      </div>
    </div>
  )
}