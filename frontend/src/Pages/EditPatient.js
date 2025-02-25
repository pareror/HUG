import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import NavbarDashboard from "../Components/NavbarDashboard";
import { jwtDecode } from "jwt-decode";
import "../css/CreatePatient.css"; 
import "../css/ErrorPopup.css"; 
import "../css/SuccessPopup.css"; 
import "../css/EmergencyContactsPopup.css"; 

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Stato per la gestione dei contatti di emergenza
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [expandedContactIndex, setExpandedContactIndex] = useState(null);

  // Stati per i popup di eliminazione
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);

  // Carica i dati del paziente dal backend
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/paziente/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        const data = response.data.patient;
        // Forza i campi testuali a stringa (se null)
        data.genere = data.genere || "";
        data.comuneDiResidenza = data.comuneDiResidenza || "";
        data.indirizzo = data.indirizzo || "";
        data.telefono = data.telefono || "";
        data.email = data.email || "";
        data.codiceFiscale = data.codiceFiscale || "";
        // Campi relativi alle disabilità
        data.disabilita = data.disabilita || false;
        data.disabilitaFisiche = data.disabilitaFisiche || "0";
        data.disabilitaSensoriali = data.disabilitaSensoriali || "0";
        data.disabilitaPsichiche = data.disabilitaPsichiche || "0";
        data.assistenzaContinuativa = data.assistenzaContinuativa || false;
        setPatientData(data);
        console.log("Contatti:", response.data.emergencyContacts);
        setEmergencyContacts(response.data.emergencyContacts || []);
        setLoading(false);
      } catch (err) {
        setError("Errore nel caricamento dei dati del paziente.");
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  // Pulizia automatica degli errori dopo 3 secondi
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Aggiornamento dei campi del form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Gestione caricamento file per la foto di profilo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPatientData((prev) => ({ ...prev, fotoProfilo: file }));
  };

  // Gestione dei contatti di emergenza nel popup
  const handleEmergencyContactChange = (index, e) => {
    const { name, value } = e.target;
    setEmergencyContacts((prev) => {
      const updatedContacts = [...prev];
      updatedContacts[index][name] = value;
      return updatedContacts;
    });
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { nome: "", cognome: "", telefono: "", relazione: "" }]);
    setExpandedContactIndex(emergencyContacts.length);
  };

  const removeEmergencyContact = (index) => {
    setEmergencyContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const areContactsValid = () => {
    return emergencyContacts.every(
      (contact) =>
        contact.nome.trim() !== "" &&
        contact.cognome.trim() !== "" &&
        contact.telefono.trim() !== "" &&
        contact.relazione.trim() !== ""
    );
  };

  const handleCloseEmergencyPopup = () => {
    if (!areContactsValid()) {
      setError("Tutti i campi dei contatti di emergenza devono essere compilati.");
      return;
    }
    setShowEmergencyPopup(false);
  };

  const toggleContactDetails = (index) => {
    setExpandedContactIndex(expandedContactIndex === index ? null : index);
  };

  // Invio dei dati aggiornati al backend in un'unica chiamata PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    Object.keys(patientData).forEach((key) => {
      formData.append(key, patientData[key]);
    });
    // Includiamo i contatti di emergenza come stringa JSON
    const emergencyContactsJSON = JSON.stringify(emergencyContacts);
    formData.append("emergencyContacts", emergencyContactsJSON);
    // Se la checkbox "Disabilità" è disattivata, forziamo i relativi campi a "0"
    if (!patientData.disabilita) {
      formData.set("disabilitaFisiche", "0");
      formData.set("disabilitaSensoriali", "0");
      formData.set("disabilitaPsichiche", "0");
      formData.set("assistenzaContinuativa", "0");
    }
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      await axios.put(`http://localhost:5000/api/paziente/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/utenza/pazienti"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Errore durante l'aggiornamento del paziente.");
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
      setShowDeleteSuccessPopup(true);
      setTimeout(() => navigate("/dashboard/utenza/pazienti"), 2000);
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

  if (loading) return <p>Caricamento...</p>;

  return (
    <div className="edit-patient-page">
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
              <div className="success-text">Paziente aggiornato con successo!</div>
              <div className="success-bar"></div>
            </div>
          )}
        </div>
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Torna indietro
        </button>
        <h1>Modifica Profilo Paziente</h1>
        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              required
              value={patientData.nome || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Cognome</label>
            <input
              type="text"
              name="cognome"
              required
              value={patientData.cognome || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Data di nascita</label>
            <input
              type="text"
              name="dataNascita"
              required
              value={patientData.dataNascita || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Genere</label>
            <select
              name="genere"
              required
              value={patientData.genere}
              onChange={handleChange}
            >
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
              value={patientData.comuneDiResidenza || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Indirizzo</label>
            <input
              type="text"
              name="indirizzo"
              required
              value={patientData.indirizzo || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Telefono</label>
            <input
              type="text"
              name="telefono"
              required
              value={patientData.telefono || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={patientData.email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Codice Fiscale</label>
            <input
              type="text"
              name="codiceFiscale"
              required
              value={patientData.codiceFiscale || ""}
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
            />
          </div>
          <div className="form-group checkbox-group full-width">
            <label htmlFor="disabilita">Disabilità</label>
            <input
              type="checkbox"
              name="disabilita"
              id="disabilita"
              checked={patientData.disabilita || false}
              onChange={handleChange}
            />
          </div>
          {patientData.disabilita && (
            <>
              <div className="form-group">
                <label>Disabilità Fisiche (0-5)</label>
                <input
                  type="number"
                  name="disabilitaFisiche"
                  min="0"
                  max="5"
                  value={patientData.disabilitaFisiche || "0"}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Disabilità Sensoriali (0-5)</label>
                <input
                  type="number"
                  name="disabilitaSensoriali"
                  min="0"
                  max="5"
                  value={patientData.disabilitaSensoriali || "0"}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Disabilità Psichiche (0-5)</label>
                <input
                  type="number"
                  name="disabilitaPsichiche"
                  min="0"
                  max="5"
                  value={patientData.disabilitaPsichiche || "0"}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Assistenza Continuativa</label>
                <input
                  type="checkbox"
                  name="assistenzaContinuativa"
                  checked={patientData.assistenzaContinuativa || false}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
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
              <button type="button" className="btn-yellow" onClick={() => setShowEmergencyPopup(true)}>
                Contatti di Emergenza
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

      {/* Popup per la gestione dei contatti di emergenza */}
      {showEmergencyPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-header">
              <h3>Contatti di Emergenza</h3>
              <button className="close-button" onClick={() => setShowEmergencyPopup(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="popup-content">
              {/* Il codice per i contatti di emergenza rimane invariato */}
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="emergency-contact">
                  <div
                    className="contact-header"
                    onClick={() => toggleContactDetails(index)}
                  >
                    <span>Contatto {index + 1}</span>
                    {expandedContactIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  <div className={`contact-details ${expandedContactIndex === index ? "expanded" : ""}`}>
                    <input
                      type="text"
                      name="nome"
                      placeholder="Nome"
                      value={contact.nome}
                      onChange={(e) => handleEmergencyContactChange(index, e)}
                    />
                    <input
                      type="text"
                      name="cognome"
                      placeholder="Cognome"
                      value={contact.cognome}
                      onChange={(e) => handleEmergencyContactChange(index, e)}
                    />
                    <input
                      type="text"
                      name="telefono"
                      placeholder="Numero di telefono"
                      value={contact.telefono}
                      onChange={(e) => handleEmergencyContactChange(index, e)}
                    />
                    <select
                      name="relazione"
                      value={contact.relazione}
                      onChange={(e) => handleEmergencyContactChange(index, e)}
                    >
                      <option value="">Seleziona il grado di parentela</option>
                      <option value="Genitore">Genitore</option>
                      <option value="Fratello/Sorella">Fratello/Sorella</option>
                      <option value="Figlio">Figlio</option>
                    </select>
                    <button className="remove-contact" onClick={() => removeEmergencyContact(index)}>
                      Rimuovi
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn-green" onClick={addEmergencyContact}>
                <Plus size={16} /> Aggiungi Contatto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup di conferma eliminazione */}
      {showConfirmDelete && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Conferma Eliminazione</h3>
            <p>Sei sicuro di voler eliminare il profilo? Questa operazione è irreversibile.</p>
            <div className="popup-actions">
              <button className="btn-red" onClick={handleDeleteProfile}>
                Conferma
              </button>
              <br></br>
              <button className="btn-gray" onClick={handleCancelDelete}>
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup di successo eliminazione */}
      {showDeleteSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Profilo eliminato con successo!</h3>
            <button className="btn-green" onClick={() => navigate("/dashboard/utenza/pazienti")}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPatient;
