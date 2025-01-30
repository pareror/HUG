import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "../css/Login.css";
import { ArrowLeft, Eye, EyeOff } from "lucide-react"; // Icone

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Hook per la navigazione

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
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

          <form>
            <label>Email</label>
            <input type="email" placeholder="nome@esempio.it" required />

            <label>Password</label>
            <div className="password-input">
              <input type={showPassword ? "text" : "password"} required />
              <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <a href="#" className="forgot-password">Hai dimenticato la password?</a>

            <button type="submit" className="login-button">Accedi</button>
          </form>
        </div>

        {/* Sezione Destra - Registrazione */}
        <div className="login-side">
          <h3>Non possiedi un account?</h3>
          <p>Unisciti a noi per migliorare la qualità della vita degli anziani attraverso la tecnologia.</p>
          <button className="register-button">Registrati</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
