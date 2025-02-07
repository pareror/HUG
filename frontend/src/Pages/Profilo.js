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

  // Dati del profilo
  const [profileData, setProfileData] = useState(null);
  // Copia dei dati originali (per annullare le modifiche)
  const [originalData, setOriginalData] = useState(null);

  // Contatti di emergenza (solo per pazienti)
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [expandedContactIndex, setExpandedContactIndex] = useState(null);
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);

  // Stati di caricamento ed errori
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Popup di eliminazione
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);

  // **Stato per la modalità modifica** (visualizzazione = false / modifica = true)
  const [isEditing, setIsEditing] = useState(false);

  // Caricamento iniziale
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profilo", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        if (!response.data.profile) {
          setError("Profilo non trovato.");
          setLoading(false);
          return;
        }
        const profile = response.data.profile;

        // Impostiamo i dati attuali e la copia originale
        setProfileData(profile);
        setOriginalData(profile);

        // Se paziente, potremmo avere contatti di emergenza
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

  // Gestione cambio campi
  const handleChange = (e) => {
    if (!profileData) return;
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Gestione cambio file
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

  // **Modifica/Salva** (unico pulsante)
  const handleEditOrSave = async () => {
    if (!isEditing) {
      // ENTRA in modalità modifica
      // => Salviamo lo stato attuale in originalData, cosi possiamo annullare
      setOriginalData(profileData);
      setIsEditing(true);
    } else {
      // SALVA (PUT)
      try {
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        Object.keys(profileData).forEach((key) => {
          formData.append(key, profileData[key]);
        });

        // Aggiunge contatti emergenza (solo se role === 'paziente')
        formData.append("emergencyContacts", JSON.stringify(emergencyContacts));

        // Se paziente e disabilita = false => forziamo i campi a '0'
        if (profileData.role === "paziente" && !profileData.disabilita) {
          formData.set("disabilitaFisiche", "0");
          formData.set("disabilitaSensoriali", "0");
          formData.set("disabilitaPsichiche", "0");
          formData.set("assistenzaContinuativa", "0");
        }

        await axios.put("http://localhost:5000/api/profilo", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        setSuccess(true);
        // Torniamo in sola lettura
        setIsEditing(false);
        // Dopo 2s rimuoviamo il messaggio di successo
        setTimeout(() => setSuccess(false), 2000);
      } catch (err) {
        setError(err.response?.data?.error || "Errore durante l'aggiornamento del profilo.");
        console.error(err);
      }
    }
  };

  // Annulla (ripristina i dati originali e disattiva la modifica)
  const handleCancelEdit = () => {
    if (!originalData) return;
    // Ripristina i dati al valore iniziale
    setProfileData(originalData);
    // Se c’erano contatti emergenza modificati, potresti volerli ripristinare
    // (Se hai un original dei contatti, usa quello. Altrimenti, ricarica dal server.)
    if (originalData.emergencyContacts) {
      setEmergencyContacts(originalData.emergencyContacts);
    }
    setIsEditing(false);
  };

  const handleDeleteProfile = async () => {
    try {
      // Assumiamo che `profileData.id` contenga l'ID dell'utente
      await axios.delete(`http://localhost:5000/api/profilo/${profileData.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      localStorage.removeItem("jwt");
      setShowConfirmDelete(false);
      setShowDeleteSuccessPopup(true);
      // Reindirizziamo dopo 2 secondi
      setTimeout(() => navigate("/"), 2000);
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

  // Helper per disabilitare i campi se !isEditing
  const readOnlyProps = (isTextInput = true) =>
    isTextInput ? { readOnly: !isEditing } : { disabled: !isEditing };

  return (
    <div className="edit-patient-page">
      <NavbarDashboard />

      <div className="main-content">
        {/* Popup errori e successi */}
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

        {/* Form in sola lettura se !isEditing */}
        <form className="patient-form" onSubmit={(e) => e.preventDefault()}>
          {/* Se paziente => campi paziente */}
          {profileData.role === "paziente" && (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={profileData.nome || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Cognome</label>
                <input
                  type="text"
                  name="cognome"
                  value={profileData.cognome || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Data di nascita</label>
                <input
                  type="text"
                  name="dataNascita"
                  value={profileData.dataNascita || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Comune di Residenza</label>
                <input
                  type="text"
                  name="comuneDiResidenza"
                  value={profileData.comuneDiResidenza || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Indirizzo Residenza</label>
                <input
                  type="text"
                  name="indirizzoResidenza"
                  value={profileData.indirizzoResidenza || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Codice Fiscale</label>
                <input
                  type="text"
                  name="codiceFiscale"
                  value={profileData.codiceFiscale || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Genere</label>
                <select
                  name="genere"
                  value={profileData.genere || ""}
                  onChange={handleChange}
                  {...readOnlyProps(false)}
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
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={profileData.email || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Foto Profilo</label>
                {typeof profileData.fotoProfilo === "string" &&
                  profileData.fotoProfilo.includes("/uploads") && (
                    <img
                      src={profileData.fotoProfilo}
                      alt="Foto Profilo"
                      style={{ maxWidth: 150, marginBottom: 8 }}
                    />
                  )}
                <input
                  type="file"
                  name="fotoProfilo"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                      {...readOnlyProps(true)}
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
                      {...readOnlyProps(true)}
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
                      {...readOnlyProps(true)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Assistenza Continuativa</label>
                    <input
                      type="checkbox"
                      name="assistenzaContinuativa"
                      checked={profileData.assistenzaContinuativa || false}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Direttore di centro */}
          {profileData.role === "direttorecentro" && (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Comune di Residenza</label>
                <input
                  type="text"
                  name="comuneDiResidenza"
                  value={profileData.comuneDiResidenza || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Indirizzo Residenza</label>
                <input
                  type="text"
                  name="indirizzoResidenza"
                  value={profileData.indirizzoResidenza || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Telefono</label>
                <input
                  type="text"
                  name="telefono"
                  value={profileData.telefono || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Foto Profilo</label>
                {typeof profileData.fotoProfilo === "string" &&
                  profileData.fotoProfilo.includes("/uploads") && (
                    <img
                      src={profileData.fotoProfilo}
                      alt="Foto Profilo"
                      style={{ maxWidth: 150, marginBottom: 8 }}
                    />
                  )}
                <input
                  type="file"
                  name="fotoProfilo"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Ragione Sociale</label>
                <input
                  type="text"
                  name="ragioneSociale"
                  value={profileData.ragioneSociale || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Partita IVA</label>
                <input
                  type="text"
                  name="pIva"
                  value={profileData.pIva || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Codice SDI</label>
                <input
                  type="text"
                  name="codiceSdi"
                  value={profileData.codiceSdi || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Indirizzo (azienda)</label>
                <input
                  type="text"
                  name="indirizzo"
                  value={profileData.indirizzo || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
              <div className="form-group">
                <label>Email PEC</label>
                <input
                  type="email"
                  name="emailPec"
                  value={profileData.emailPec || ""}
                  onChange={handleChange}
                  {...readOnlyProps(true)}
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <div className="left-actions">
              {/* Unico pulsante che cambia testo in base a isEditing */}
              <button
                type="button"
                className="btn-green"
                onClick={handleEditOrSave}
              >
                {isEditing ? "Salva" : "Modifica"}
              </button>

              {/* Mostriamo il tasto Annulla SOLO quando isEditing === true */}
              {isEditing && (
                <button
                  type="button"
                  className="btn-gray"
                  onClick={handleCancelEdit}
                >
                  Annulla
                </button>
              )}
            </div>

            {/* Contatti di emergenza solo se paziente */}
            {profileData.role === "paziente" && (
              <div className="left-actions">
                <button
                  type="button"
                  className="btn-yellow"
                  onClick={() => setShowEmergencyPopup(true)}
                  disabled={!isEditing}
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

      {/* Popup contatti emergenza */}
      {profileData.role === "paziente" && showEmergencyPopup && (
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
                  <div
                    className="contact-header"
                    onClick={() => toggleContactDetails(index)}
                  >
                    <span>Contatto {index + 1}</span>
                    {expandedContactIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  <div
                    className={`contact-details ${expandedContactIndex === index ? "expanded" : ""}`}
                  >
                    <input
                      type="text"
                      name="nome"
                      placeholder="Nome"
                      value={contact.nome}
                      onChange={(e) => handleEmergencyContactChange(index, e)}
                      readOnly={!isEditing}
                    />
                    <input
                      type="text"
                      name="cognome"
                      placeholder="Cognome"
                      value={contact.cognome}
                      onChange={(e) => handleEmergencyContactChange(index, e)}
                      readOnly={!isEditing}
                    />
                    <input
                      type="text"
                      name="telefono"
                      placeholder="Numero di telefono"
                      value={contact.telefono}
                      onChange={(e) => handleEmergencyContactChange(index, e)}
                      readOnly={!isEditing}
                    />
                    <select
                      name="relazione"
                      value={contact.relazione}
                      onChange={(e) => handleEmergencyContactChange(index, e)}
                      disabled={!isEditing}
                    >
                      <option value="">Seleziona il grado di parentela</option>
                      <option value="Genitore">Genitore</option>
                      <option value="Fratello/Sorella">Fratello/Sorella</option>
                      <option value="Figlio">Figlio</option>
                    </select>
                    <button
                      className="remove-contact"
                      onClick={() => removeEmergencyContact(index)}
                      disabled={!isEditing}
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              ))}
              {isEditing && (
                <button className="btn-green" onClick={addEmergencyContact}>
                  <Plus size={16} /> Aggiungi Contatto
                </button>
              )}
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
            <button
              className="btn-green"
              onClick={() => navigate("/dashboard/utenza/pazienti")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profilo;
