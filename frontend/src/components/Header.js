import { ArrowLeft } from "lucide-react"

function Header() {
  return (
    <header className="create-activity-header">
      <a href="#" className="back-link">
        <ArrowLeft className="back-icon" />
        Torna indietro
      </a>
      <h1>Crea Nuova Attività</h1>
    </header>
  )
}

export default Header