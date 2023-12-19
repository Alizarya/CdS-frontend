// Import des styles
import "./ContactForm.css"

// Import des composants
import React, { useState } from "react";
import Button from "../Button/Button"

// Import des datas
import DataContactFields from "../../data/DataContactFields";

function ContactForm() {
  const [formData, setFormData] = useState({ /* ...votre état de formData */ });

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
    setFormData({ /* ...réinitialisation des valeurs de formData */ });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {DataContactFields.map((field, index) => (
          <div className={field.className} key={index}>
            <label htmlFor={field.id}>{field.title}</label>
            {field.type === 'textarea' ? (
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
    </>
  );
}

export default ContactForm;
