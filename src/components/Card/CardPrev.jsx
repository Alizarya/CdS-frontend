// Import des styles
import "./Card.css";

import React from 'react';
import Tags from "../../components/Tags/Tags"; // Importez Tags si nécessaire
import DataSocialsLogo from '../../data/DataSocialsLogo'; // Importez les logos des réseaux sociaux si nécessaire

const CardPrev = ({ member }) => {
    // Vérification pour éviter d'accéder à des propriétés d'un objet non défini
    if (!member) {
        return <p>Aucun membre trouvé.</p>; // Message d'erreur ou retour null
    }

    const { image, name, pseudo, description, links, tags, content, content_format } = member;

    // Contenu par défaut à afficher
    const defaultContent = {
        link: "#",
        image: "https://img.freepik.com/vecteurs-libre/aucun-concept-donnees-dessine-main_52683-127823.jpg?t=st=1728895983~exp=1728899583~hmac=d75ee8ef3a344a317df4e25c358b3fcfe4410fb3a52a58141c838a160f1ff04f&w=826",
        title: "TITRE",
        description: "Voici la description rapide de ton contenu. Tu vas pouvoir écrire quelques lignes pour présenter ton travail."
    };

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
                    <img 
                        src={image || 'https://img.freepik.com/vecteurs-libre/aucune-illustration-concept-donnees_114360-2506.jpg?t=st=1728895997~exp=1728899597~hmac=5fbf097feef816adab0ec43d12d218ebe44fbe0e7b3a60c328c7bed612945f91&w=900'} 
                        alt={name || 'Nom inconnu'} 
                    />
                    <div className="social-links">
                        {links && Object.keys(links).length > 0 ? (
                            Object.keys(links)
                                .filter((socialLink) => links[socialLink] && links[socialLink].trim() !== "")
                                .map((socialLink, index) => (
                                    <a
                                        key={index}
                                        href={links[socialLink]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className={`fa ${DataSocialsLogo[socialLink]}`}></i>
                                        {socialLink.charAt(0).toUpperCase() + socialLink.slice(1)}
                                    </a>
                                ))
                        ) : (
                            <p>Aucun lien enregistré.</p>
                        )}
                    </div>

                    <Tags memberId={member._id} tags={tags} />
                </div>
                <div className="member-info">
                    {pseudo ? (
                        <>
                            <h2>{pseudo}</h2>
                            <h3>{name || 'TON NOM'}</h3>
                        </>
                    ) : (
                        <>
                            <h2>{name || 'TON NOM'}</h2>
                            <h3>{pseudo || 'TON PSEUDO'}</h3>
                        </>
                    )}

                    <p>{description || 'Description non fournie. Mais le Lorem Ipsum est notre ami ! "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "'}</p>

                    <div className="content-links">
                        {/* Affichage des contenus, vérifiant si les champs sont vides */}
                        {content && Array.isArray(content) && content.length > 0 ? (
                            content.map((item, index) => {
                                // Vérifiez si tous les champs sont vides
                                const isItemEmpty = !item.link && !item.image && !item.title;
                                const imageSize = getImageSize(item.content_format || content_format); // Utilise le format de contenu de l'item ou celui du membre

                                return (
                                    <a
                                        key={index}
                                        href={isItemEmpty ? defaultContent.link : item.link || defaultContent.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={isItemEmpty ? defaultContent.image : item.image || defaultContent.image}
                                            alt={isItemEmpty ? defaultContent.title : item.title || defaultContent.title}
                                            style={{ width: imageSize.width, height: imageSize.height }} // Applique les dimensions
                                        />
                                        <h4>{isItemEmpty ? defaultContent.title : item.title || defaultContent.title}</h4>
                                        <p>{isItemEmpty ? defaultContent.description : item.description || 'Voici la description rapide de ton contenu. Tu vas pouvour écrire quelques lignes pour présenter ton travail.'}</p>
                                    </a>
                                );
                            })
                        ) : (
                            // Si content est vide, afficher les contenus par défaut
                            [...Array(3)].map((_, index) => {
                                const imageSize = getImageSize(content_format); // Utilise le format de contenu du membre
                                return (
                                    <a
                                        key={index}
                                        href={defaultContent.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img src={defaultContent.image} alt={defaultContent.title} style={{ width: imageSize.width, height: imageSize.height }} />
                                        <h4>{defaultContent.title}</h4>
                                        <p>{defaultContent.description}</p>
                                    </a>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default CardPrev;
