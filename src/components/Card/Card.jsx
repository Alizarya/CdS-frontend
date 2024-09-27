// Import des styles
import "./Card.css"

// Import des besoins
import {useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Importer useEffect et useState
import { getMembers } from '../../utils/axiosMembers'; // Importer la fonction pour récupérer les membres

// Import des composants
import Tags from "../../components/Tags/Tags"
import Button from "../../components/Button/Button"

// Import des données
import DataSocialsLogo from '../../data/DataSocialsLogo';

function Card() {
    const { id } = useParams();  // Toujours utile en cas de fallback
    const { state } = useLocation();  // Utiliser useLocation pour récupérer les données passées
    const [member, setMember] = useState(state?.memberData || null);  // Si state existe, on l'utilise directement
    const [isLoading, setIsLoading] = useState(!member);  // On ne charge que si `member` est null

    useEffect(() => {
        if (!member) {
            const fetchMember = async () => {
                try {
                    const membersData = await getMembers(); 
                    const foundMember = membersData.find(member => member._id === id);
                    setMember(foundMember);
                } catch (error) {
                    console.error("Erreur lors de la récupération des membres:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchMember();
        } else {
            setIsLoading(false); // Si on a déjà le membre, pas besoin de charger
        }
    }, [id, member]);

    if (isLoading) {
        return <p>Chargement...</p>;
    }

    if (!member) {
        return <p>Membre non trouvé.</p>;
    }

    const { image, name, pseudo, tags, description, content, links } = member;

    return (
        <main className="memberCard-details">
            <section className="memberCard-section">
                <div className="member-image">
                    <img src={image} alt={name} />
                    <div className="social-links">
                        {Object.keys(links).map((socialLink, index) => (
                            <a
                                key={index}
                                href={links[socialLink]}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className={`fa ${DataSocialsLogo[socialLink]}`}></i>
                                {socialLink.charAt(0).toUpperCase() + socialLink.slice(1)}
                            </a>
                        ))}
                    </div>
                    <Tags memberId={member._id} tags={tags} />
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