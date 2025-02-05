import React, { useState } from "react";
import "../css/Impostazioni.css";


const Impostazione = ({ titolo, descrizione, bottoneText, bottoneClass, isToggle, onClick }) => {

    const [toggle, setToggle] = useState(false);

    return (
        <div className="impostazione-item">
            <div className="impostazione-header">
                <div className="impostazione-title-container">
                    <h3 className="impostazione-title">{titolo}</h3>
                </div>
            </div>

            {/* Descrizione della notifica */}
            <p className="impostazione-description">{descrizione}</p>

            {/* Se è un toggle button, mostriamo un interruttore invece di un normale bottone */}
            {isToggle ? (
                            <label className="toggle-switch">
                                <input type="checkbox" checked={toggle} onChange={() => { setToggle(!toggle); onClick(toggle); }} />
                                <span className="slider round"></span>
                            </label>
                        ) : (
                            <button className={`impostazione-button ${bottoneClass}`} onClick={onClick}>
                                {bottoneText}
                            </button>
                        )}

            {/* Linea di separazione */}
            <hr className="impostazione-divider" />
        </div>
    );
};

export default Impostazione;
