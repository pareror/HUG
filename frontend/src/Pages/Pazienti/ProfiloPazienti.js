import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti";
import "../../css/CreatePatient.css";
import "../../css/ErrorPopup.css";
import "../../css/SuccessPopup.css";
import "../../css/EmergencyContactsPopup.css";

const Profilo = () => {
  const navigate = useNavigate();

  // Dati del profilo
  const [profileData, setProfileData] = useState(null);
  // Copia dei dati originali (per annullare le modifiche)
  const [originalData, setOriginalData] = useState(null);

  // Contatti di emergenza (solo per pazienti)
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  // Stati di caricamento ed errori
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Stato per la modalità modifica (solo i campi modificabili: telefono, email, fotoProfilo)
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
        // Salva anche centroDiurnoId
        setProfileData(profile);
        setOriginalData(profile);
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

  // Gestione cambio campi: consentiamo modifiche solo a telefono ed email
  const handleChange = (e) => {
    if (!profileData) return;
    const { name, value } = e.target;
    if (name === "telefono" || name === "email") {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Gestione cambio file per la foto profilo
  const handleFileChange = (e) => {
    if (!profileData) return;
    const file = e.target.files[0];
    setProfileData((prev) => ({ ...prev, fotoProfilo: file }));
  };

  // Modifica/Salva (modifica solo telefono, email e fotoProfilo)
  const handleEditOrSave = async () => {
    if (!isEditing) {
      setOriginalData(profileData);
      setIsEditing(true);
    } else {
      try {
        setError(null);
        setSuccess(false);
  
        const formData = new FormData();
        // Invia tutti i campi necessari, inclusi quelli non modificabili, se necessario.
        Object.keys(profileData).forEach((key) => {
          if (key === "genere") {
            const validGenere = ["M", "F", "Altro"];
            const value = validGenere.includes(profileData.genere) && profileData.genere !== "" 
              ? profileData.genere 
              : "Altro";
            formData.append("genere", value);
          } else {
            formData.append(key, profileData[key] != null ? profileData[key] : "");
          }
        });
        // Assicurati di includere centroDiurnoId se il profilo è di un paziente
        if (profileData.role === "paziente") {
          formData.append("centroDiurnoId", profileData.centroDiurnoId);
        }
  
        await axios.put("http://localhost:5000/api/profilo", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        setSuccess(true);
        setIsEditing(false);
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
    setProfileData(originalData);
    setIsEditing(false);
  };

  if (loading) return <p>Caricamento...</p>;
  if (!profileData) return <p>Nessun profilo trovato.</p>;

  return (
    <div className="edit-patient-page" style={{ padding: "20px" }}>
      <NavbarPazienti />

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

        <h1>Profilo Paziente</h1>

        <form className="patient-form" onSubmit={(e) => e.preventDefault()}>
          {/* Campi base (sola lettura) */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={profileData.username || ""}
              readOnly={true}
              className="readonly"
            />
          </div>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={profileData.nome || ""}
              readOnly={true}
              className="readonly"
            />
          </div>
          <div className="form-group">
            <label>Cognome</label>
            <input
              type="text"
              name="cognome"
              value={profileData.cognome || ""}
              readOnly={true}
              className="readonly"
            />
          </div>
          <div className="form-group">
            <label>Data di nascita</label>
            <input
              type="text"
              name="dataNascita"
              value={profileData.dataNascita || ""}
              readOnly={true}
              className="readonly"
            />
          </div>
          <div className="form-group">
            <label>Comune di Residenza</label>
            <input
              type="text"
              name="comuneDiResidenza"
              value={profileData.comuneDiResidenza || ""}
              readOnly={true}
              className="readonly"
            />
          </div>
          <div className="form-group">
            <label>Indirizzo Residenza</label>
            <input
              type="text"
              name="indirizzoResidenza"
              value={profileData.indirizzoResidenza || ""}
              readOnly={true}
              className="readonly"
            />
          </div>
          <div className="form-group">
            <label>Codice Fiscale</label>
            <input
              type="text"
              name="codiceFiscale"
              value={profileData.codiceFiscale || ""}
              readOnly={true}
              className="readonly"
            />
          </div>
          <div className="form-group">
            <label>Genere</label>
            <select name="genere" value={profileData.genere || ""} disabled={true} className="readonly">
              <option value="">Seleziona</option>
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="Altro">Altro</option>
            </select>
          </div>
          {/* Campi modificabili: Telefono, Email e Foto Profilo */}
          <div className="form-group">
            <label>Telefono</label>
            <input
              type="text"
              name="telefono"
              value={profileData.telefono || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={!isEditing ? "readonly" : "editable"}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={profileData.email || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={!isEditing ? "readonly" : "editable"}
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

          {/* Sezione disabilità (sola lettura) */}
          <div className="form-group checkbox-group full-width">
            <label>Disabilità</label>
            <input
              type="checkbox"
              name="disabilita"
              checked={profileData.disabilita || false}
              disabled
              className="readonly"
              style={{ width: "40px" }}
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
                  readOnly
                  className="readonly"
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
                  readOnly
                  className="readonly"
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
                  readOnly
                  className="readonly"
                />
              </div>
              <div className="form-group">
                <label>Assistenza Continuativa</label>
                <input
                  type="checkbox"
                  name="assistenzaContinuativa"
                  checked={profileData.assistenzaContinuativa || false}
                  disabled
                  className="readonly"
                />
              </div>
            </>
          )}

          {/* Sezione contatti di emergenza in sola lettura */}
          {profileData.role === "paziente" && (
            <div className="emergency-contacts-section">
              <h3>Contatti di Emergenza</h3>
              {emergencyContacts.length === 0 ? (
                <p>Nessun contatto di emergenza</p>
              ) : (
                emergencyContacts.map((contact, index) => (
                  <div key={index} className="emergency-contact">
                    <p>
                      <strong>Contatto {index + 1}:</strong> {contact.nome} {contact.cognome} - {contact.telefono} ({contact.relazione})
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="form-actions">
            <div className="left-actions">
              <button type="button" className="btn-green" onClick={handleEditOrSave}>
                {isEditing ? "Salva" : "Modifica"}
              </button>
              {isEditing && (
                <button type="button" className="btn-gray" onClick={handleCancelEdit}>
                  Annulla
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profilo;
