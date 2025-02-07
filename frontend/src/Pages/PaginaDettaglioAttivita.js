import React from "react"
import NavbarDashboard from "../Components/NavbarDashboard"
import DatiAttivita from "../Components/DatiAttivita"
import { ArrowLeft } from "lucide-react"
function PaginaDettaglioAttivita() {
  return (
    <div className="activity-detail">
        <NavbarDashboard />
         <div className="main-content-dettaglio">
      <DatiAttivita selectedKey={1} />
      </div>
    </div>
  )
}

export default PaginaDettaglioAttivita