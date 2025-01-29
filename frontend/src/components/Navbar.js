import React, { useState, useEffect } from "react";
import "../css/Navbar.css";

const Navbar = (props) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const {items} = props
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

    return (
        <nav className="navbar">
            <a href="#" className="navbar-logo">
                <img src="/images/logo.png" alt="Logo" className="logo" />
            </a>
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>
            <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
            {items.map(item => (
                <a href={item.fragment}>{item.name}</a>
            ))}
                <button className="navbar-button">Accedi</button>
            </div>
        </nav>
    );
};

export default Navbar;
