import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import "../css/Login.css";
import "../css/ErrorPopup.css"; // Stesso file CSS per gestire i popup
import "../css/SuccessPopup.css"; // Stesso file CSS per gestire i popup
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Error & success states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Token facoltativo
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  // Mostra/nasconde la password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Quando arriva un errore, lo facciamo sparire dopo 3 secondi
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Quando `success` è true, dopo 3 secondi si va a /dashboard
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { username, password },
        { withCredentials: true } // 🔹 IMPORTANTE: Permette di ricevere cookie
      );
  
      console.log("Token ricevuto:", response.data)
      if (response.status === 200) {
        const data = response.data;
        setToken(data.token);
        // (opzionale) Salva il token
        localStorage.setItem("jwt", data.token);

        // Mostra il popup di successo
        setSuccess(true);
      }
    } catch (err) {
      if (err.response) {
        const { error: serverError } = err.response.data;
        setError(serverError || "Errore durante il login");
      } else {
        setError("Errore di rete: " + err.message);
      }
    }
  };

  return (
    <div className="login-container">
      {/* Popup di errore (rosso) con la barra di countdown */}
      {error && (
        <div className="error-popup">
          <div className="error-text">{error}</div>
          <div className="error-bar"></div>
        </div>
      )}

      {/* Popup di successo (verde) con la barra di countdown */}
      {success && (
        <div className="success-popup">
          <div className="success-text">Login effettuato con successo!</div>
          <div className="success-bar"></div>
        </div>
      )}

      <div className="login-content">
        <div className="login-form">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Torna indietro
          </button>

          <h2>Accedi</h2>
          <p>Inserisci le tue credenziali per accedere</p>

          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Il tuo username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <a href="#" className="forgot-password">
              Hai dimenticato la password?
            </a>

            <button type="submit" className="login-button">
              Accedi
            </button>
          </form>

        </div>

        <div className="login-side">
          <h3>Non possiedi un account?</h3>
          <p>
            Unisciti a noi per migliorare la qualità della vita degli anziani
            attraverso la tecnologia.
          </p>
          <button className="register-button">Registrati</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
