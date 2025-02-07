import { ArrowLeft, Calendar, Clock, MapPin, Users, User2 } from "lucide-react"
import "../css/DettaglioAttivita.css"
/*import DatiAttivita from "./DatiAttivita"*/
// Il componente ora riceve direttamente i dati dall'import
const DettaglioAttivita = ({title, date, startTime, duration, location, participants, minParticipants, maxParticipants, instructor, registrationDeadline, description, image }) => {
   return (
   
    <div className="activity-detail">
    <a href="#" className="details-back-button">
        <ArrowLeft size={20} />
        Torna indietro
      </a>

      <h1 className="activity-title">{title}</h1>

      <div className="content-wrapper">
        <img src={image || "/placeholder.svg"} alt={title} className="activity-image" />

        <div className="details-grid">
          <div className="detail-item">
            <Calendar className="detail-icon" />
            <div>
              <strong>Data:</strong> {date}
            </div>
          </div>

          <div className="detail-item">
            <Clock className="detail-icon" />
            <div>
              <strong>Ora inizio:</strong> {startTime}
            </div>
          </div>

          <div className="detail-item">
            <Clock className="detail-icon" />
            <div>
              <strong>Durata:</strong> {duration}
            </div>
          </div>

          <div className="detail-item">
            <MapPin className="detail-icon" />
            <div>
              <strong>Luogo:</strong> {location}
            </div>
          </div>

          <div className="detail-item">
            <Users className="detail-icon" />
            <div>
              <strong>Partecipanti:</strong> {participants}
            </div>
          </div>

          <div className="detail-item">
            <Users className="detail-icon" />
            <div>
              <strong>Minimo partecipanti:</strong> {minParticipants}
            </div>
          </div>

          <div className="detail-item">
            <Users className="detail-icon" />
            <div>
              <strong>Massimo partecipanti:</strong> {maxParticipants}
            </div>
          </div>

          <div className="detail-item">
            <User2 className="detail-icon" />
            <div>
              <strong>Istruttore:</strong> {instructor}
            </div>
          </div>

          <div className="detail-item">
            <Calendar className="detail-icon" />
            <div>
              <strong>Scadenza iscrizioni:</strong> {registrationDeadline}
            </div>
          </div>
        </div>
      </div>

      <div className="description-section">
        <h2 className="description-title">Descrizione</h2>
        <p>{description}</p>
      </div>

      <div className="button-container">
        <button className="button button-primary">Modifica Attività</button>
        <button className="button button-secondary">Gestisci Utenza</button>
      </div>
    </div>
    
  );
};


export default DettaglioAttivita;

