// Import des styles
import "./Error404.css"

// Import des composants
import Header from "../../components/Header/Header";
import { Link } from 'react-router-dom';

function Error404() {

    return (
        <>
            <Header/>

            <div className="error404-container">
                <h1>Erreur 404</h1>
                <h2>La page demandée est introuvable.</h2>
                <Link to="/"><i class="fa-solid fa-house"></i>Revenir à l'accueil</Link>
            </div>
        </>
    )
}

// Export de la fonction composant
export default Error404;