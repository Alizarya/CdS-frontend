// Import des styles
import "./ContactForm.css"

// Import des composants
import React, { useState } from "react";
import Button from "../Button/Button"

// Import des datas
import DataContactFields from "../../data/DataContactFields";

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

  //________________________________________
  // Gestion des boutons de contact
  const handleMessageClick = () => {
    const contactCandidacies = document.querySelectorAll('.contactCandidacy');
    const contactSponsors = document.querySelectorAll('.contactSponsor');
    const contactMessages = document.querySelectorAll('.contactMessage');
    contactCandidacies.forEach((contactCandidacy) => {
      contactCandidacy.style.display = 'none';
    });
    contactSponsors.forEach((contactSponsor) => {
      contactSponsor.style.display = 'none';
    });
    contactMessages.forEach((contactMessage) => {
      contactMessage.style.display = 'flex';
    });
  };
  
  const handleCandidacyClick = () => {
    const contactSponsors = document.querySelectorAll('.contactSponsor');
    const contactCandidacies = document.querySelectorAll('.contactCandidacy');
    const contactMessages = document.querySelectorAll('.contactMessage');
    contactSponsors.forEach((contactSponsor) => {
      contactSponsor.style.display = 'none';
    });
    contactCandidacies.forEach((contactCandidacy) => {
      contactCandidacy.style.display = 'flex';
    });
    contactMessages.forEach((contactMessage) => {
      contactMessage.style.display = 'none';
    });
  };
  
  const handleSponsorClick = () => {
    const contactCandidacies = document.querySelectorAll('.contactCandidacy');
    const contactSponsors = document.querySelectorAll('.contactSponsor');
    const contactMessages = document.querySelectorAll('.contactMessage');
    contactCandidacies.forEach((contactCandidacy) => {
      contactCandidacy.style.display = 'none';
    });
    contactSponsors.forEach((contactSponsor) => {
      contactSponsor.style.display = 'flex';
    });
    contactMessages.forEach((contactMessage) => {
      contactMessage.style.display = 'none';
    });
  };
  

  return (
    <>
      <form onSubmit={handleSubmit}>
        {DataContactFields.map((field, index) => (
          <div className={field.className} key={index}>
            <label htmlFor={field.id}>{field.title}</label>
            {field.type === "textarea" ? (
              <textarea
                id={field.id}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              ></textarea>
            ) : (
              <input
                type={field.type}
                id={field.id}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        <Button type="submit" texte="Envoyer votre message" />
      </form>
      
      <hr></hr>

      <aside>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <div className="changeFormBtn">
            <Button texte="message" onClick={handleMessageClick} />
            <Button texte="candidater" onClick={handleCandidacyClick} />
            <Button texte="p-marrainnage" onClick={handleSponsorClick} />
        </div>
        </aside>
    </>
  );
};

export default ContactForm;
