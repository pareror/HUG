import React from "react";
import "../css/Footer.css";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react"; // Importa le icone

const Footer = () => {
  const handleScroll = (fragment) => {
    const element = document.querySelector(fragment);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Sezione Social */}
        <div className="footer-section">
          <h3>Seguici</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={24} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={24} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter size={24} /></a>
            <a href="mailto:info@hug.it"><Mail size={24} /></a>
          </div>
        </div>

        {/* Sezione Collegamenti Rapidi */}
        <div className="footer-section">
          <h3>Collegamenti Rapidi</h3>
          <ul>
            <li><button onClick={() => handleScroll("#home")}>Home</button></li>
            <li><button onClick={() => handleScroll("#services")}>Servizi</button></li>
            <li><button onClick={() => handleScroll("#aboutus")}>Chi Siamo</button></li>
            <li><button onClick={() => handleScroll("#contact")}>Contattaci</button></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© 2024 H.U.G. | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
