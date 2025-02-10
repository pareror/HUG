import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/AttivitaIntEst.css";
import AttivitaInterna from "./AttivitaInterna"; // Componente che renderizza la singola card

const AttivitaInternaTab = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch delle attività dal backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {

        const token = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:5000/api/attivita-interna", {
          headers: {
            Authorization: `Bearer ${token}`, 
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
    <div className="activities-grid">
      {activities.map((activity) => (
        <AttivitaInterna
          key={activity.id}
          // Mappiamo i campi del DB con le prop del componente
          image={activity.immagine}
          titolo={activity.titolo}
          descrizione={activity.descrizione}
          data={formattaData(activity.datainizio)}
          orarioInizio={activity.orainizio}
          // puoi calcolare orarioFine se vuoi, o mostrare "durata"
          durata={activity.durata}
          scadenzaIscrizioni={formattaData(activity.scadenzaIscrizioni)}
          numeroMinimoPartecipanti={activity.numeroMinimoPartecipanti}
          numeroMassimoPartecipanti={activity.numeroMassimoPartecipanti}
          luogo={activity.luogo}
          istruttore={activity.istruttore}
        />
      ))}
    </div>
  );
};

export default AttivitaInternaTab;
