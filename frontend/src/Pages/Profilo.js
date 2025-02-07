import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import NavbarDashboard from "../Components/NavbarDashboard";
import "../css/CreatePatient.css";
import "../css/ErrorPopup.css";
import "../css/SuccessPopup.css";
import "../css/EmergencyContactsPopup.css";

const Profilo = () => {
  const navigate = useNavigate();

  // Stato per i dati del profilo
  const [profileData, setProfileData] = useState(null);

  // Stato per i contatti di emergenza (solo per paziente)
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [expandedContactIndex, setExpandedContactIndex] = useState(null);
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);

  // Altri stati
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Popup di eliminazione
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);

  // Caricamento iniziale del profilo
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Richiesta al backend, che in base al JWT determina ruolo e ID
        const response = await axios.get("http://localhost:5000/api/profilo", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        console.log(response.data);
        if (!response.data.profile) {
          setError("Profilo non trovato.");
          setLoading(false);
          return;
        }
        const profile = response.data.profile;
        setProfileData(profile);

        // Se è un paziente e ha contatti, li salviamo
        if (profile.emergencyContacts) {
          setEmergencyContacts(profile.emergencyContacts);
        }
        setLoading(false);
      } catch (err) {
        setError("Errore nel caricamento del profilo.");
        setLoading(false);
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  // Pulizia errori
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Gestione del form
  const handleChange = (e) => {
    if (!profileData) return;
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (!profileData) return;
    const file = e.target.files[0];
    setProfileData((prev) => ({ ...prev, fotoProfilo: file }));
  };

  // Contatti di emergenza
  const handleEmergencyContactChange = (index, e) => {
    const { name, value } = e.target;
    setEmergencyContacts((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };
  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { nome: "", cognome: "", telefono: "", relazione: "" }]);
    setExpandedContactIndex(emergencyContacts.length);
  };
  const removeEmergencyContact = (index) => {
    setEmergencyContacts((prev) => prev.filter((_, i) => i !== index));
  };
  const toggleContactDetails = (index) => {
    setExpandedContactIndex(expandedContactIndex === index ? null : index);
  };
  const areContactsValid = () => {
    return emergencyContacts.every(
      (c) =>
        c.nome.trim() !== "" &&
        c.cognome.trim() !== "" &&
        c.telefono.trim() !== "" &&
        c.relazione.trim() !== ""
    );
  };
  const handleCloseEmergencyPopup = () => {
    if (!areContactsValid()) {
      setError("Tutti i campi dei contatti di emergenza devono essere compilati.");
      return;
    }
    setShowEmergencyPopup(false);
  };

  // Salvataggio dati
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileData) return;

    setError(null);
    setSuccess(false);

    const formData = new FormData();
    // Aggiungiamo tutte le chiavi dell'oggetto profileData
    Object.keys(profileData).forEach((key) => {
      formData.append(key, profileData[key]);
    });
    // Se emerg. contacts esistono (solo se paziente)
    formData.append("emergencyContacts", JSON.stringify(emergencyContacts));

    // Se disabilita è false (caso paziente)
    if (profileData.role === "paziente" && !profileData.disabilita) {
      formData.set("disabilitaFisiche", "0");
      formData.set("disabilitaSensoriali", "0");
      formData.set("disabilitaPsichiche", "0");
      formData.set("assistenzaContinuativa", "0");
    }

    try {
      await axios.put("http://localhost:5000/api/profilo", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/utenza/pazienti"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Errore durante l'aggiornamento del profilo.");
      console.error(err);
    }
  };

  // Eliminazione profilo
  const handleDeleteProfile = async () => {
    try {
      await axios.delete("http://localhost:5000/api/profilo", {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      setShowConfirmDelete(false);
      setShowDeleteSuccessPopup(true);
      setTimeout(() => navigate("/dashboard/utenza/pazienti"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Errore durante l'eliminazione del profilo.");
      console.error(err);
    }
  };
  const handleConfirmDelete = () => {
    setShowConfirmDelete(true);
  };
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  if (loading) return <p>Caricamento...</p>;
  if (!profileData) return <p>Nessun profilo trovato.</p>;

  // Render del form a seconda del ruolo
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
              <div className="success-text">Profilo aggiornato con successo!</div>
              <div className="success-bar"></div>
            </div>
          )}
        </div>

        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Torna indietro
        </button>
        <h1>Profilo {profileData.role === "paziente" ? "Paziente" : "Centro"}</h1>

        <form onSubmit={handleSubmit} className="patient-form">
          {/* Se role === "paziente", mostriamo i campi paziente */}
          {profileData.role === "paziente" && (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={profileData.nome || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Cognome</label>
                <input
                  type="text"
                  name="cognome"
                  value={profileData.cognome || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Data di nascita</label>
                <input
                  type="text"
                  name="dataNascita"
                  value={profileData.dataNascita || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Comune di Residenza</label>
                <input
                  type="text"
                  name="comuneDiResidenza"
                  value={profileData.comuneDiResidenza || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Indirizzo Residenza</label>
                <input
                  type="text"
                  name="indirizzoResidenza"
                  value={profileData.indirizzoResidenza || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Codice Fiscale</label>
                <input
                  type="text"
                  name="codiceFiscale"
                  value={profileData.codiceFiscale || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Genere</label>
                <select
                  name="genere"
                  value={profileData.genere || ""}
                  onChange={handleChange}
                >
                  <option value="">Seleziona</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                  <option value="Altro">Altro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Telefono</label>
                <input
                  type="text"
                  name="telefono"
                  value={profileData.telefono || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={profileData.email || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Foto Profilo</label>
                <input
                  type="file"
                  name="fotoProfilo"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              {/* Disabilità */}
              <div className="form-group checkbox-group full-width">
                <label>Disabilità</label>
                <input
                  type="checkbox"
                  name="disabilita"
                  checked={profileData.disabilita || false}
                  onChange={handleChange}
                />
              </div>
              {profileData.disabilita && (
                <>
                  <div className="form-group">
                    <label>Disabilità Fisiche (0-5)</label>
                    <input
                      type="number"
                      name="disabilitaFisiche"
                      min="0"
                      max="5"
                      value={profileData.disabilitaFisiche || "0"}
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
                      value={profileData.disabilitaSensoriali || "0"}
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
                      value={profileData.disabilitaPsichiche || "0"}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Assistenza Continuativa</label>
                    <input
                      type="checkbox"
                      name="assistenzaContinuativa"
                      checked={profileData.assistenzaContinuativa || false}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Se role === 'direttorecentro', mostriamo i campi direttore */}
          {profileData.role === "direttorecentro" && (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Comune di Residenza</label>
                <input
                  type="text"
                  name="comuneDiResidenza"
                  value={profileData.comuneDiResidenza || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Indirizzo Residenza</label>
                <input
                  type="text"
                  name="indirizzoResidenza"
                  value={profileData.indirizzoResidenza || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Telefono</label>
                <input
                  type="text"
                  name="telefono"
                  value={profileData.telefono || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Foto Profilo</label>
                <input
                  type="file"
                  name="fotoProfilo"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="form-group">
                <label>Ragione Sociale</label>
                <input
                  type="text"
                  name="ragioneSociale"
                  value={profileData.ragioneSociale || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Partita IVA</label>
                <input
                  type="text"
                  name="pIva"
                  value={profileData.pIva || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Codice SDI</label>
                <input
                  type="text"
                  name="codiceSdi"
                  value={profileData.codiceSdi || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Indirizzo (azienda)</label>
                <input
                  type="text"
                  name="indirizzo"
                  value={profileData.indirizzo || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email PEC</label>
                <input
                  type="email"
                  name="emailPec"
                  value={profileData.emailPec || ""}
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
              <button
                type="button"
                className="btn-gray"
                onClick={() => navigate(-1)}
              >
                Annulla
              </button>
            </div>
            {/* I contatti di emergenza vengono mostrati solo se role === 'paziente' */}
            {profileData.role === "paziente" && (
              <div className="left-actions">
                <button
                  type="button"
                  className="btn-yellow"
                  onClick={() => setShowEmergencyPopup(true)}
                >
                  Contatti di Emergenza
                </button>
              </div>
            )}
            <div className="left-actions">
              <button
                type="button"
                className="btn-red"
                onClick={handleConfirmDelete}
              >
                Elimina Profilo
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Popup contatti emergenza (solo se paziente) */}
      {profileData?.role === "paziente" && showEmergencyPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-header">
              <h3>Contatti di Emergenza</h3>
              <button className="close-button" onClick={handleCloseEmergencyPopup}>
                <X size={20} />
              </button>
            </div>
            <div className="popup-content">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="emergency-contact">
                  <div className="contact-header" onClick={() => toggleContactDetails(index)}>
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
                    <button
                      className="remove-contact"
                      onClick={() => removeEmergencyContact(index)}
                    >
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

      {/* Popup conferma eliminazione */}
      {showConfirmDelete && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Conferma Eliminazione</h3>
            <p>Sei sicuro di voler eliminare il profilo?</p>
            <div className="popup-actions">
              <button className="btn-red" onClick={handleDeleteProfile}>
                Conferma
              </button>
              <button className="btn-gray" onClick={handleCancelDelete}>
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup successo eliminazione */}
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

export default Profilo;
