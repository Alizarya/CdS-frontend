// Import des styles
import "./Dashboard.css";

// Import des composants
import Button from "../../components/Button/Button";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import de la fonction createMember
import { createMember } from "../../utils/axiosMember";

function AddData() {
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
        image: '', 
        tags: '',
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
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const [selectedLinks, setSelectedLinks] = useState([]);
    const handleLinkCheckboxChange = (e) => {
        const { name, checked } = e.target;

        if (checked) {
            if (selectedLinks.length < 3) {
                setSelectedLinks([...selectedLinks, name]);
            } else {
                alert('Tu ne peux sélectionner que 3 liens maximum.');
                e.target.checked = false;
            }
        } else {
            setSelectedLinks(selectedLinks.filter(link => link !== name));
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

    const handleSubmit = async (e) => {  
        e.preventDefault();
        console.log("Formulaire soumis"); // Vérifie si la fonction est appelée
        console.log("Données du formulaire:", formData); // Vérifie l'état des données
    
        alert("Formulaire soumis"); 
    
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
    
        // Récupérer l'userId depuis le sessionStorage
        const userIdFromSession = sessionStorage.getItem('userId') || "";
        console.log(userIdFromSession);
        
    
        // Créer un objet avec toutes les valeurs
        const formDataToSend = {
            userId: userIdFromSession,
            pseudo: formData.pseudo || "",
            nom: formData.nom || "",
            image: formData.image || "",
            tags: formData.tags || "",
            shortdescription: formData.shortdescription || "",
            description: formData.description || "",
            links: modifiedLinks,
            content: modifiedContent,
        };
    
        console.log("Données à envoyer:", formDataToSend);
    
        try {
            const response = await createMember(formDataToSend);  
            alert('Membre créé avec succès');
            console.log(response);
        } catch (error) {
            console.error('Erreur lors de la création du membre', error);
            alert('Une erreur est survenue lors de la création du membre.');
        }
    };
    


    return (
        <>
            <h2>Crée ta carte de membre</h2>
            <p>C’est l’occasion parfaite pour montrer qui tu es et ce que tu apportes à la communauté. Pas de panique, tu peux enregistrer tes données à tout moment et y revenir plus tard pour les modifier. Profite de cette chance pour partager ta passion de la vulga !</p>
            
            <form className="dashboard" onSubmit={handleSubmit}>
                <div className="dashboard-field">
                    <section className="dashboard-presentation">
                        <h3>Ta présentation</h3>
                        <label>Pseudo </label>
                        <input type="text" name="pseudo" value={formData.pseudo} onChange={handleChange} required />

                        <label>Nom / Prénom</label>
                        <input type="text" name="nom" value={formData.nom} onChange={handleChange} />

                        <label>Image de profil </label>
                        <input 
                            type="text" 
                            name="image" 
                            placeholder="Entrez l'URL de l'image"
                            value={formData.image}
                            onChange={handleChange}
                            required 
                        />

                        <label>Tags </label>
                        <input type="text" name="tags" value={formData.tags} onChange={handleChange} required />

                        <label>Description Courte </label>
                        <p>{120 - formData.shortdescription.length} caractères restants</p>
                        <textarea 
                            name="shortdescription" 
                            value={formData.shortdescription} 
                            onChange={handleChange} 
                            maxLength={120} 
                            required 
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
                </div>

                {/* Section pour le contenu */}
                <section className="dashboard-content">
                    <h3>Ton contenu</h3>

                    <p>Quel format pour tes miniatures ?</p>
                    <div>
                        <label>
                            <input 
                            type="radio" 
                            name="format" 
                            value="portrait" 
                            checked={formData.format === 'portrait'}
                            onChange={handleChange}
                            />
                            Portrait
                        </label>

                        <label>
                            <input 
                            type="radio" 
                            name="format" 
                            value="paysage" 
                            checked={formData.format === 'paysage'}
                            onChange={handleChange}
                            />
                            Paysage
                        </label>

                        <label>
                            <input 
                            type="radio" 
                            name="format" 
                            value="carré" 
                            checked={formData.format === 'carré'}
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

                <button type="submit"> Enregistrer </button>

            </form>
        </>
    );
}

export default AddData;
