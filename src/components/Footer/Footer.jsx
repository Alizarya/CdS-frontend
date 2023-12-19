import "./Footer.css"

// Import des composants
import { Link } from "react-router-dom";

// Création de la fonction composant du header
function Footer() {
  
    return (
        <footer>
            <p>
            <a href="https://alizaryana.com" target="_blank" rel="noopener noreferrer">
                &copy; {new Date().getFullYear()} alizaryana.com
            </a>
            </p>
            <p>Contenu propriété du Café des Sciences</p>
            <Link to="/rgpd">Politique de confidentialité (RGPD)</Link>
            <p>Éléments divers à ajouter</p>
        </footer>
    );
  }
  
  // Export de la fonction composant
  export default Footer;