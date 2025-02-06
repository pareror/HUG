import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import NavbarDashboard from "../Components/NavbarDashboard";
import { jwtDecode } from "jwt-decode";
import "../css/CreatePatient.css"; 
import "../css/ErrorPopup.css"; 
import "../css/SuccessPopup.css"; 

const EditCaregiver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Stato per i dati del caregiver
  const [caregiverData, setCaregiverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Stato per la preview dell'immagine
  const [previewImage, setPreviewImage] = useState(null);

  // Stato per il popup di conferma eliminazione
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  // Stato per il popup di successo dell'eliminazione
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);

  // Carica i dati del caregiver dal backend
  useEffect(() => {
    const fetchCaregiver = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/caregiver/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        const data = response.data.caregiver;
        // Imposta valori di default se null
        data.genere = data.genere || "";
        data.comuneDiResidenza = data.comuneDiResidenza || "";
        data.indirizzo = data.indirizzo || "";
        data.telefono = data.telefono || "";
        data.email = data.email || "";
        data.codiceFiscale = data.codiceFiscale || "";
        setCaregiverData(data);
        // Se esiste già una foto, impostala come anteprima
        if (data.fotoProfilo) {
          setPreviewImage(data.fotoProfilo);
        }
        setLoading(false);
      } catch (err) {
        setError("Errore nel caricamento dei dati del caregiver.");
        setLoading(false);
      }
    };
    fetchCaregiver();
  }, [id]);

  // Pulizia automatica degli errori
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Aggiornamento dei campi del form
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

  // Funzione per rimuovere la foto: resetta lo stato e l'input file
  const handleRemovePhoto = () => {
    setPreviewImage(null);
    setCaregiverData((prev) => ({ ...prev, fotoProfilo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Invio dei dati aggiornati al backend
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
      await axios.put(`http://localhost:5000/api/caregiver/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/utenza/caregiver"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Errore durante l'aggiornamento del caregiver.");
      console.error("Errore:", err);
    }
  };

  // Funzione per eliminare il profilo (richiede conferma)
  const handleDeleteProfile = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/profilo/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      setShowConfirmDelete(false);
      // Mostra il popup di successo per l'eliminazione
      setShowDeleteSuccessPopup(true);
      setTimeout(() => navigate("/dashboard/utenza/caregiver"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Errore durante l'eliminazione del profilo.");
      console.error("Errore:", err);
    }
  };

  // Funzione per aprire il popup di conferma eliminazione
  const handleConfirmDelete = () => {
    setShowConfirmDelete(true);
  };

  // Funzione per chiudere il popup di conferma eliminazione
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  if (loading || !caregiverData) return <p>Caricamento...</p>;

  return (
    <div className="edit-patient-page">
      <NavbarDashboard />
      <div className="main-content">
        {error && (
          <div className="error-popup">
            <div className="error-text">{error}</div>
            <div className="error-bar"></div>
          </div>
        )}
        {success && (
          <div className="success-popup">
            <div className="success-text">Caregiver aggiornato con successo!</div>
            <div className="success-bar"></div>
          </div>
        )}
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Torna indietro
        </button>
        <h1>Modifica Profilo Caregiver</h1>
        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              required
              value={caregiverData.nome || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Cognome</label>
            <input
              type="text"
              name="cognome"
              required
              value={caregiverData.cognome || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Data di nascita</label>
            <input
              type="text"
              name="dataNascita"
              required
              value={caregiverData.dataNascita || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Genere</label>
            <select name="genere" required value={caregiverData.genere} onChange={handleChange}>
              <option value="">Seleziona il genere</option>
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
              <option value="Altro">Altro</option>
            </select>
          </div>
          <div className="form-group">
            <label>Comune di Residenza</label>
            <input
              type="text"
              name="comuneDiResidenza"
              required
              value={caregiverData.comuneDiResidenza || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Indirizzo</label>
            <input
              type="text"
              name="indirizzo"
              required
              value={caregiverData.indirizzo || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Telefono</label>
            <input
              type="text"
              name="telefono"
              required
              value={caregiverData.telefono || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={caregiverData.email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Codice Fiscale</label>
            <input
              type="text"
              name="codiceFiscale"
              required
              value={caregiverData.codiceFiscale || ""}
              onChange={handleChange}
            />
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
                Salva Modifiche
              </button>
              <button type="button" className="btn-gray" onClick={() => navigate(-1)}>
                Annulla
              </button>
            </div>
            <div className="left-actions">
              <button type="button" className="btn-red" onClick={handleConfirmDelete}>
                Elimina Profilo
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Popup di conferma eliminazione */}
      {showConfirmDelete && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Conferma Eliminazione</h3>
            <p>Sei sicuro di voler eliminare il profilo? Questa operazione è irreversibile.</p>
            <div className="popup-actions">
              <button className="btn-red" onClick={handleDeleteProfile}>Conferma</button>
              <button className="btn-gray" onClick={handleCancelDelete}>Annulla</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup di successo eliminazione */}
      {showDeleteSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Profilo eliminato con successo!</h3>
            <button className="btn-green" onClick={() => navigate("/dashboard/utenza/caregiver")}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCaregiver;
