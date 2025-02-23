import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Users, User2, EyeOff, Eye, Euro } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../../css/DettaglioAttivita.css";
import GestisciUtenzaModal from "../GestisciUtenzaModal";
import VisualizzaCaregiverModal from "../Pazienti/VisualizzaCaregiverModal"; // Assicurati che il percorso sia corretto

function DettaglioAttivitaEsterne() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCaregiverModal, setShowCaregiverModal] = useState(false);
  const [visibilita, setVisibilita] = useState(null);
  const [costoPreventivo, setCostoPreventivo] = useState("Da definire");
  const [costoAttivita, setCostoAttivita] = useState(0);

  // Decodifica il token per ottenere il ruolo e l'ID dell'utente
  const token = localStorage.getItem("jwt");
  let role = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role; // "paziente" oppure altro (centro)
    } catch (error) {
      console.error("Errore nella decodifica del JWT:", error);
    }
  }

  // Carica i dettagli dell'attività
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/attivita/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { tipo: "E" }
        });
        const vis = typeof response.data.activity.visibile !== "undefined" 
          ? response.data.activity.visibile 
          : 0;
        setVisibilita(vis);
        setActivity(response.data.activity);
        setCostoAttivita(response.data.activity.costo || 0);
        if (response.data.activity.prezzoPerPersona !== undefined) {
          setCostoPreventivo(response.data.activity.prezzoPerPersona);
        }
      } catch (err) {
        console.error("Errore durante il recupero dell'attività:", err);
        setError("Errore durante il caricamento dell'attività.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id, token]);

  // Carica il costo del preventivo accettato (opzionale)
  useEffect(() => {
    const fetchCostoPreventivo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/attivita/${id}/preventivo-accettato`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCostoPreventivo(response.data.costoPreventivo);
      } catch (err) {
        console.error("Errore nel recupero del preventivo accettato:", err);
        setCostoPreventivo("Da definire");
      }
    };

    fetchCostoPreventivo();
  }, [id, token]);

  // Se l'utente è un paziente, controlla se è iscritto all'attività
  useEffect(() => {
    const checkIscrizione = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/attivita/${id}/iscritto`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivity((prev) => prev ? { ...prev, iscritto: response.data.isIscritto } : prev);
      } catch (err) {
        console.error("Errore nel controllo iscrizione:", err);
      }
    };

    if (role === "paziente") {
      checkIscrizione();
    }
  }, [id, token, role]);

  // Handler per toggle della visibilità (per centri)
  const handleToggleVisibility = async () => {
    try {
      const newVisibility = isVisible ? 0 : 1;
      await axios.put(
        `http://localhost:5000/api/attivita-esterna/${id}/visibilita`,
        { visibile: newVisibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVisibilita(newVisibility);
      setActivity((prev) => ({ ...prev, visibile: newVisibility }));
    } catch (error) {
      console.error("Errore durante la modifica della visibilità:", error);
      alert("Errore durante la modifica della visibilità.");
    }
  };

  // Handler per iscrivere un paziente all'attività
  const handleIscrizione = async () => {
    try {
      const confirm = window.confirm("Confermi l'iscrizione all'attività?");
      if (!confirm) return;
      const decoded = jwtDecode(token);
      const patientId = decoded.id;
      await axios.post(
        `http://localhost:5000/api/attivita/${id}/iscrivi`,
        { userId: patientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Iscrizione registrata con successo.");
      setActivity((prev) => ({ ...prev, iscritto: true }));
    } catch (err) {
      console.error("Errore durante l'iscrizione:", err);
      alert("Errore durante l'iscrizione.");
    }
  };

  // Handler per disiscrivere un paziente dall'attività
  const handleAnnullaIscrizione = async () => {
    try {
      const decoded = jwtDecode(token);
      const patientId = decoded.id;
      await axios.delete(`http://localhost:5000/api/attivita/${id}/disiscrivi`, {
        data: { userId: patientId },
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Iscrizione annullata con successo.");
      setActivity((prev) => ({ ...prev, iscritto: false }));
    } catch (err) {
      console.error("Errore durante la disiscrizione:", err);
      alert("Errore durante la disiscrizione.");
    }
  };

  // Handler per aprire il modal per visualizzare i caregiver
  const handleVisualizzaCaregiver = () => {
    setShowCaregiverModal(true);
  };

  const formattaData = (data) => {
    const [anno, mese, giorno] = data.split("-");
    return `${giorno}-${mese}-${anno}`;
  };

  const isVisible = visibilita === 1;

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>{error}</p>;
  if (!activity) return <p>Attività non trovata.</p>;

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

          {/* Sezione costi */}
          <div className="detail-item">
            <Euro className="detail-icon" />
            <div>
              <strong>Costo attività:</strong> {costoAttivita} €
            </div>
          </div>
          <div className="detail-item">
            <Euro className="detail-icon" />
            <div>
              <strong>Costo preventivo trasporti:</strong> {costoPreventivo !== "Da definire" ? `${costoPreventivo} €` : "Da definire"}
            </div>
          </div>
        </div>
      </div>

      <div className="description-section">
        <h2 className="description-title">Descrizione</h2>
        <p>{activity.descrizione}</p>
      </div>

      <div className="button-container">
        {role !== "paziente" ? (
          <>
            <button className="button button-primary" onClick={() => navigate(`/dashboard/attivita/esterna/preventivi/${id}`)}>
              Consulta Preventivi
            </button>
            <button className="button button-secondary" onClick={() => setShowModal(true)}>
              Gestisci Utenza
            </button>
            {showModal && <GestisciUtenzaModal onClose={() => setShowModal(false)} activityId={id} />}
            <button onClick={handleToggleVisibility} className={`button ${isVisible ? "button-danger" : "button-success"}`}>
              {isVisible ? <><EyeOff size={18} /> Nascondi Attività</> : <><Eye size={18} /> Mostra Attività</>}
            </button>
          </>
        ) : (
          <>
            {activity.iscritto ? (
              <button className="button button-secondary" onClick={handleAnnullaIscrizione}>
                Annulla Iscrizione
              </button>
            ) : (
              <button className="button button-primary" onClick={handleIscrizione}>
                Iscriviti all'attività
              </button>
            )}
            <button className="button button-tertiary" onClick={handleVisualizzaCaregiver}>
              Visualizza Caregiver
            </button>
            {showCaregiverModal && (
              <VisualizzaCaregiverModal onClose={() => setShowCaregiverModal(false)} activityId={id} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DettaglioAttivitaEsterne;
