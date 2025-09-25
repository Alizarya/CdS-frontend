// Import des pages de style
import "./Header.css";
import "./HeaderResponsive.css";

// Import des composants
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

// Import des besoins
import logo from "./logo banniere café des sciences.jpg";

function Header() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const toggleMenu = () => setIsMenuOpen((o) => !o);
  const closeMenu = () => setIsMenuOpen(false);

  // Ferme le menu quand on change de page/hash
  useEffect(() => { closeMenu(); }, [location.pathname, location.hash]);

  // ESC pour fermer
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeMenu(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Empêche le scroll body quand le drawer est ouvert
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = isMenuOpen ? "hidden" : prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [isMenuOpen]);

  // État login depuis sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
    const onStorage = () => setIsLoggedIn(!!sessionStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Si on est déjà sur la landing ("/") et que le hash change → scroll smooth vers l'ancre
  useEffect(() => {
    const hash = location.hash?.slice(1);
    if (!hash) return;
    if (location.pathname !== "/") return;

    // attendre le prochain paint pour que la section existe
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.pathname, location.hash]);

  return (
    <header>
      <Link to="/" onClick={() => { scrollToTop(); closeMenu(); }}>
        <img className="logoNav" src={logo} alt="logo du café des sciences" />
      </Link>

      {/* Bouton hamburger (mobile/tablette) */}
      <button
        className="hamburger"
        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-controls="site-nav"
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
        type="button"
      >
        <i className="fa-solid fa-bars" />
      </button>

      {/* Overlay */}
      <div
        className={`nav-overlay ${isMenuOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      />

      {/* Nav : drawer en mobile/tablette, horizontale en desktop */}
      <nav id="site-nav" className={`nav-drawer ${isMenuOpen ? "open" : ""}`} role="navigation">
        {/* Croix pour fermer le drawer */}
        <button
          type="button"
          className="drawer-close"
          aria-label="Fermer le menu"
          onClick={closeMenu}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <Link to="/About" className="underline-link" onClick={closeMenu}>
          À Propos
        </Link>
        <Link to="/Members" className="underline-link" onClick={closeMenu}>
          Nos membres
        </Link>

        {!isLoggedIn && (
          <Link to="/JoinUs" className="underline-link" onClick={closeMenu}>
            Nous rejoindre
          </Link>
        )}

        {/* IMPORTANT : on laisse Link faire la navigation vers /#support et /#contact */}
        <Link to="/#support" className="underline-link" onClick={closeMenu}>
          Nous soutenir
        </Link>
        <Link to="/#contact" className="underline-link" onClick={closeMenu}>
          Nous contacter
        </Link>

        <hr />

        {isLoggedIn && (
          <Link to="/Dashboard" className="underline-link" onClick={closeMenu}>
            Tableau de bord
          </Link>
        )}

        {/* Zone connexion / déconnexion */}
        {isLoggedIn ? (
          <Link
            to="/"
            onClick={() => {
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("userId");
              setIsLoggedIn(false);
              closeMenu();
            }}
            aria-label="Se déconnecter"
            title="Se déconnecter"
          >
            <i className="fa-solid fa-right-from-bracket" id="icon"></i>
          </Link>
        ) : (
          <>
            {/* Icône visible en desktop uniquement (gérée par CSS) */}
            <Link
              to="/Login"
              onClick={closeMenu}
              className="login-icon"
              aria-label="Se connecter"
              title="Se connecter"
            >
              <i className="fa-solid fa-circle-user" id="icon"></i>
            </Link>

            {/* Texte visible en mobile/tablette uniquement (géré par CSS) */}
            <Link
              to="/Login"
              onClick={closeMenu}
              className="login-text"
              aria-label="Se connecter"
              title="Se connecter"
            >
              Se connecter
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
