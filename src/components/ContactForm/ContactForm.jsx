// Import des styles
import "./ContactForm.css"

// Import des composants
import React, { useState } from "react";
import Button from "../Button/Button"

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    social: "",
    websiteName: "",
    websiteLink:"",
    contentDate:"",
    contentNum: "",
    contentFormat:"",
    contentTheme:"",
    motivation:"",
    sponsor1: {
      sponsor1Name: "",
      sponsor1Mail: "",
    },
    sponsor2: {
      sponsor2Name: "",
      sponsor2Mail: "",
    },
    sponsor3: {
      sponsor3Name: "",
      sponsor3Mail: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // ajouter l'envoi au back

    // Réinitialise les champs après la soumission du formulaire
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      social: "",
      websiteName: "",
      websiteLink:"",
      contentDate:"",
      contentNum: "",
      contentFormat:"",
      contentTheme:"",
      motivation:"",
      sponsor1: {
        sponsor1Name: "",
        sponsor1Mail: "",
      },
      sponsor2: {
        sponsor2Name: "",
        sponsor2Mail: "",
      },
      sponsor3: {
        sponsor3Name: "",
        sponsor3Mail: "",
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>

        <div className="contactEntry contactFixed">
          <label htmlFor="name">Prénom / Nom / Pseudo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contactEntry contactFixed">
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contactEntry contactFixed">
          <label htmlFor="subject">Objet du message</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contactEntry contactMessage">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="contactEntry contactCandidacy">
          <label htmlFor="social">Lien vers vos réseaux sociaux</label>
          <input
            type="text"
            id="social"
            name="social"
            value={formData.social}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contactEntry contactCandidacy">
          <label htmlFor="websiteName">Nom du site web / blog / podcast</label>
          <input
            type="text"
            id="websiteName"
            name="websiteName"
            value={formData.websiteName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contactEntry contactCandidacy">
          <label htmlFor="websiteLink">Lien du site web / blog / podcast</label>
          <input
            type="text"
            id="websiteLink"
            name="websiteLink"
            value={formData.websiteLink}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contactEntry contactCandidacy">
          <label htmlFor="contentDate">Date du premier contenu</label>
          <input
            type="text"
            id="contentDate"
            name="contentDate"
            value={formData.contentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contactEntry contactCandidacy">
          <label htmlFor="contentNum">Nombre de contenus en ligne</label>
          <input
            type="text"
            id="contentNum"
            name="contentNum"
            value={formData.contentNum}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contactEntry contactCandidacy">
          <label htmlFor="contentFormat">Format du contenu</label>
          <input
            type="text"
            id="contentFormat"
            name="contentFormat"
            value={formData.contentFormat}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contactEntry contactCandidacy">
          <label htmlFor="contentTheme">Thème du contenu</label>
          <input
            type="text"
            id="contentTheme"
            name="contentTheme"
            value={formData.contentTheme}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contactEntry contactCandidacy">
          <label htmlFor="motivation">Motivation</label>
          <input
            type="text"
            id="motivation"
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            required
          />
        </div>

        {/* Champs pour sponsor1 */}
        <div className="contactEntry contactSponsor">
          <label htmlFor="sponsor1Name">Nom du sponsor 1</label>
          <input
            type="text"
            id="sponsor1Name"
            name="sponsor1Name"
            value={formData.sponsor1.sponsor1Name}
            onChange={handleChange} 
            required
          />
        </div>
        <div className="contactEntry contactSponsor">
          <label htmlFor="sponsor1Mail">Adresse e-mail du sponsor 1</label>
          <input
            type="email"
            id="sponsor1Mail"
            name="sponsor1Mail"
            value={formData.sponsor1.sponsor1Mail}
            onChange={handleChange} 
            required
          />
        </div>

        {/* Champs pour sponsor2 */}
        <div className="contactEntry contactSponsor">
          <label htmlFor="sponsor2Name">Nom du sponsor 2</label>
          <input
            type="text"
            id="sponsor2Name"
            name="sponsor2Name"
            value={formData.sponsor2.sponsor2Name}
            onChange={handleChange} 
            required
          />
        </div>
        <div className="contactEntry contactSponsor">
          <label htmlFor="sponsor2Mail">Adresse e-mail du sponsor 2</label>
          <input
            type="email"
            id="sponsor2Mail"
            name="sponsor2Mail"
            value={formData.sponsor2.sponsor2Mail}
            onChange={handleChange} 
            required
          />
        </div>

        {/* Champs pour sponsor3 */}
        <div className="contactEntry contactSponsor">
          <label htmlFor="sponsor3Name">Nom du sponsor 3</label>
          <input
            type="text"
            id="sponsor3Name"
            name="sponsor3Name"
            value={formData.sponsor3.sponsor3Name}
            onChange={handleChange} 
          />
        </div>

        <div className="contactEntry contactSponsor">
          <label htmlFor="sponsor3Mail">Adresse e-mail du sponsor 3</label>
          <input
            type="email"
            id="sponsor3Mail"
            name="sponsor3Mail"
            value={formData.sponsor3.sponsor3Mail}
            onChange={handleChange} 
            required
          />
        </div>

        <Button type="submit" texte="Envoyer votre message" />
      </form>
      <hr></hr>
      </>
  );
}

export default ContactForm;
