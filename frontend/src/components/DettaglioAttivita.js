import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Users, User2, Trash2 } from "lucide-react";
import axios from "axios";
import "../css/DettaglioAttivita.css";
import GestisciUtenzaModal from "./GestisciUtenzaModal";
function DettaglioAttivita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/attivita-interna/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        setActivity(response.data.activity);
      } catch (err) {
        console.error("Errore durante il recupero dell'attività:", err);
        setError("Errore durante il caricamento dell'attività.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>{error}</p>;
  if (!activity) return <p>Attività non trovata.</p>;

  const handleModifyActivity = () => {
    navigate(`/dashboard/attivita/interna/${id}/modifica`);
  };
  const handleDeleteActivity = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questa attività?")) {
      try {
        await axios.delete(`http://localhost:5000/api/attivita-interna/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        alert("Attività eliminata con successo.");
        navigate("/dashboard/attivita/interna");
      } catch (error) {
        console.error("Errore durante l'eliminazione dell'attività:", error);
        alert("Si è verificato un errore durante l'eliminazione dell'attività.");
      }
    }
  };
  const formattaData = (data) => {
    const [anno, mese, giorno] = data.split("-");
    return `${giorno}-${mese}-${anno}`;
  };
  return (
    <div className="activity-detail">
      <button onClick={() => navigate(-1)} className="details-back-button">
        <ArrowLeft className="details-back-icon" />
        <span className="details-back-text">Torna indietro</span>
      </button>

      <h1 className="activity-title">{activity.titolo}</h1>

      <div className="content-wrapper">
        <img
          src={activity.immagine || "/placeholder.svg"}
          alt={activity.titolo}
          className="activity-image"
        />

        <div className="details-grid">
          <div className="detail-item">
            <Calendar className="detail-icon" />
            <div>
              <strong>Data:</strong> {formattaData(activity.datainizio)}
            </div>
          </div>

          <div className="detail-item">
            <Clock className="detail-icon" />
            <div>
              <strong>Ora inizio:</strong> {activity.orainizio}
            </div>
          </div>

          <div className="detail-item">
            <Clock className="detail-icon" />
            <div>
              <strong>Durata:</strong> {activity.durata} ore
            </div>
          </div>

          <div className="detail-item">
            <MapPin className="detail-icon" />
            <div>
              <strong>Luogo:</strong> {activity.luogo}
            </div>
          </div>
          <div className="detail-item">
            <Users className="detail-icon" />
            <div>
              <strong>Iscritti attuali:</strong> {activity.numeroIscritti || 0}
            </div>
          </div>
          <div className="detail-item">
            <Users className="detail-icon" />
            <div>
              <strong>Minimo partecipanti:</strong> {activity.numeroMinimoPartecipanti}
            </div>
          </div>

          <div className="detail-item">
            <Users className="detail-icon" />
            <div>
              <strong>Massimo partecipanti:</strong> {activity.numeroMassimoPartecipanti}
            </div>
          </div>

          <div className="detail-item">
            <User2 className="detail-icon" />
            <div>
              <strong>Istruttore:</strong> {activity.istruttore}
            </div>
          </div>

          <div className="detail-item">
            <Calendar className="detail-icon" />
            <div>
              <strong>Scadenza iscrizioni:</strong> {formattaData(activity.scadenzaIscrizioni)}
            </div>
          </div>
        </div>
      </div>

      <div className="description-section">
        <h2 className="description-title">Descrizione</h2>
        <p>{activity.descrizione}</p>
      </div>

      <div className="button-container">
        <button className="button button-primary" onClick={handleModifyActivity}>
          Modifica Attività
        </button>
        <button className="button button-secondary" onClick={() => setShowModal(true)}>Gestisci Utenza</button>
        {showModal && (
        <GestisciUtenzaModal onClose={() => setShowModal(false)} />
      )}
      <button className="button button-danger" onClick={handleDeleteActivity}>
          <Trash2 size={18} /> Elimina Attività
        </button>
      </div>
    </div>
  );
}

export default DettaglioAttivita;
