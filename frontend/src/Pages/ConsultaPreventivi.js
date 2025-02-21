import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarDashboard from "../Components/NavbarDashboard";
import PreventivoCard from "../Components/PreventivoCard";
import "../css/ConsultaPreventivi.css";

export default function ConsultaPreventivi() {
  const { id } = useParams(); // L'id dell'attività esterna passato tramite URL
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [preventivi, setPreventivi] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recupera i dettagli dell'attività esterna
  const fetchActivityDetails = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(`http://localhost:5000/api/attivita/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { tipo: "E" }
      });
      setActivity(response.data.activity);
    } catch (err) {
      console.error("Errore nel recupero dei dettagli dell'attività:", err);
      setError("Errore durante il recupero dei dettagli dell'attività.");
    }
  };

  // Recupera l'elenco dei preventivi per l'attività
  const fetchPreventivi = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(`http://localhost:5000/api/attivita/${id}/preventivi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.preventivi);
      setPreventivi(response.data.preventivi || []);
    } catch (err) {
      console.error("Errore nel recupero dei preventivi:", err);
      setError("Errore durante il recupero dei preventivi.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchActivityDetails();
      await fetchPreventivi();
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Filtra i preventivi in base al termine di ricerca (controlla nome tour operator, luogo di partenza o di arrivo)
  const filteredPreventivi = preventivi.filter((prev) => {
    const search = searchTerm.toLowerCase();
    return (
      (prev.nomeTouroperator && prev.nomeTouroperator.toLowerCase().includes(search)) ||
      (prev.luogoPartenza && prev.luogoPartenza.toLowerCase().includes(search)) ||
      (prev.luogoArrivo && prev.luogoArrivo.toLowerCase().includes(search))
    );
  });
  
  return (
    <div className="consulta-preventivi">
      <NavbarDashboard />
      <div className="main-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Torna indietro
        </button>
        <div className="container">
          <div className="header">
            {activity ? (
              <>
                <h1>Preventivi per {activity.titolo}</h1>
                <p>Data attività: {activity.datainizio}</p>
              </>
            ) : (
              <h1>Preventivi</h1>
            )}
          </div>
          <div className="search-containerr">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Cerca tour operator o luogo..."
              className="search-inputt"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {loading ? (
            <p>Caricamento in corso...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : filteredPreventivi.length === 0 ? (
            <p className="no-data">Nessun preventivo trovato.</p>
          ) : (
            <div className="preventivi-list">
              {filteredPreventivi.map((prev) => (
                <PreventivoCard
                  key={prev.id}
                  idPrev={prev.id}
                  idAttivita={prev.idAttivita}
                  titolo={prev.nomeTouroperator}
                  data={prev.dataPreventivo}
                  cifra={prev.prezzoTotale}
                  luogoPartenza={prev.luogoPartenza}
                  luogoArrivo={prev.luogoArrivo}
                  accettato={prev.accettato}  // Passa lo stato di accettazione
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
