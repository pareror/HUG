import React, { useState } from "react";
import "../../css/Pazienti/ImpostazioniPazienti.css";


const ImpostazionePazienti = ({ titolo, descrizione, bottoneText, bottoneClass, isToggle, onClick }) => {

    const [toggle, setToggle] = useState(false);

    return (
        <div className="pazienti-impostazione-item">
            <div className="pazienti-impostazione-header">
                <div className="pazienti-impostazione-title-container">
                    <h3 className="pazienti-impostazione-title">{titolo}</h3>
                </div>
            </div>

            {/* Descrizione della notifica */}
            <p className="pazienti-impostazione-description">{descrizione}</p>

            {/* Se è un toggle button, mostriamo un interruttore invece di un normale bottone */}
            {isToggle ? (
                            <label className="pazienti-toggle-switch">
                                <input type="checkbox" checked={toggle} onChange={() => { setToggle(!toggle); onClick(toggle); }} />
                                <span className="pazienti-slider pazienti-round"></span>
                            </label>
                        ) : (
                            <button className={`pazienti-impostazione-button ${bottoneClass}`} onClick={onClick}>
                                {bottoneText}
                            </button>
                        )}

            {/* Linea di separazione */}
            <hr className="pazienti-impostazione-divider" />
        </div>
    );
};

export default ImpostazionePazienti;
