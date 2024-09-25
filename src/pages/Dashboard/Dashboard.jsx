// Import des styles
import "./Dashboard.css";

// Import des composants
import Header from "../../components/Header/Header";
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Button from "../../components/Button/Button";

// Import de la fonction createMember
import { createMember } from "../../utils/axiosMember";

function Dashboard() {
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

            <form onSubmit={handleSubmit}>
                <div className="dashboard-field">
                    <section className="dashboard-presentation">
                        <h3>Ta présentation</h3>
                        <p>Les champs obligatoirement requis affichent des <span style={{ color: 'red' }}>*</span></p>

                        <label>Pseudo <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="pseudo" value={formData.pseudo} onChange={handleChange} required />

                        <label>Nom / Prénom</label>
                        <input type="text" name="nom" value={formData.nom} onChange={handleChange} />

                        <label>Image <span style={{ color: 'red' }}>*</span></label>
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
                        <h3>Liens avec logo</h3>
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
                                        value={formData.links[link]}  // modifié ici de 'liens_avec_logo' à 'links'
                                        onChange={handleLinkInputChange}
                                    />
                                )}
                            </div>
                        ))}
                    </section>

                    {/* Section pour le contenu */}
                    <section className="dashboard-content">
                        <h3>Contenu</h3>

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

                        {formData.content.map((content, index) => (
                            <div className="content-n" key={index}>
                                <h4>Contenu {index + 1}</h4>

                                <label>Titre</label>
                                <input
                                    type="text"
                                    name="title"  // modifié ici de 'titre' à 'title'
                                    value={content.title}  // modifié ici de 'titre' à 'title'
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
                    </section>

                    <Button texte="Créer ta carte de membre" type="submit"></Button>
                </div>
            </form>
        </>
    );
}

export default Dashboard;
