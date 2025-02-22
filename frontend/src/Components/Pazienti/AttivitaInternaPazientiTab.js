import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/AttivitaIntEst.css";
import AttivitaInterna from "../AttivitaInterna"; // Componente già esistente per visualizzare la card

const AttivitaInternaPazientiTab = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funzione per recuperare le attività interne per il paziente
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("jwt");
        // Chiamata all'API dedicata per i pazienti:
        const response = await axios.get(
          "http://localhost:5000/api/pazienti/attivita/interni",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Attività interne per pazienti:", response.data.activities);
        setActivities(response.data.activities || []);
      } catch (err) {
        console.error("Errore nel recupero delle attività interne per pazienti:", err);
        setError("Impossibile caricare le attività interne per pazienti.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p className="error">{error}</p>;

  const formattaData = (data) => {
    const [anno, mese, giorno] = data.split("-");
    return `${giorno}-${mese}-${anno}`;
  };

  return (
    <div className="activities-grid">
      {activities.map((activity) => (
        <AttivitaInterna
          key={activity.id}
          id={activity.id}
          image={activity.immagine}
          titolo={activity.titolo}
          descrizione={activity.descrizione}
          data={formattaData(activity.datainizio)}
          orarioInizio={activity.orainizio}
          durata={activity.durata}
          scadenzaIscrizioni={formattaData(activity.scadenzaIscrizioni)}
          numeroMinimoPartecipanti={activity.numeroMinimoPartecipanti}
          numeroMassimoPartecipanti={activity.numeroMassimoPartecipanti}
          numeroIscritti={activity.numeroIscritti}
          luogo={activity.luogo}
          istruttore={activity.istruttore}
        />
      ))}
    </div>
  );
};

export default AttivitaInternaPazientiTab;
