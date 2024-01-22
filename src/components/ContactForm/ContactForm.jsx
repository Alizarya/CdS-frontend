// Import des styles
import "./ContactForm.css"

// Import des composants
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Button from "../Button/Button"

function ContactForm() {
  //________________________________________
  // Gestion des données des formulaires
  const initialFormData = {};
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Envoi au backend à mettre ici

    // Réinitialise les champs du formulaire après la soumission
    const emptyFormData = {};
    Object.keys(formData).forEach((key) => {
      emptyFormData[key] = "";
    });
    setFormData(emptyFormData);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Prénom / Nom / Pseudo */}
        <div className="contactEntry contactFixed">
          <label htmlFor="name">Prénom / Nom / Pseudo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Genre */}
        <div className="contactEntry contactFixed">
          <label>Genre</label>
          <div className="genderBtn">
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
              />
              Femme
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
              />
              Homme
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="nonBinary"
                checked={formData.gender === "nonBinary"}
                onChange={handleChange}
              />
              Non binaire
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleChange}
              />
              Autre
            </label>
          </div>
        </div>

        {/* Adresse e-mail */}
        <div className="contactEntry contactFixed">
          <label htmlFor="email">Adresse e-mail *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Objet du message */}
        <div className="contactEntry contactFixed">
          <label htmlFor="subject">Objet du message *</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        {/* Message */}
        <div className="contactEntry contactMessage">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <Button type="submit" texte="Envoyer votre message" />
      </form>

      <hr></hr>

      <aside>
        <p> Pour nous contacter, merci d’utiliser le formulaire ci-contre ou d’envoyer un email à <b>association[at]cafe-sciences[point]org</b></p>
        <p> Si vous souhaitez rejoindre l’association, veuillez prendre connaissance des conditions et du formulaire de contact sur notre page
        <Link to="/JoinUs"><em>"Nous rejoindre"</em></Link>.</p>
      </aside>
    </>
  );
}

export default ContactForm;