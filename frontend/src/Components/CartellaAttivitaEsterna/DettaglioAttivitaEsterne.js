import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Users, User2, EyeOff, Eye } from "lucide-react";
import axios from "axios";
import '../../css/DettaglioAttivita.css';
import GestisciUtenzaModal from "../GestisciUtenzaModal";
import ConsultaPreventivi from "../../Pages/ConsultaPreventivi";

function DettaglioAttivitaEsterne() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visibilita, setVisibilita] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/attivita/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          params: { tipo: "E" }
        });
        // Se il campo "visibile" non è presente, assumiamo il valore di default 0 (non visibile)
        const vis = typeof response.data.activity.visibile !== "undefined" 
          ? response.data.activity.visibile 
          : 0;
        setVisibilita(vis);
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

  // L'attività è visibile se "visibilita" è 1
  const isVisible = visibilita === 1;

  const formattaData = (data) => {
    const [anno, mese, giorno] = data.split("-");
    return `${giorno}-${mese}-${anno}`;
  };

  // Se l'attività è visibile (visibilita === 1) al click impostiamo la nuova visibilità a 0 (non visibile),
  // altrimenti la impostiamo a 1 (visibile)
  const handleToggleVisibility = async () => {
    try {
      const newVisibility = isVisible ? 0 : 1;
      await axios.put(
        `http://localhost:5000/api/attivita-esterna/${id}/visibilita`,
        { visibile: newVisibility },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      setVisibilita(newVisibility);
      setActivity((prev) => ({ ...prev, visibile: newVisibility }));
    } catch (error) {
      console.error("Errore durante la modifica della visibilità:", error);
      alert("Errore durante la modifica della visibilità.");
    }
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
        <button className="button button-primary" onClick={() => navigate(`/dashboard/attivita/esterna/preventivi/${id}`)}>
          Consulta Preventivi
        </button>

        <button className="button button-secondary" onClick={() => setShowModal(true)}>
          Gestisci Utenza
        </button>

        {showModal && (
          <GestisciUtenzaModal
            onClose={() => setShowModal(false)}
            activityId={id}
          />
        )}

        {/* Il pulsante viene visualizzato in base allo stato "visibilita" */}
        <button
  onClick={handleToggleVisibility}
  className={`button ${isVisible ? "button-danger" : "button-success"}`}
>
  {isVisible ? (
    <>
      <EyeOff size={18} /> Nascondi Attività
    </>
  ) : (
    <>
      <Eye size={18} /> Mostra Attività
    </>
  )}
</button>
      </div>
    </div>
  );
}

export default DettaglioAttivitaEsterne;
