import React, { useState } from 'react';
import '../css/Profilo.css';
import NavbarDashboard from '../Components/NavbarDashboard';
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Profilo = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ragioneSociale: 'Azienda S.p.A.',
        codiceSDI: 'ABC12345',
        email: 'info@azienda.com',
        telefono: '0123456789',
        comuneResidenza: 'Milano',
        username: 'utente123',
        password: 'passwordSegreta',
        partitaIVA: '12345678901',
        immagine: null
    });

    const handleSaveClick = (e) => {
        e.preventDefault();
        // Logica per salvare le modifiche, ad esempio invio al server
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, immagine: e.target.files[0] });
    };

    const handleEditClick = () => {
        // Logica per abilitare la modifica dei campi
    };

    return (
        <div className='profilo'>
            <NavbarDashboard />
            <div className='profilo-content'>
                <div className='profilo-header'>
         {/* Bottone per tornare indietro */}
          <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Torna indietro
          </button>
                </div>

                <div className="profilo-container">
                    <h2 className="profilo-title">Profilo Aziendale</h2>
                    <form className="profilo-form" onSubmit={handleSaveClick}>
                        <div className="profilo-form-group">
                            <label htmlFor="ragioneSociale">Ragione Sociale</label>
                            <input
                                type="text"
                                id="ragioneSociale"
                                name="ragioneSociale"
                                value={formData.ragioneSociale}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="profilo-form-group">
                            <label htmlFor="codiceSDI">Codice SDI</label>
                            <input
                                type="text"
                                id="codiceSDI"
                                name="codiceSDI"
                                value={formData.codiceSDI}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="profilo-form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="profilo-form-group">
                            <label htmlFor="telefono">Telefono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="profilo-form-group">
                            <label htmlFor="comuneResidenza">Comune di Residenza</label>
                            <input
                                type="text"
                                id="comuneResidenza"
                                name="comuneResidenza"
                                value={formData.comuneResidenza}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="profilo-form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="profilo-form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="profilo-form-group">
                            <label htmlFor="partitaIVA">Partita IVA</label>
                            <input
                                type="text"
                                id="partitaIVA"
                                name="partitaIVA"
                                value={formData.partitaIVA}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="profile-photo">
                            <label htmlFor="immagine">Foto</label>
                            <input
                                type="file"
                                id="immagine"
                                name="immagine"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="bottone">
                            <button type="button" onClick={handleEditClick} className="profile-edit-button">
                                Modifica
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profilo;
