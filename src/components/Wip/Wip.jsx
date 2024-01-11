// Import des styles
import "../../pages/Error404/Error404.css"

// Import des composants
import Header from "../../components/Header/Header";
import { Link } from 'react-router-dom';

function Wip() {

    return (
        <>
            <Header/>

            <div className="error404-container">
                <h1>En construction</h1>
                <h2>La page demandée n'est pas encore disponible.</h2>
                <Link to="/"><i class="fa-solid fa-house"></i>Revenir à l'accueil</Link>
            </div>
        </>
    )
}

// Export de la fonction composant
export default Wip;