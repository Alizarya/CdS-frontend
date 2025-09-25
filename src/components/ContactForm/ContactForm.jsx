import "./ContactForm.css";
import "./ContactFormResponsive.css";

import { useState } from "react";
import Button from "../Button/Button";
import Pen from "./pen.png";
import { sendContactForm } from "../../utils/formConnexion"; // 🔁 Import ici

function ContactForm() {
  const initialFormData = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const { name, email, subject, message } = formData;

    try {
      await sendContactForm(
        { name, email, subject }, // contactFixed
        { message }              // contactMessage
      );

      setSuccessMessage("Message bien envoyé !");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      setErrorMessage("Erreur, veuillez réessayer plus tard.");
    }
  };

  return (
    <>
      <aside className="aside-contact">
        <img src={Pen} alt="Pen Doodle" />
        <p>
          Pour nous contacter, merci d’utiliser le formulaire ci-contre ou
          d’envoyer un email à <b>association[at]cafe-sciences[point]org</b>
        </p>
        <p>
          Si vous souhaitez rejoindre l’association, veuillez prendre
          connaissance des conditions et du formulaire de <br />
          contact sur notre page <br />
          <a href="/JoinUs">
            <em>"Nous rejoindre"</em>
          </a>.
        </p>
      </aside>

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

        <Button type="submit" texte="Envoyer votre message" />
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <hr />
    </>
  );
}

export default ContactForm;
