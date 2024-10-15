// Import des styles
import "./Dashboard.css";

// Import des besoins
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import des datas
import { updateMember, getMembers } from "../../utils/axiosMembers";
import dataTags from '../../data/DataTags'; 

function UpdateData() {
    const navigate = useNavigate();

    // Vérifier si le token est présent dans le sessionStorage
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate("/404");  
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        userId: '',
        pseudo: '',
        nom: '',
        image: '', // URL de l'image
        tags: [],
        shortdescription: '',
        description: '',
        links: {
            website: '',
            blog: '',
            youtube: '',
            twitch: '',
            tiktok: '',
            twitter: '',
            bluesky: '',
            mastodon: '',
            facebook: '',
            instagram: '',
            threads: '',
            linkedin: '',
            podcast: '',
            financement: '',
        },
        content: [
            { image: '', link: '', title: '', description: '' },
            { image: '', link: '', title: '', description: '' },
            { image: '', link: '', title: '', description: '' },
        ],
        content_format: '', 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Ajout d'une nouvelle fonction pour gérer le changement de l'image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevState) => ({
                    ...prevState,
                    image: reader.result, // Met à jour l'URL de l'image
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const [selectedLinks, setSelectedLinks] = useState([]);
    const handleLinkCheckboxChange = (e) => {
        const { name, checked } = e.target;
    
        if (checked) {
            if (selectedLinks.length < 3) {
                setSelectedLinks([...selectedLinks, name]);
            } else {
                alert('Tu ne peux sélectionner que 3 liens maximum.');
                e.target.checked = false; // Restaure l'état de la case à cocher
            }
        } else {
            setSelectedLinks(selectedLinks.filter(link => link !== name));
            
            // Lorsque la case est décochée, définir la valeur du lien comme une chaîne vide
            setFormData((prevState) => ({
                ...prevState,
                links: {  
                    ...prevState.links,
                    [name]: "", // Réinitialise la valeur à une chaîne vide
                },
            }));
        }
    };
    
    const handleLinkInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            links: {  
                ...prevState.links,
                [name]: value,
            },
        }));
    };

    const handleContentChange = (e, index) => {
        const { name, value } = e.target;
        const updatedContent = [...formData.content];
        updatedContent[index][name] = value;

        setFormData((prevState) => ({
            ...prevState,
            content: updatedContent,
        }));
    };

    const handleTagChange = (tag) => {
        setFormData((prevState) => {
            const isSelected = prevState.tags.includes(tag);
            const newTags = isSelected
                ? prevState.tags.filter(t => t !== tag) // Désélectionner si déjà sélectionné
                : [...prevState.tags, tag]; // Ajouter le tag sélectionné
    
            // Limiter à 3 tags maximum
            if (newTags.length > 3) {
                alert('Tu ne peux sélectionner que 3 tags maximum.');
                return prevState; 
            }
    
            return { ...prevState, tags: newTags };
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Formulaire soumis");
        console.log("Données du formulaire:", formData);
    
        // Vérification des liens dans 'links' pour s'assurer qu'ils commencent par "https://"
        const modifiedLinks = { ...formData.links };
        Object.keys(modifiedLinks).forEach((key) => {
            if (modifiedLinks[key] && !modifiedLinks[key].startsWith("https://")) {
                modifiedLinks[key] = "https://" + modifiedLinks[key];
            }
        });
    
        // Vérification des liens dans 'content' pour s'assurer qu'ils commencent par "https://"
        const modifiedContent = formData.content.map((content) => {
            if (content.link && !content.link.startsWith("https://")) {
                return { ...content, link: "https://" + content.link };
            }
            return content;
        });
    
        // Récupérer l'userId et l'id du membre depuis le sessionStorage
        const userIdFromSession = sessionStorage.getItem('userId') || "";
        const memberId = memberData._id;
    
        console.log(userIdFromSession);
    
        // Créer un objet avec toutes les valeurs
        const formDataToSend = {
            userId: userIdFromSession,
            pseudo: formData.pseudo || "",
            nom: formData.nom || "",
            image: formData.image || "",
            tags: formData.tags,
            shortdescription: formData.shortdescription || "",
            description: formData.description || "",
            links: modifiedLinks,
            content: modifiedContent,
            content_format: formData.content_format, 
        };
    
        console.log("Données à envoyer:", formDataToSend);
    
        try {
            const response = await updateMember(memberId, formDataToSend);
            alert('Modifications bien enregistrées');
            console.log(response);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du membre', error);
            alert('Une erreur est survenue lors de la mise à jour du membre.');
        }
    };

    // Etat pour stocker les données du membre
    const [memberData, setMemberData] = useState(null); // État pour stocker les données du membre
    const [isLoading, setIsLoading] = useState(true); // État de chargement

    // Récupérez les données du membre lorsque le composant se monte
    useEffect(() => {
        const fetchMemberData = async () => {
            const userIdFromSession = sessionStorage.getItem('userId');
            if (userIdFromSession) {
                try {
                    const membersData = await getMembers();
                    const foundMember = membersData.find(member => member.userId === userIdFromSession);
    
                    if (foundMember) {
                        setMemberData(foundMember);
    
                        // Mettre à jour le formData avec les données du membre
                        setFormData((prevState) => ({
                            ...prevState,
                            userId: foundMember.userId || '',
                            pseudo: foundMember.pseudo || '',
                            nom: foundMember.nom || '',
                            image: foundMember.image || '',
                            tags: Array.isArray(foundMember.tags) ? foundMember.tags : (foundMember.tags ? foundMember.tags.split(',') : []),
                            shortdescription: foundMember.shortdescription || '',
                            description: foundMember.description || '',
                            links: foundMember.links || {},
                            content: foundMember.content || [
                                { image: '', link: '', title: '', description: '' },
                                { image: '', link: '', title: '', description: '' },
                                { image: '', link: '', title: '', description: '' },
                            ],
                            content_format: foundMember.content_format || '', // Récupérer content_format de la base de données
                        }));
    
                        // Initialiser selectedLinks avec les clés de links qui ne sont pas vides
                        const initialSelectedLinks = Object.keys(foundMember.links).filter(link => foundMember.links[link] !== "");
                        setSelectedLinks(initialSelectedLinks);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des membres:", error);
                } finally {
                    setIsLoading(false); // Fin du chargement
                }
            } else {
                setIsLoading(false); // Pas d'userId, fin du chargement
            }
        };
    
        fetchMemberData();
    }, []);
   
    if (isLoading) {
        return <p>Chargement des données du membre...</p>; // Affichage d'un message de chargement
    }
    
    return (
        <>
            <div className="dashboard-header">
                <h2>Mise à jour de ta carte de membre</h2>
                <p>C’est l’occasion parfaite pour montrer qui tu es, ce que tu apportes à la communauté et ta passion pour la vulga scientifique. </p>
                <p>Pas de panique, tu peux enregistrer tes données à tout moment et y revenir plus tard pour les modifier. </p>
                <p>Le bouton "enregistrer" se trouve maintenant dans ta barre de navigation. </p>
            </div>
            
            <div className="dashboard-main">
                <form className="dashboard" onSubmit={handleSubmit}>
                    <button className="button-cta button-fixed seventy" type="submit">Enregistrer tes mises à jour</button>

                    <section className="dashboard-presentation">
                        <h3>Ta présentation</h3>
                        <label>Pseudo </label>
                        <input type="text" name="pseudo" value={formData.pseudo} onChange={handleChange} />

                        <label>Nom / Prénom (facultatif)</label>
                        <input type="text" name="nom" value={formData.nom} onChange={handleChange} />

                        <label>Image de profil </label>
                        {/* Remplacement de l'input de texte par un input file */}
                        <input 
                            type="file" 
                            accept="image/*" // Limiter les fichiers aux images
                            onChange={handleImageChange} // Gestionnaire de changement
                        />
                        {/* Afficher l'aperçu de l'image */}
                        {formData.image && <img src={formData.image} alt="Aperçu" style={{ width: '100px', height: '100px' }} />}

                        <label>Description Courte </label>
                        <p>{120 - formData.shortdescription.length} caractères restants</p>
                        <textarea 
                            name="shortdescription" 
                            value={formData.shortdescription} 
                            onChange={handleChange} 
                            maxLength={120} 
                        />

                        <label>Description Longue</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} />
                    </section>

                    {/* Section pour les liens avec logos */}
                    <section className="dashboard-links">
                        <h3>Tes liens</h3>
                        <p>Tu peux inserer jusqu'à trois liens.</p>
                        {Object.keys(formData.links).map((link) => (
                            <div key={link}>
                                <input 
                                    type="checkbox" 
                                    name={link} 
                                    checked={selectedLinks.includes(link)} 
                                    onChange={handleLinkCheckboxChange} 
                                />
                                <label>{link.charAt(0).toUpperCase() + link.slice(1)}</label>

                                {selectedLinks.includes(link) && (
                                    <input
                                        type="text"
                                        name={link}
                                        placeholder={`Lien pour ${link}`}
                                        value={formData.links[link]}  
                                        onChange={handleLinkInputChange}
                                    />
                                )}
                            </div>
                        ))}
                    </section>
                    
                    {/* Section pour les tags */}
                    <section className="dashboard-tags">
                        <h3>Tags </h3>
                        <p>Tu peux selectionner jusqu'à trois tags.</p>
                        {dataTags.map((tag, index) => (
                            <div key={index}>
                                <input 
                                    type="checkbox" 
                                    name={tag} 
                                    checked={formData.tags.includes(tag)} 
                                    onChange={() => handleTagChange(tag)} 
                                />
                                <label>{tag}</label>
                            </div>
                        ))}
                    </section>

                    {/* Section pour le contenu */}
                    <section className="dashboard-content">
                        <h3>Ton contenu</h3>
                        <p>Quel format pour tes miniatures ?</p>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="content_format"
                                    value="portrait"
                                    checked={formData.content_format === 'portrait'}
                                    onChange={handleChange}
                                />
                                Portrait
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="content_format"
                                    value="paysage"
                                    checked={formData.content_format === 'paysage'}
                                    onChange={handleChange}
                                />
                                Paysage
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="content_format"
                                    value="carré"
                                    checked={formData.content_format === 'carré'}
                                    onChange={handleChange}
                                />
                                Carré
                            </label>
                        </div>

                        <div className="dashboard-content-row">
                            {formData.content.map((content, index) => (
                                <div className="content-n" key={index}>
                                    <h4>Contenu {index + 1}</h4>

                                    <label>Titre</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={content.title}
                                        onChange={(e) => handleContentChange(e, index)}
                                    />

                                    <label>Lien</label>
                                    <input
                                        type="text"
                                        name="link"
                                        value={content.link}
                                        onChange={(e) => handleContentChange(e, index)}
                                    />

                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={content.description}
                                        onChange={(e) => handleContentChange(e, index)}
                                    />

                                    <label>Image</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={content.image}
                                        onChange={(e) => handleContentChange(e, index)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </form>
            </div>
        </>
    );
}

export default UpdateData;