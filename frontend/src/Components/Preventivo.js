import { Calendar, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom";
function Preventivo({ idAttivita, titoloPreventivo, data, numeroPreventivi, status }) {
  const navigate = useNavigate();
  return (
    <div className="activity-card">
      <div className="activity-content">
        <div className="activity-info">
          <h2>{titoloPreventivo}</h2>
          <div className="activity-details">
            <div className="detail-item">
              <Calendar className="icon" />
              {data}
            </div>
            <div className="detail-item">
              <FileText className="icon" />
              {numeroPreventivi} preventivi
            </div>
          </div>
        </div>
        <div className="activity-actions">
          <span className="status">{status}</span>
          <button className="manage-button" 
              onClick={() =>
                navigate(`/dashboard/attivita/esterna/preventivi/${idAttivita}`)
              }>
            Gestisci preventivi
          </button>
        </div>
      </div>
    </div>
  )
}

export default Preventivo

