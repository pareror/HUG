import React, { useState } from "react";
import "../css/ContactUs.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Messaggio inviato:", formData);
    alert("Messaggio inviato con successo!");
    setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        {/* Titolo */}
        <h2 className="section-title">Contattaci</h2>

        <div className="contact-content">
          {/* Sezione informazioni */}
          <div className="contact-info">
            <p>
              Siamo qui per rispondere a tutte le tue domande. Compila il modulo
              sottostante o utilizza uno dei nostri contatti diretti per metterti in comunicazione con noi.
            </p>
            <p>📞 +39 123 456 7890</p>
            <p>📧 info@hug.it</p>
            <p>📍 Via da qui 44, Foggia</p>
          </div>

          {/* Sezione modulo di contatto */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>Nome *</label>
            <input
              type="text"
              name="name"
              placeholder="Il tuo nome"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="nome@esempio.it"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Oggetto *</label>
            <input
              type="text"
              name="subject"
              placeholder="Oggetto del messaggio"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <label>Messaggio *</label>
            <textarea
              name="message"
              placeholder="Il tuo messaggio"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="contact-button">Invia Messaggio</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
