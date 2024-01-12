// Import des pages de style
import "./Header.css";

// Import des composants
import { Link, useLocation } from "react-router-dom";
import React, { useEffect } from 'react';

// Import des besoins
import logo from "./logo banniere café des sciences.jpg"

// Création de la fonction composant du header
function Header() {

  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToAnchor = (anchorName) => {
    const anchorElement = document.getElementById(anchorName);
    if (anchorElement) {
      anchorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Vérifier si une ancre est présente dans l'URL au chargement de la page
    const hash = location.hash.substring(1);
    if (hash) {
      scrollToAnchor(hash);
    }
  }, [location.hash]);

  return (
    <header>
        <Link to="/" onClick={scrollToTop}> <img className="logoNav" src={logo} alt="logo du café des sciences"/></Link>
        <div className="extendNav">
            <nav>
                <Link to="/About"> A Propos </Link>
                <Link to="/Members"> Nos membres </Link>
                <Link to="/JoinUs"> Nous rejoindre </Link>
                <Link to="/#support" onClick={() => scrollToAnchor('support')}> Nous soutenir </Link>
                <Link to="/#contact" onClick={() => scrollToAnchor('contact')}> Nous contacter </Link>

            </nav>
            <hr></hr>
            <Link to="/Login"> <i className="fa-solid fa-circle-user" id="icon" title="Se connecter"></i> </Link>
            
        </div>
    </header>
  );
}

// Export de la fonction composant
export default Header;