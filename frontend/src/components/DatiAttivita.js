import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/DettaglioAttivita.css";
import DettaglioAttivita from "./DettaglioAttivita";

const DatiAttivita = ({ selectedKey }) => {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/attivita/${selectedKey}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          params: { tipo: "I" } // ✅ Passa il tipo nella query string
        });
  
        setActivity(response.data.activity);
      } catch (err) {
        console.error("❌ Errore nel recupero dell'attività:", err);
        setError("Impossibile recuperare i dettagli dell'attività.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchActivity();
  }, [selectedKey]);
  


  if (loading) return <div>Caricamento...</div>;
  if (error) return <div>{error}</div>;
  if (!activity) return <div>Attività non trovata.</div>;

  return <DettaglioAttivita {...activity} />;
};

export default DatiAttivita;
