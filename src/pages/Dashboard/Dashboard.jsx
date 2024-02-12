// Import des styles
import "./Dashboard.css"

import Header from "../../components/Header/Header"
import { Link } from 'react-router-dom';

function Dashboard() {
    const token = localStorage.getItem('token');

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        // Efface le token du local storage
        localStorage.removeItem('token');
        // Redirige vers la page de connexion
        window.location.href = '/login';
    };

    // Si le token est absent, affiche un message d'erreur
    // if (!token) {
    //     return (
    //         <div>
    //             <h1>Accès non autorisé</h1>
    //             <p>Veuillez vous <Link to="/login">connecter</Link> pour accéder au tableau de bord.</p>
    //         </div>
    //     );
    // }

    // Si le token est présent, affiche le contenu du tableau de bord
    return (
        <>
            <Header/>
            <div className="dashboard-container">
                <h1 className="banner">Tableau de bord</h1>
                {/* Autres éléments du tableau de bord */}
                <button onClick={handleLogout}>Se déconnecter</button>
            </div>
        </>
    );
}

export default Dashboard;
