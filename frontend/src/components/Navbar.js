import React, { useState, useEffect } from "react";
import "../css/Navbar.css";

const Navbar = ({ items }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    useEffect(() => {
        // Chiudi il menu quando si clicca fuori o si ridimensiona la finestra
        const handleClickOutside = (event) => {
            if (!event.target.closest(".navbar")) {
                closeMenu();
            }
        };

        const handleResize = () => {
            if (window.innerWidth > 768) {
                closeMenu(); // Chiudi il menu se la finestra viene ingrandita
            }
        };

        document.addEventListener("click", handleClickOutside);
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            document.removeEventListener("click", handleClickOutside);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Funzione per lo scrolling fluido
    const handleScroll = (fragment) => {
        const element = document.querySelector(fragment);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            closeMenu(); // Chiude il menu dopo il click su mobile
        }
    };

    return (
        <nav className="navbar">
            <a href="/" className="navbar-logo">
                <img src="/images/logo.png" alt="Logo" className="logo" />
            </a>
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>
            <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
                {items.map((item, index) => (
                    <button key={index} className="nav-link" onClick={() => handleScroll(item.fragment)}>
                        {item.name}
                    </button>
                ))}
                <button className="navbar-button navbar-login">Accedi</button> {/* Assicurati che la classe sia corretta */}
            </div>
        </nav>
    );
};

export default Navbar;
