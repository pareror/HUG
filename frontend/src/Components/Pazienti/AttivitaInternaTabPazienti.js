import React, { useEffect, useState } from "react";
import axios from "axios";

// Importa il nuovo file CSS rinominato
import "../../css/Pazienti/AttivitaIntEstPazienti.css";

import AttivitaInterna from "../AttivitaInterna"; // Componente per renderizzare la singola card

const AttivitaInternaTab = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch delle attività interne dal backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:5000/api/attivita", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            tipo: "I", // Otteniamo solo le attività interne
          },
        });

        console.log("Attività interne:", response.data.activities);
        setActivities(response.data.activities || []);
      } catch (err) {
        console.error("Errore fetch attività interne:", err);
        setError("Impossibile caricare le attività interne.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <p>Caricamento...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const formattaData = (data) => {
    const [anno, mese, giorno] = data.split("-");
    return `${giorno}-${mese}-${anno}`;
  };

  return (
    // Aggiorniamo il nome della classe a "activities-grid-pazienti"
    <div className="activities-grid-pazienti">
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

export default AttivitaInternaTab;
