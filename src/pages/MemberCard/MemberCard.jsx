// Import des styles
import "./MemberCard.css"

// Import des besoins
import { useParams } from 'react-router-dom';

// Import des données
import DataMembers from '../../data/DataMembers';

function MemberCard() {
    const { id } = useParams();
    console.log("Member ID:", id); // Vérifiez si l'ID du membre est correctement récupéré

    // Recherche du membre dans DataMembers par son ID
    const member = DataMembers.find(member => member.id === id);

    // Vérifiez si le membre a été trouvé
    if (!member) {
        return <div>Le membre n'existe pas.</div>;
    }

    // Utilisation des données du membre pour le rendu
    const { image, name, pseudo, tags, description, content } = member;

    return (
        <div className="member-details">
            <div className="member-image">
                <img src={image} alt={name} />
            </div>
            <div className="member-info">
                <h2>{pseudo || name}</h2>
                <p>{tags.join(', ')}</p>
                <p>{description}</p>
                {content && (
                    <div className="content-links">
                        
                    </div>
                )}
            </div>
        </div>
    );
}

export default MemberCard;