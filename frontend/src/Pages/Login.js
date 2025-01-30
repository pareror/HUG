import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"; // Qui puoi inserire lo stile per il popup e il form
import axios from "axios";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import "../css/ErrorPopup.css";
const Login = () => {
  // Stati locali
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);  // Per memorizzare gli errori dal server
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Mostra/nasconde la password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // useEffect: se `error` è impostato, scompare dopo 3 secondi
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Gestore dell'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // reset di eventuali errori precedenti

    try {
      // Esempio di chiamata POST con axios
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      // Se la chiamata ha avuto successo (200 OK)
      if (response.status === 200) {
        // Otteniamo il token dalla risposta
        const data = response.data;
        setToken(data.token);
        console.log("Token ricevuto:", data.token);

        // Se vuoi, puoi salvare il token in localStorage
        localStorage.setItem("token", data.token);

        // Oppure effettuare un redirect
        navigate("/dashboard");
      }
    } catch (err) {
      // Se c'è un errore di risposta dal server:
      if (err.response) {
        // err.response.data contiene i dati di errore inviati dal server
        const { error: serverError } = err.response.data;
        // Altrimenti possiamo settare un messaggio generico
        setError(serverError || "Errore durante il login");
      } else {
        // Se l’errore è di rete o altro
        setError("Errore di rete: " + err.message);
      }
    }
  };

  return (
    <div className="login-container">
      {/* Popup di errore (solo se `error` è valorizzato) */}
      {error && (
        <div className="error-popup">
          {error}
        </div>
      )}

      <div className="login-content">
        {/* Sezione Sinistra - Form Login */}
        <div className="login-form">
          {/* Pulsante Torna Indietro */}
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

          {/* Mostra il token se presente */}
          {token && (
            <div style={{ color: "green", marginTop: "10px" }}>
              Login avvenuto con successo!<br />
              Token JWT: {token}
            </div>
          )}
        </div>

        {/* Sezione Destra - Registrazione */}
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
