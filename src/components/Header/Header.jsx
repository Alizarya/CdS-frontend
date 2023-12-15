// Import des pages de style
import "./Header.css";

// Import des composants
import { Link } from "react-router-dom";

// Création de la fonction composant du header
function Header() {
  return (
    <header>
        <img src="./images\Landing\logo banniere café des sciences.jpg" alt="logo du café des sciences"/>
        <div className="extendNav">
            <nav>
                <Link to="/About"> A Propos </Link>
                <Link to="/Members"> Nos membres </Link>
                <Link to="/Support"> Nous soutenir </Link>
                <Link to="/Contact"> Nous contacter </Link>
            </nav>
            <hr></hr>
            <i className="fa-solid fa-circle-user" id="icon" title="Se connecter"></i>
        </div>
    </header>
  );
}

// Export de la fonction composant
export default Header;