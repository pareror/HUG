import "../css/ActivityBar.css"
import { ArrowLeft, Search } from "lucide-react"

function ActivityBar() {
    return (
        
      <header className="activity-header">
        <div className="activity-container">
          <div className="left-section">
            <a href="#" className="back-link">
              <ArrowLeft className="back-icon" />
              <span className="back-text">Torna indietro</span>
            </a>
            <h1 className="title">Attività Interne</h1>
          </div>
  
          <div className="right-section">
            <div className="search-container">
              <Search className="search-icon" />
              <input type="search" placeholder="Cerca attività..." className="search-input" />
            </div>
            <button className="create-button">
              <span className="button-text">Crea Attività</span>
              <span className="button-icon">+</span>
            </button>
          </div>
        </div>
      </header>
    )
  }
  
  export default ActivityBar
