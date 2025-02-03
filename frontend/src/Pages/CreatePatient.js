import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import "../css/CreatePatient.css";
import NavbarDashboard from "../Components/NavbarDashboard";

const CreatePatient = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    nome: "",
    cognome: "",
    email: "",
    dataNascita: "",
    comuneResidenza: "",
    indirizzoResidenza: "",
    codiceFiscale: "",
    genere: "",
    telefono: "",
    disabilita: false,
    fotoProfilo: null,
  });

  // Aggiornamento dei campi del form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Gestione caricamento foto profilo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPatientData((prev) => ({ ...prev, fotoProfilo: file }));
  };

  // Invio dati al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

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

      alert(
        `Paziente creato con successo!\nID: ${response.data.id}\nUsername: ${response.data.username}\nPassword: ${response.data.password}`
      );
      navigate("/dashboard/utenza/pazienti");
    } catch (error) {
      alert("Errore nella creazione del paziente.");
      console.error("Errore:", error);
    }
  };

  return (
    <div className="create-patient-page">
      <NavbarDashboard />
      <div className="main-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Torna indietro
        </button>
        <h1>Crea Profilo Paziente</h1>

        <form onSubmit={handleSubmit} className="patient-form">
          {/* Esempio di altri campi del form */}
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
            <input type="text" name="comuneResidenza" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Indirizzo di Residenza</label>
            <input type="text" name="indirizzoResidenza" required onChange={handleChange} />
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
        {/* Sezione Foto Profilo */}
            <div className="profile-photo">
                <label>Foto Profilo</label>
                <input
                type="file"
                name="fotoProfilo"
                accept="image/*"
                onChange={handleFileChange}
            />
          </div>
          {/* Sezione Checkbox Disabilità */}
          <div className="form-group checkbox-group full-width">
            <div className="checkbox-container">
            <label htmlFor="disabilita">Disabilità</label>
              <input
                type="checkbox"
                name="disabilita"
                id="disabilita"
                onChange={handleChange}
              />
              
            </div>
            <p className="disability-info">
              Spunta la casella se il paziente soffre di qualsiasi tipologia di
              Disabilità, usa il menù contestuale per specificarne l'entità. La
              visibilità sarà limitata al centro e ai caregiver assegnati.
            </p>
          </div>

         

          {/* Pulsanti Azione */}
          <div className="form-actions">
            <div className="left-actions">
              <button type="submit" className="btn-green">
                Crea Profilo
              </button>
              <button
                type="button"
                className="btn-gray"
                onClick={() => navigate(-1)}
              >
                Annulla
              </button>
            </div>
            <div className="right-actions">
              {patientData.disabilita && (
                <button type="button" className="view-disability">
                  Visualizza Disabilità
                </button>
              )}
              <button type="button" className="btn-yellow">
                Contatti di Emergenza
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatient;
