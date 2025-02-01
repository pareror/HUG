import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import "../css/ErrorPopup.css"; 
import "../css/SuccessPopup.css"; 
import "../css/Register.css";
import { HashLink as Link } from "react-router-hash-link";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    comuneDiResidenza: "",
    tipologia: "centro",
    ragioneSociale: "",
    pIva: "",
    telefono: "",
    codiceSdi: "",
    indirizzo: "",
    emailPec: "",
    password: "",
    confermaPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Rimuove l'errore relativo al campo in modifica
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Funzioni di validazione
  const isValidPIVA = (pIva) => /^\d{11}$/.test(pIva);
  const isValidPhone = (telefono) => /^\d{9,15}$/.test(telefono);
  const isValidEmail = (emailPec) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailPec);
  const isValidPassword = (password) => password.length >= 8;

  // Validazione dei campi del form
  const validateForm = () => {
    let newErrors = {};

    if (!formData.username.trim())
      newErrors.username = "Username è richiesto.";
    if (!formData.comuneDiResidenza.trim())
      newErrors.comuneDiResidenza = "Il comune di residenza è richiesto.";

    if (!isValidPIVA(formData.pIva))
      newErrors.pIva = "Partita IVA non valida (11 cifre richieste).";
    if (!isValidPhone(formData.telefono))
      newErrors.telefono = "Numero di telefono non valido (9-15 cifre).";
    if (!isValidEmail(formData.emailPec))
      newErrors.emailPec = "Email PEC non valida.";
    if (!isValidPassword(formData.password))
      newErrors.password = "La password deve avere almeno 8 caratteri.";
    if (formData.password !== formData.confermaPassword)
      newErrors.confermaPassword = "Le password non corrispondono.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    if (!validateForm()) return; // Se ci sono errori, interrompe l'invio

    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
      if (response.status === 201) {
        setSuccess(true);
      }
    } catch (err) {
      setErrors({ server: err.response?.data?.error || "Errore durante la registrazione." });
    }
  };

  // Effetto per reindirizzare dopo 3 secondi se la registrazione è andata a buon fine
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="register-container">
      {success && (
        <div className="success-popup">
          <div className="success-text">
            Registrazione completata! Reindirizzamento...
          </div>
          <div className="success-bar"></div>
        </div>
      )}

      <div className="register-content">
        <div className="register-form">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Torna indietro
          </button>

          <h2>Registrazione</h2>
          <p>Compila i dati per creare il tuo account</p>

          {errors.server && <div className="error-message">{errors.server}</div>}

          <form onSubmit={handleSubmit}>
            <label>Tipologia</label>
            <select name="tipologia" value={formData.tipologia} onChange={handleChange}>
              <option value="centro">Centro</option>
              <option value="tour">Tour</option>
              <option value="enti">Enti</option>
            </select>

            {/* Nuovo campo Username */}
            <label>Username</label>
            <input
              type="text"
              name="username"
              required
              onChange={handleChange}
              className={errors.username ? "error" : ""}
            />
            {errors.username && <div className="error-message">{errors.username}</div>}

            {/* Nuovo campo Comune di Residenza */}
            <label>Comune di Residenza</label>
            <input
              type="text"
              name="comuneDiResidenza"
              required
              onChange={handleChange}
              className={errors.comuneDiResidenza ? "error" : ""}
            />
            {errors.comuneDiResidenza && (
              <div className="error-message">{errors.comuneDiResidenza}</div>
            )}

            <label>Ragione Sociale</label>
            <input
              type="text"
              name="ragioneSociale"
              required
              onChange={handleChange}
            />

            <label>Partita IVA</label>
            <input
              type="text"
              name="pIva"
              className={errors.pIva ? "error" : ""}
              required
              onChange={handleChange}
            />
            {errors.pIva && <div className="error-message">{errors.pIva}</div>}

            <label>Numero di Telefono</label>
            <input
              type="text"
              name="telefono"
              className={errors.telefono ? "error" : ""}
              required
              onChange={handleChange}
            />
            {errors.telefono && <div className="error-message">{errors.telefono}</div>}

            <label>Codice SDI</label>
            <input
              type="text"
              name="codiceSdi"
              required
              onChange={handleChange}
            />

            <label>Indirizzo</label>
            <input
              type="text"
              name="indirizzo"
              required
              onChange={handleChange}
            />

            <label>Email PEC</label>
            <input
              type="email"
              name="emailPec"
              className={errors.emailPec ? "error" : ""}
              required
              onChange={handleChange}
            />
            {errors.emailPec && <div className="error-message">{errors.emailPec}</div>}

            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={errors.password ? "error" : ""}
                required
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}

            <label>Conferma Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confermaPassword"
                className={errors.confermaPassword ? "error" : ""}
                required
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confermaPassword && (
              <div className="error-message">{errors.confermaPassword}</div>
            )}

            <button type="submit" className="register-button">
              Registrati
            </button>
          </form>
        </div>

        <div className="register-side">
          <h3>Hai già un account?</h3>
          <p>Accedi per gestire il tuo profilo e i tuoi servizi.</p>
          <Link to="/login" className="login-button">
            Accedi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
