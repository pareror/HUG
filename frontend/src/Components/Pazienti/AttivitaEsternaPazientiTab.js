import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/AttivitaIntEst.css";
import AttivitaEsterna from "../AttivitaEsterna"; // Componente che renderizza la singola card
import {jwtDecode} from "jwt-decode";

const AttivitaEsternaPazientiTab = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("jwt");
        // Decodifica il token per ottenere informazioni (se necessario)
        // Qui l'ID del paziente verrà utilizzato dall'API
        const response = await axios.get("http://localhost:5000/api/pazienti/attivita/esterne", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Attività esterne per pazienti:", response.data.activities);
        setActivities(response.data.activities || []);
      } catch (err) {
        console.error("Errore nel recupero delle attività esterne per pazienti:", err);
        setError("Impossibile caricare le attività esterne.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formattaData = (data) => {
    const [anno, mese, giorno] = data.split("-");
    return `${giorno}-${mese}-${anno}`;
  };

  if (loading) {
    return <p>Caricamento...</p>;
  }
  if (error) {
    return <p className="error">{error}</p>;
  }

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
          costo={activity.costo}
        />
      ))}
    </div>
  );
};

export default AttivitaEsternaPazientiTab;
