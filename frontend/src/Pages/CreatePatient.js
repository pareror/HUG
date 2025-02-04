import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import "../css/CreatePatient.css";
import "../css/ErrorPopup.css"; // Per popup di errore
import "../css/SuccessPopup.css"; // Per popup di successo
import NavbarDashboard from "../Components/NavbarDashboard";
import { jwtDecode } from "jwt-decode";

const CreatePatient = () => {
  const navigate = useNavigate();

  // Funzione per estrarre l'ID dal JWT
  const getUserIdFromJWT = () => {
    const token = localStorage.getItem("jwt");
    if (!token) return null; // Se non c'è token, ritorna null

    try {
      const decoded = jwtDecode(token);
      return decoded.id; // Assumiamo che il JWT abbia un campo "id"
    } catch (error) {
      console.error("Errore nella decodifica del JWT:", error);
      return null;
    }
  };

  const [patientData, setPatientData] = useState({
    nome: "",
    cognome: "",
    email: "",
    dataNascita: "",
    comuneDiResidenza: "",
    indirizzo: "",
    codiceFiscale: "",
    genere: "",
    telefono: "",
    fotoProfilo: null,
    centroDiurnoId: getUserIdFromJWT(),
    disabilita: false,
    disabilitaFisiche: "0",
    disabilitaSensoriali: "0",
    disabilitaPsichiche: "0",
    assistenzaContinuativa: false,
  });

  // Stato per messaggi di successo o errore
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Pulizia automatica degli errori dopo 3 secondi
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Dopo il successo, reindirizza alla pagina dei pazienti
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/dashboard/utenza/pazienti");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Gestione aggiornamento campi
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Gestione caricamento file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPatientData((prev) => ({ ...prev, fotoProfilo: file }));
  };

  // Invio dati al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    Object.keys(patientData).forEach((key) => {
      formData.append(key, patientData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/aggiungi-paziente",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(true); // Mostra il popup di successo

    } catch (error) {
      setError(error.response?.data?.error || "Errore durante la creazione del paziente.");
      console.error("Errore:", error);
    }
  };

  return (
    <div className="create-patient-page">
      <NavbarDashboard />
    
      <div className="main-content">
      <div className="popup-container">
      {/* Popup di errore */}
      {error && (
        <div className="error-popup">
          <div className="error-text">{error}</div>
          <div className="error-bar"></div>
        </div>
      )}

      {/* Popup di successo */}
      {success && (
        <div className="success-popup">
          <div className="success-text">Paziente creato con successo!</div>
          <div className="success-bar"></div>
        </div>
      )}
    </div>
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Torna indietro
        </button>
        <h1>Crea Profilo Paziente</h1>

        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-group">
            <label>Nome</label>
            <input type="text" name="nome" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Cognome</label>
            <input type="text" name="cognome" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Data di nascita</label>
            <input type="date" name="dataNascita" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Genere</label>
            <select name="genere" required onChange={handleChange}>
              <option value="">Seleziona il genere</option>
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
              <option value="Altro">Altro</option>
            </select>
          </div>
          <div className="form-group">
            <label>Comune di Residenza</label>
            <input type="text" name="comuneDiResidenza" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Indirizzo</label>
            <input type="text" name="indirizzo" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Telefono</label>
            <input type="text" name="telefono" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Codice Fiscale</label>
            <input type="text" name="codiceFiscale" required onChange={handleChange} />
          </div>
          <div className="profile-photo">
            <label>Foto Profilo</label>
            <input type="file" name="fotoProfilo" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-group checkbox-group full-width">
            <label htmlFor="disabilita">Disabilità</label>
            <input type="checkbox" name="disabilita" id="disabilita" onChange={handleChange} />
          </div>

          <div className="form-actions">
            <div className="left-actions">
              <button type="submit" className="btn-green">
                Crea Profilo
              </button>
              <button type="button" className="btn-gray" onClick={() => navigate(-1)}>
                Annulla
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatient;
