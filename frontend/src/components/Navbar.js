import React, { useState, useEffect } from "react";
import { HashLink as Link } from "react-router-hash-link";
import "../css/Navbar.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".navbar")) {
                closeMenu();
            }
        };

        const handleResize = () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        };

        document.addEventListener("click", handleClickOutside);
        window.addEventListener("resize", handleResize);

        return () => {
            document.removeEventListener("click", handleClickOutside);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src="/images/logo.png" alt="Logo" className="logo" />
            </Link>
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>
            <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
                <Link smooth to="/#home" onClick={closeMenu}>Home</Link>
                <Link smooth to="/#services" onClick={closeMenu}>Servizi</Link>
                <Link smooth to="/#aboutus" onClick={closeMenu}>Chi Siamo</Link>
                <Link smooth to="/#contact" onClick={closeMenu}>Contatti</Link>
                <Link to="/login" className="navbar-button navbar-login">Accedi</Link> {/* Link al login */}
            </div>
        </nav>
    );
};

export default Navbar;
