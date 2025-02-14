import "../../css/ActivityBar.css";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"


function ActivityBarPazienti() {
  const navigate = useNavigate();
  
    const location = useLocation()
  
    const isInternaRoute = location.pathname === "/pazienti/attivita/interna"
    const isEsternaRoute = location.pathname === "/pazienti/attivita/esterna"
  
    const title = isInternaRoute ? "Attività Interne" : isEsternaRoute ? "Attività Esterne" : "Attività"

  return (
    <header className="activity-header">
      <div className="activity-container">
        <div className="left-section">
          {/* Bottone per tornare indietro */}
          <button onClick={() => navigate(-1)} className="back-link">
            <ArrowLeft className="activity-bar-back-icon" />
            <span className="back-text">Torna indietro</span>
          </button>
          <h1 className="title">{title}</h1>
        </div>

        <div className="right-section">
          <div className="activity-search-container">
            <Search className="search-icon" />
            <input
              type="search"
              placeholder="Cerca attività..."
              className="search-input"
            />
          </div>
        {/*  {isInternaRoute && (
            <button className="create-button" onClick={() => navigate("/dashboard/attivita/interna/crea")}>
              <span className="button-text">Crea Attività</span>
              <span className="button-icon">+</span>
            </button>
          )}
          {isEsternaRoute && (
            <button className="activity-bar-manage-button" onClick={() => navigate("/dashboard/attivita/esterna/gestisciattivita")}>
              <span className="button-text">Gestisci Attività</span>
              <span className="button-icon">+</span>
            </button>
        )}  */} 
        </div>
        
      </div>
    </header>
  );
}

export default ActivityBarPazienti;
