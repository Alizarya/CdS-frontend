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
    });
  };

  return (
    <section className="contact" id="contact">
      <form onSubmit={handleSubmit}>
        <div className="contactFixed">
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
        <div className="contactFixed">
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
        <div className="contactFixed">
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
        <div>
          <label htmlFor="message">Message</label>
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
    </section>
  );
}

export default ContactForm;
