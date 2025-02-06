import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, X } from "lucide-react";
import NavbarDashboard from "../Components/NavbarDashboard";
import { jwtDecode } from "jwt-decode";
import "../css/CreatePatient.css";
import "../css/ErrorPopup.css"; 
import "../css/SuccessPopup.css"; 

const CreateCaregiver = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Funzione per estrarre l'ID dal JWT (ad es. l'ID del centro o dell'admin che crea il caregiver)
  const getUserIdFromJWT = () => {
    const token = localStorage.getItem("jwt");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error("Errore nella decodifica del JWT:", error);
      return null;
    }
  };

  // Stato per i dati del caregiver.
  const [caregiverData, setCaregiverData] = useState({
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
    centroId: getUserIdFromJWT(),
  });

  // Stati per errori, successo e informazioni da mostrare in popup
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [caregiverInfo, setCaregiverInfo] = useState({ id: "", username: "", password: "" });
  const [showCaregiverInfoPopup, setShowCaregiverInfoPopup] = useState(false);

  // Stato per l'anteprima della foto profilo
  const [previewImage, setPreviewImage] = useState(null);

  // Pulizia automatica degli errori dopo 3 secondi
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Gestione aggiornamento dei campi del form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCaregiverData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Gestione caricamento file e anteprima
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCaregiverData((prev) => ({ ...prev, fotoProfilo: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Funzione per rimuovere la foto: resetta lo stato, l'anteprima e l'input file
  const handleRemovePhoto = () => {
    setPreviewImage(null);
    setCaregiverData((prev) => ({ ...prev, fotoProfilo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Invio dei dati al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    Object.keys(caregiverData).forEach((key) => {
      if (key === "fotoProfilo" && caregiverData[key]) {
        formData.append("fotoProfilo", caregiverData[key]);
      } else {
        formData.append(key, caregiverData[key]);
      }
    });

    // Debug: stampa tutte le entry del FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/aggiungi-caregiver",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCaregiverInfo({
        id: response.data.id,
        username: response.data.username,
        password: response.data.password,
      });
      setSuccess(true);
      setTimeout(() => {
        setShowCaregiverInfoPopup(true);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Errore durante la creazione del caregiver.");
      console.error("Errore:", err);
    }
  };

  const handleCloseCaregiverInfoPopup = () => {
    setShowCaregiverInfoPopup(false);
    navigate("/dashboard/utenza/caregiver");
  };

  return (
    <div className="create-patient-page">
      <NavbarDashboard />
      <div className="main-content">
        <div className="popup-container">
          {error && (
            <div className="error-popup">
              <div className="error-text">{error}</div>
              <div className="error-bar"></div>
            </div>
          )}
          {success && (
            <div className="success-popup">
              <div className="success-text">Caregiver creato con successo!</div>
              <div className="success-bar"></div>
            </div>
          )}
        </div>
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Torna indietro
        </button>
        <h1>Crea Profilo Caregiver</h1>
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
            <input type="text" name="dataNascita" required onChange={handleChange} />
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
            <input
              type="file"
              name="fotoProfilo"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            {previewImage && (
              <div className="preview-container">
                <img src={previewImage} alt="Anteprima Foto Profilo" className="preview-image" />
                <button type="button" className="remove-preview" onClick={handleRemovePhoto}>
                  Rimuovi Foto
                </button>
              </div>
            )}
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
      {showCaregiverInfoPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Caregiver creato con successo!</h3>
            <p><strong>ID:</strong> {caregiverInfo.id}</p>
            <p><strong>Username:</strong> {caregiverInfo.username}</p>
            <p><strong>Password provvisoria:</strong> {caregiverInfo.password}</p>
            <button className="btn-green" onClick={handleCloseCaregiverInfoPopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCaregiver;
