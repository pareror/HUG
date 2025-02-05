import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, X } from "lucide-react";
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

  const [showPatientInfoPopup, setShowPatientInfoPopup] = useState(false);
  const [patientInfo, setPatientInfo] = useState({ id: "", username: "", password: "" });
  
   // Gestione popup contatti di emergenza
   const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
   const [emergencyContacts, setEmergencyContacts] = useState([]);

  // Pulizia automatica degli errori dopo 3 secondi
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
  // Funzione per aggiungere un nuovo contatto di emergenza
  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { nome: "", cognome: "", telefono: "", relazione: "" }]);
  };
  
  // Funzione per aggiornare un contatto di emergenza
  const handleEmergencyContactChange = (index, e) => {
    const { name, value } = e.target;
    setEmergencyContacts((prev) => {
      const updatedContacts = [...prev];
      updatedContacts[index][name] = value;
      return updatedContacts;
    });
  };

    // Funzione per rimuovere un contatto di emergenza
    const removeEmergencyContact = (index) => {
      setEmergencyContacts((prev) => prev.filter((_, i) => i !== index));
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
    // Se la checkbox "Disabilità" è disattivata, inviamo i campi relativi con valori di default (0)
    if (!patientData.disabilita) {
        formData.set("disabilitaFisiche", "0");
        formData.set("disabilitaSensoriali", "0");
        formData.set("disabilitaPsichiche", "0");
        formData.set("assistenzaContinuativa", "0");
      }
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
        // ✅ Memorizziamo le informazioni del paziente per mostrarle nel popup
        setPatientInfo({
            id: response.data.id,
            username: response.data.username,
            password: response.data.password,
        });
         // Dopo il successo, inviamo i contatti di emergenza
        if (emergencyContacts.length > 0) {
          for (const contact of emergencyContacts) {
            await axios.post("http://localhost:5000/api/aggiungi-contatto-emergenza", {
              patientId: response.data.id,
              ...contact,
            }, 
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            });
          }
        }
        setSuccess(true); // Mostra il popup di successo
        // Dopo 3 secondi mostra il popup con i dettagli del paziente
        setTimeout(() => {
            setShowPatientInfoPopup(true);
        }, 1000);
    } catch (error) {
      setError(error.response?.data?.error || "Errore durante la creazione del paziente.");
      console.error("Errore:", error);
    }
  };
  const handleClosePatientInfoPopup = () => {
    setShowPatientInfoPopup(false);
    navigate("/dashboard/utenza/pazienti"); // ✅ Dopo la chiusura, reindirizza alla lista pazienti
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
          {patientData.disabilita && (
            <>
              <div className="form-group">
                <label>Disabilità Fisiche (0-5)</label>
                <input type="number" name="disabilitaFisiche" min="0" max="5" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Disabilità Sensoriali (0-5)</label>
                <input type="number" name="disabilitaSensoriali" min="0" max="5" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Disabilità Psichiche (0-5)</label>
                <input type="number" name="disabilitaPsichiche" min="0" max="5" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Assistenza Continuativa</label>
                <input type="checkbox" name="assistenzaContinuativa" onChange={handleChange} />
              </div>
            </>
          )}
          <div className="form-actions">
            <div className="left-actions">
              <button type="submit" className="btn-green">
                Crea Profilo
              </button>
              <button type="button" className="btn-gray" onClick={() => navigate(-1)}>
                Annulla
              </button>
            </div>
            <div className="left-actions">
              <button type="button" className="btn-yellow" onClick={() => setShowEmergencyPopup(true)}>
                Contatti di Emergenza
              </button>
            </div>
          </div>
        </form>
      </div>
       {/* Popup Contatti di Emergenza */}
       {showEmergencyPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Contatti di Emergenza</h3>
            <button className="close-button" onClick={() => setShowEmergencyPopup(false)}>
              <X size={20} />
            </button>

            {emergencyContacts.map((contact, index) => (
              <div key={index} className="emergency-contact">
                <input type="text" name="nome" placeholder="Nome" value={contact.nome} onChange={(e) => handleEmergencyContactChange(index, e)} />
                <input type="text" name="cognome" placeholder="Cognome" value={contact.cognome} onChange={(e) => handleEmergencyContactChange(index, e)} />
                <input type="text" name="telefono" placeholder="Numero di telefono" value={contact.telefono} onChange={(e) => handleEmergencyContactChange(index, e)} />
                <select name="relazione" value={contact.relazione} onChange={(e) => handleEmergencyContactChange(index, e)}>
                  <option value="">Seleziona il grado di parentela</option>
                  <option value="Genitore">Genitore</option>
                  <option value="Fratello/Sorella">Fratello/Sorella</option>
                  <option value="Figlio">Figlio</option>
                </select>
                <button className="remove-contact" onClick={() => removeEmergencyContact(index)}>Rimuovi</button>
              </div>
            ))}

            <button className="btn-green" onClick={addEmergencyContact}>
              <Plus size={16} /> Aggiungi Contatto
            </button>
          </div>
        </div>
      )}
      {/* Popup con i dettagli del paziente */}
        {showPatientInfoPopup && (
        <div className="popup-overlay">
            <div className="popup-box">
            <h3>Paziente creato con successo!</h3>
            <p><strong>ID:</strong> {patientInfo.id}</p>
            <p><strong>Username:</strong> {patientInfo.username}</p>
            <p><strong>Password provvisoria:</strong> {patientInfo.password}</p>
            <button className="btn-green" onClick={handleClosePatientInfoPopup}>OK</button>
            </div>
        </div>
        )}
    </div>
  );
};

export default CreatePatient;
