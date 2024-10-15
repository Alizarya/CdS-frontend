// Import des styles
import "./Card.css"

// Import des besoins
import {useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'; 
import { getMembers } from '../../utils/axiosMembers'; 

// Import des composants
import Tags from "../../components/Tags/Tags"
import Button from "../../components/Button/Button"
import Error404 from "../../pages/Error404/Error404"

// Import des données
import DataSocialsLogo from '../../data/DataSocialsLogo';

function Card() {
    const { id } = useParams();  
    const { state } = useLocation(); 
    const [member, setMember] = useState(state?.memberData || null);  
    const [isLoading, setIsLoading] = useState(!member);  

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
        return <Error404/>
    }

    const { image, name, pseudo, tags, description, content, links, content_format } = member;

    // Fonction pour déterminer les dimensions de l'image selon le format
    const getImageSize = (format) => {
        switch (format) {
            case 'paysage':
                return { width: '250px', height: '150px' };
            case 'carré':
                return { width: '250px', height: '250px' };
            case 'portrait':
                return { width: '250px', height: '350px' };
            default:
                return { width: '250px', height: '150px' }; // Valeurs par défaut
        }
    };

    return (
        <main className="memberCard-details">
            <section className="memberCard-section">
                <div className="member-image">
                    <img src={image} alt={name} />
                    <div className="social-links">
                        {Object.entries(links)
                            .filter(([key, value]) => value) // Filtrer les liens vides
                            .map(([socialLink, url], index) => (
                                <a
                                    key={index}
                                    href={url}
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
                            {Object.values(content).map((item, index) => {
                                const imageSize = getImageSize(item.content_format || content_format); // Utilise le format de contenu de l'item ou celui du membre
                                return (
                                    <a
                                        key={index}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img 
                                            src={item.image} 
                                            alt={item.title} 
                                            style={{ width: imageSize.width, height: imageSize.height }} // Applique les dimensions
                                        />
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
            <Button texte="Découvrir les autres membres" to="/Members" />
        </main>
    );
}

export default Card;
