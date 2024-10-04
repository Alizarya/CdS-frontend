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

    const { image, name, pseudo, description, links, tags, content } = member;

    // Contenu par défaut à afficher
    const defaultContent = {
        link: "#",
        image: "https://img.freepik.com/vecteurs-libre/symboles-scientifiques-papier-blanc_1308-33294.jpg?t=st=1728028518~exp=1728032118~hmac=1e05cb89dae0afc72458195f4aee501a878f20206b6238bf75d295037e5279e2&w=740",
        title: "TITRE",
        description: "Voici la description rapide de ton contenu. Tu vas pouvour écrire quelques lignes pour présenter ton travail."
    };

    return (
        <main className="memberCard-details">
            <section className="memberCard-section">
                <div className="member-image">
                    <img 
                        src={image || 'https://img.freepik.com/vecteurs-libre/peint-main-chimistes-laboratoire_23-2147543521.jpg?t=st=1728028438~exp=1728032038~hmac=aa6d10d5d0084ff918efe802c3ebf875162ce3a79f707d143dce266cc38af750&w=740'} 
                        alt={name || 'Nom inconnu'} 
                    />
                    <div className="social-links">
                        {links && Object.keys(links).length > 0 ? (
                            Object.keys(links).map((socialLink, index) => (
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

                                return (
                                    <a
                                        key={index}
                                        href={isItemEmpty ? defaultContent.link : item.link || defaultContent.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img src={isItemEmpty ? defaultContent.image : item.image || defaultContent.image} alt={isItemEmpty ? defaultContent.title : item.title || defaultContent.title} />
                                        <h4>{isItemEmpty ? defaultContent.title : item.title || defaultContent.title}</h4>
                                        <p>{isItemEmpty ? defaultContent.description : item.description || 'Voici la description rapide de ton contenu. Tu vas pouvour écrire quelques lignes pour présenter ton travail.'}</p>
                                    </a>
                                );
                            })
                        ) : (
                            // Si content est vide, afficher les contenus par défaut
                            [...Array(3)].map((_, index) => (
                                <a
                                    key={index}
                                    href={defaultContent.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src={defaultContent.image} alt={defaultContent.title} />
                                    <h4>{defaultContent.title}</h4>
                                    <p>{defaultContent.description}</p>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default CardPrev;
