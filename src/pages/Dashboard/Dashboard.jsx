// Import des styles
import "./Dashboard.css";

// Import des composants
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import de la fonction createMember
import { createMember } from "../../utils/axiosMember";

function Dashboard() {

    const navigate = useNavigate();

    // Vérifier si le token est présent dans le localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
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
                alert('Vous ne pouvez sélectionner que 3 liens.');
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

        // Vérification des liens dans 'links' pour s'assurer qu'ils commencent par "https://"
        const invalidLinks = Object.entries(formData.links).filter(
            ([key, value]) => value && !value.startsWith("https://")
        );

        if (invalidLinks.length > 0) {
            alert("Tous les liens doivent commencer par 'https://'. Veuillez corriger vos liens.");
            return;
        }

        // Vérification des liens dans 'content' pour s'assurer qu'ils commencent par "https://"
        const invalidContentLinks = formData.content.filter(
            (content) => content.link && !content.link.startsWith("https://")
        );

        if (invalidContentLinks.length > 0) {
            alert("Tous les liens de contenu doivent commencer par 'https://'. Veuillez corriger vos liens de contenu.");
            return;
        }

        const generatedUserId = Date.now();
        setFormData((prevState) => ({
            ...prevState,
            userId: generatedUserId,  
        }));

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('userId', generatedUserId);
            formDataToSend.append('email', "alizaryana@gmail.com"); 
            formDataToSend.append('pseudo', formData.pseudo);
            formDataToSend.append('nom', formData.nom);
            formDataToSend.append('image', formData.image);
            formDataToSend.append('tags', formData.tags);
            formDataToSend.append('shortdescription', formData.shortdescription);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('links', JSON.stringify(formData.links));  
            formDataToSend.append('content', JSON.stringify(formData.content));
            
            console.log("Données à envoyer:", Object.fromEntries(formDataToSend.entries()));
            
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
            <Header />
            <h1 className="banner">Tableau de bord</h1>

            <form className="dashboard" onSubmit={handleSubmit}>
                <div className="dashboard-field">
                    <section className="dashboard-presentation">
                        <h3>Ta présentation</h3>
                        <p>Les champs obligatoirement requis affichent des <span style={{ color: 'red' }}>*</span></p>

                        <label>Pseudo <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="pseudo" value={formData.pseudo} onChange={handleChange} required />

                        <label>Nom / Prénom</label>
                        <input type="text" name="nom" value={formData.nom} onChange={handleChange} />

                        <label>Image de profil <span style={{ color: 'red' }}>*</span></label>
                        <input 
                            type="text" 
                            name="image" 
                            placeholder="Entrez l'URL de l'image"
                            value={formData.image}
                            onChange={handleChange}
                            required 
                        />

                        <label>Tags <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="tags" value={formData.tags} onChange={handleChange} required />

                        <label>Description Courte <span style={{ color: 'red' }}>*</span></label>
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

                                    <label>Image</label>
                                    <input 
                                        type="text" 
                                        name="image" 
                                        placeholder="Entrez l'URL de l'image"
                                        value={content.image}
                                        onChange={(e) => handleContentChange(e, index)}
                                        required 
                                    />

                                    <label>Lien</label>
                                    <input
                                        type="text"
                                        name="link"  // modifié ici de 'lien' à 'link'
                                        value={content.link}  // modifié ici de 'lien' à 'link'
                                        onChange={(e) => handleContentChange(e, index)}
                                    />

                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={content.description}
                                        onChange={(e) => handleContentChange(e, index)}
                                    />
                                </div>
                        ))}
                        </div>
                    </section>
                    <Button texte="Créer ta carte de membre" type="submit"></Button>
            </form>
        </>
    );
}

export default Dashboard;
