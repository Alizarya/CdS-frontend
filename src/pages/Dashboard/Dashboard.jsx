// Import des styles
import "./Dashboard.css"

import Header from "../../components/Header/Header"
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [formData, setFormData] = useState({
      userId: '',
      email: '',
      pseudo: '',
      nom: '',
      prénom: '',
      image: '',
      tags: '',
      description_courte: '',
      description_longue: '',
      liens_avec_logo: {
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
      contenu: [
        { image: '', lien: '', titre: '', description: '' },
        { image: '', lien: '', titre: '', description: '' },
        { image: '', lien: '', titre: '', description: '' },
    ],
    });

   
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };


    // Gestion des liens 
    const [selectedLinks, setSelectedLinks] = useState([]);

    const handleLinkCheckboxChange = (e) => {
        const { name, checked } = e.target;

        if (checked) {
            // Limiter à 3 sélections
            if (selectedLinks.length < 3) {
                setSelectedLinks([...selectedLinks, name]);
            } else {
                alert('Vous ne pouvez sélectionner que 3 liens.');
                e.target.checked = false;
            }
        } else {
            // Supprimer la sélection
            setSelectedLinks(selectedLinks.filter(link => link !== name));
        }
    };

    const linksWithLogos = [
        "website", "blog", "youtube", "twitch", "tiktok", "twitter", "bluesky", 
        "mastodon", "facebook", "instagram", "threads", "linkedin", "podcast", 
        "financement"
    ];

    const handleLinkInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            liens_avec_logo: {
                ...prevState.liens_avec_logo,
                [name]: value,
            },
        }));
    };

    const handleContentChange = (e, index) => {
        const { name, value } = e.target;
        const updatedContent = [...formData.contenu];
        updatedContent[index][name] = value;

        setFormData((prevState) => ({
            ...prevState,
            contenu: updatedContent,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Récupère le fichier sélectionné
        setFormData((prevState) => ({
          ...prevState,
          image: file, // Mets à jour le champ "image" dans formData
        }));
      };
      

    const handleSubmit = (e) => {
      e.preventDefault();
      // Envoie des données au backend
      axios.post('/api/members', formData)
        .then((response) => {
          alert('Création de membre ok');
        })
        .catch((error) => {
          console.error('Erreur lors de la création de membre', error);
        });
    };

    const handleLogout = () => {
        alert('deco ok');
    };

    return (
        <>
            <Header/>

            <h1 className="banner">Tableau de bord</h1>

            <form onSubmit={handleSubmit}>
                <div className="dashboard-field">
                    <section className="dashboard-presentation">

                        <h3>Ta présentation</h3>
                        <p>Les champs obligatoirement requis affichent des <span style={{ color: 'red' }}>*</span></p>

                        <label>Pseudo <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="pseudo" value={formData.pseudo} onChange={handleChange} required />

                        <label>Nom</label>
                        <input type="text" name="nom" value={formData.nom} onChange={handleChange} />

                        <label>Prénom</label>
                        <input type="text" name="prénom" value={formData.prénom} onChange={handleChange} />

                        <label>Image <span style={{ color: 'red' }}>*</span></label>
                        <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        required 
                        />


                        <label>Tags <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="tags" value={formData.tags} onChange={handleChange} required />

                        <label>Description Courte <span style={{ color: 'red' }}>*</span></label>
                        <p>{120 - formData.description_courte.length} caractères restants</p>
                        <textarea 
                        name="description_courte" 
                        value={formData.description_courte} 
                        onChange={handleChange} 
                        maxLength={120} 
                        required 
                        />

                        <label>Description Longue</label>
                        <textarea name="description_longue" value={formData.description_longue} onChange={handleChange} />

                    </section>

                    {/* Section pour les liens avec logos */}
                    <section className="dashboard-links">
                        <h3>Liens avec logo</h3>
                        <p>Tu peux inserer jusqu'à trois liens.</p>
                        {linksWithLogos.map((link) => (
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
                                        value={formData.liens_avec_logo[link]}
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

                        {formData.contenu.map((content, index) => (
                            <div className="content-n" key={index}>
                                <h4>Contenu {index + 1}</h4>

                                <label>Titre</label>
                                <input
                                    type="text"
                                    name="titre"
                                    value={content.titre}
                                    onChange={(e) => handleContentChange(e, index)}
                                />

                                <label>Image</label>
                                <input 
                                    type="file" 
                                    name="image" 
                                    accept="image/*" 
                                    onChange={(e) => handleContentChange(e, index)}
                                    required 
                                />

                                <label>Lien</label>
                                <input
                                    type="text"
                                    name="lien"
                                    value={content.lien}
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

                    <button type="submit">Créer sa carte de membre</button>
                </div>
            </form>

            <button onClick={handleLogout}>Se déconnecter</button>
        </>
    );
}

export default Dashboard;
