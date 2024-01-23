import "./Footer.css"

// Création de la fonction composant du footer
function Footer() {

    // Mettre l'année à jour automatiquement
    const currentYear = new Date().getFullYear();
  
    return (
        <footer>
            <p>&copy; {currentYear} Café des Sciences. Tous droits réservés.</p>
            <p>
                <a href="https://alizaryana.com" target="_blank" rel="noopener noreferrer">Site créé et réalisé par Alizaryana </a>
            </p>
            <p><a href="/Legal">Mentions légales</a></p>
            <p><a href="/Regulations">Statuts et règlement intérieur</a></p>
        </footer>
    );
}

// Export de la fonction composant
export default Footer;