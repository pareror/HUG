import React, { useState } from "react";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <a href="#" className="navbar-logo">
                <img src="/images/logo.png" alt="Logo" className="logo" />
            </a>
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>
            <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
                <a href="#services">Servizi</a>
                <a href="#about">Chi siamo</a>
                <a href="#contact">Contatti</a>
                <button className="navbar-button">Accedi</button>
            </div>
        </nav>
    );
};

export default Navbar;
