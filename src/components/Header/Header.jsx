// Import des pages de style
import "./Header.css";
import "./HeaderResponsive.css";

// Import des composants
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';

// Import des besoins
import logo from "./logo banniere café des sciences.jpg";

// Création de la fonction composant du header
function Header() {

  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fonction pour faire défiler vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Fonction pour défiler vers une ancre spécifique
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

  // Vérifier si un token est présent dans le sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem('token');  // Utilisez la clé exacte pour le token
    setIsLoggedIn(!!token);  // Si un token est trouvé, on considère l'utilisateur comme connecté
  }, []);

  return (
    <header>
        <Link to="/" onClick={scrollToTop}>
            <img className="logoNav" src={logo} alt="logo du café des sciences" />
        </Link>
        
        <nav>
            <a href="/About" className="underline-link"> À Propos </a>
            <a href="/Members" className="underline-link"> Nos membres </a>
            
            {/* Afficher "Nous rejoindre" uniquement si l'utilisateur n'est pas connecté */}
            {!isLoggedIn && (
              <a href="/JoinUs" className="underline-link"> Nous rejoindre </a>
            )}

            <Link to="/#support" className="underline-link" onClick={() => scrollToAnchor('support')}> Nous soutenir </Link>
            <Link to="/#contact" className="underline-link" onClick={() => scrollToAnchor('contact')}> Nous contacter </Link>

            <hr />

            {/* Afficher "Tableau de bord" uniquement si l'utilisateur est connecté */}
            {isLoggedIn && (
              <Link to="/Dashboard" className="underline-link">Tableau de bord</Link>
            )}

            {/* Afficher l'icône selon si l'utilisateur est connecté ou non */}
            {isLoggedIn ? (
                <Link to="/" onClick={() => {
                  sessionStorage.removeItem('token');
                  sessionStorage.removeItem('userId');
                    setIsLoggedIn(false);  
                }}>
                    <i className="fa-solid fa-right-from-bracket" id="icon" title="Se déconnecter"></i>
                </Link>
            ) : (
                <Link to="/Login">
                    <i className="fa-solid fa-circle-user" id="icon" title="Se connecter"></i>
                </Link>
            )}
        </nav>
    </header>
  );
}

// Export de la fonction composant
export default Header;
