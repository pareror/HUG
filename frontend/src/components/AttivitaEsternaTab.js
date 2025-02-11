import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/AttivitaIntEst.css";
import AttivitaEsterna from "./AttivitaEsterna"; // Componente che renderizza la singola card

const AttivitaEsternaTab = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch delle attività esterne dal backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:5000/api/attivita-esterna", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Attività esterne:", response.data.activities);
        setActivities(response.data.activities || []);
      } catch (err) {
        console.error("Errore fetch attività esterne:", err);
        setError("Impossibile caricare le attività esterne.");
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
        <AttivitaEsterna
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

export default AttivitaEsternaTab;
