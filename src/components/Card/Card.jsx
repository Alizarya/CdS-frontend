// Import des styles
import "./Card.css"

// Import des besoins
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Importer useEffect et useState
import { getMembers } from '../../utils/axiosMembers'; // Importer la fonction pour récupérer les membres

// Import des composants
import Tags from "../../components/Tags/Tags"
import Error404 from "../../pages/Error404/Error404"
import Button from "../../components/Button/Button"

// Import des données
import DataSocialsLogo from '../../data/DataSocialsLogo';

function Card() {
    const { id } = useParams(); // Récupérer l'ID du membre à partir de l'URL
    const [member, setMember] = useState(null); // État pour stocker le membre

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const membersData = await getMembers(); // Récupérer tous les membres
                const foundMember = membersData.find(member => member._id === id); // Chercher le membre par ID
                setMember(foundMember); // Mettre à jour l'état avec le membre trouvé
            } catch (error) {
                console.error("Erreur lors de la récupération des membres:", error);
            }
        };

        fetchMember();
    }, [id]); // L'effet dépend de l'ID

    // Si l'ID du membre n'existe pas ou plus
    if (!member) {
        return <Error404 />;
    }

    const { image, name, pseudo, tags, description, content, links } = member;

    return (
        <main className="memberCard-details">
            <section className="memberCard-section">
                <div className="member-image">
                    <img src={image} alt={name} />
                    <div className="social-links">
                        {/* Affichage des liens sociaux avec leurs icônes et noms associés */}
                        {Object.keys(links).map((socialLink, index) => (
                            <a
                                key={index}
                                href={links[socialLink]}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {/* Utilisation des classes d'icônes Font Awesome */}
                                <i className={`fa ${DataSocialsLogo[socialLink]}`}></i>
                                {/* Affichage du nom du réseau social */}
                                {socialLink.charAt(0).toUpperCase() + socialLink.slice(1)}
                            </a>
                        ))}
                    </div>
                    <Tags memberId={member._id} tags={tags} /> {/* Passer les tags si nécessaire */}
                </div>
                <div className="member-info">
                    {pseudo ? (
                        <>
                            <h2>{pseudo}</h2>
                            <h3>{name}</h3>
                        </>
                    ) : (
                        <h2>{name}</h2>
                    )}
                    
                    <p>{description}</p>
                    {content && (
                        <div className="content-links">
                            {Object.values(content).map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src={item.image} alt={item.title} />
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Button texte="Découvrir les autres membres" to="/Members" />
        </main>
    );
}

export default Card;
