// Import des styles
import "./Dashboard.css"

import { Link } from 'react-router-dom';

function Dashboard() {
    const token = localStorage.getItem('token');

    // Si le token est absent affiche un message d'erreur
    if (!token) {
        return (
            <div>
                <h1>Accès non autorisé</h1>
                <p>Veuillez vous <Link to="/login">connecter</Link> pour accéder au tableau de bord.</p>
            </div>
        );
    }

    // Si le token est présent, affiche le contenu du tableau de bord
    return (
        <div className="dashboard-container">
            <h1>Tableau de bord</h1>
            {/* Autres éléments du tableau de bord */}
        </div>
    );
}

export default Dashboard;
