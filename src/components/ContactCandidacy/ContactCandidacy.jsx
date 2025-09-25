// Styles
import "./ContactCandidacy.css";

import React, { useMemo, useState } from "react";
import Button from "../Button/Button";
import { sendContactForm } from "../../utils/formConnexion";

const ContactCandidacy = () => {
  // État "parcours d’éligibilité"
  const [reponse1, setReponse1] = useState(""); // créateur/créatrice ?
  const [reponse2, setReponse2] = useState(""); // > 6 mois ?
  const [reponse3, setReponse3] = useState(""); // type contenu
  const [reponse4, setReponse4] = useState(""); // nb contenus

  // Infos candidature
  const [nom, setNom] = useState("");
  const [genre, setGenre] = useState("");
  const [adresseMail, setAdresseMail] = useState("");
  const [nomContenu, setNomContenu] = useState("");
  const [lien, setLien] = useState("");
  const [liensRS, setLiensRS] = useState("");
  const [motivations, setMotivations] = useState("");

  // UX
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Éligible si : oui créateur·rice + >6 mois + type renseigné + nb contenus >= 6
  const isEligible = useMemo(() => {
    const nb = Number(reponse4);
    return (
      reponse1 === "oui" &&
      reponse2 === "oui" &&
      !!reponse3 &&
      !Number.isNaN(nb) &&
      nb >= 6
    );
  }, [reponse1, reponse2, reponse3, reponse4]);

  // Champs requis quand éligible
  const requiredFilled = useMemo(() => {
    return (
      nom.trim() &&
      adresseMail.trim() &&
      nomContenu.trim() &&
      lien.trim() &&
      motivations.trim()
    );
  }, [nom, adresseMail, nomContenu, lien, motivations]);

  const normalizeUrl = (u) => {
    if (!u) return "";
    const trimmed = u.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!isEligible) {
      setErrorMessage(
        "Vous n’êtes pas éligible à la candidature selon vos réponses. Merci de réessayer plus tard."
      );
      return;
    }
    if (!requiredFilled) {
      setErrorMessage(
        "Veuillez remplir tous les champs obligatoires marqués d’un astérisque (*)."
      );
      return;
    }

    const now = new Date();
    const subject = `[CANDIDATURE] ${nomContenu || "Sans titre"} — ${nom || "Anonyme"}`;

    const message = `
Nouvelle candidature envoyée depuis la page "Nous rejoindre" — ${now.toLocaleString()}.

[Éligibilité]
- Créateur·rice de contenus : ${reponse1 || "non renseigné"}
- Ancienneté > 6 mois : ${reponse2 || "non renseigné"}
- Type de contenus : ${reponse3 || "non renseigné"}
- Nombre de contenus : ${reponse4 || "non renseigné"}

[Identité]
- Nom / Pseudo : ${nom || "non renseigné"}
- Genre : ${genre || "non renseigné"}
- Email : ${adresseMail || "non renseigné"}

[Projet]
- Nom du contenu : ${nomContenu || "non renseigné"}
- Lien principal : ${normalizeUrl(lien) || "non renseigné"}
- Réseaux sociaux : ${liensRS || "non renseigné"}

[Motivations]
${motivations || "—"}
`.trim();

    try {
      setSending(true);
      await sendContactForm(
        {
          name: nom || "Candidat",
          email: adresseMail,
          subject, // ← préfixé [CANDIDATURE]
        },
        {
          message, // ← tout le récap dans le message
        }
      );
      setSuccessMessage("Candidature envoyée ! Nous vous répondrons dès que possible.");
      // reset “safe” (on garde le parcours si tu veux que le message de succès reste visible)
      setNom("");
      setGenre("");
      setAdresseMail("");
      setNomContenu("");
      setLien("");
      setLiensRS("");
      setMotivations("");
    } catch (error) {
      console.error("Erreur lors de l’envoi de la candidature :", error);
      setErrorMessage("Erreur lors de l’envoi. Veuillez réessayer plus tard.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="join-form">
      {/* PARCOURS D’ÉLIGIBILITÉ */}
      <div className="joinus-form-question question1">
        <p className="question">
          Vous êtes créateur·rice de contenus et vous souhaitez que le Café des Sciences
          partage votre travail ?
        </p>
        <div className="joinus-form-radiobtn">
          <label>
            Oui
            <input
              type="radio"
              name="q1"
              value="oui"
              checked={reponse1 === "oui"}
              onChange={(e) => setReponse1(e.target.value)}
            />
          </label>
          <label>
            Non
            <input
              type="radio"
              name="q1"
              value="non"
              checked={reponse1 === "non"}
              onChange={(e) => setReponse1(e.target.value)}
            />
          </label>
        </div>
      </div>

      {reponse1 === "non" && (
        <p className="negative">
          Nous vous invitons à proposer votre aide via une demande de recommandation (voir
          ci-dessous).
        </p>
      )}

      {reponse1 === "oui" && (
        <div className="joinus-form-question question2">
          <p className="question">Vous créez du contenu depuis plus de six mois ?</p>
          <div className="joinus-form-radiobtn">
            <label>
              Oui
              <input
                type="radio"
                name="q2"
                value="oui"
                checked={reponse2 === "oui"}
                onChange={(e) => setReponse2(e.target.value)}
              />
            </label>
            <label>
              Non
              <input
                type="radio"
                name="q2"
                value="non"
                checked={reponse2 === "non"}
                onChange={(e) => setReponse2(e.target.value)}
              />
            </label>
          </div>
        </div>
      )}

      {reponse2 === "non" && (
        <p className="negative">
          Malheureusement vous ne créez pas de contenus depuis assez de temps pour
          pouvoir candidater. Revenez vers nous dans quelques mois.
        </p>
      )}

      {reponse2 === "oui" && (
        <div className="joinus-form-question question3">
          <p className="question">Quel type de contenus partagez-vous ?</p>
          <div className="joinus-form-radiobtn">
            <label>
              Vidéo
              <input
                type="radio"
                name="q3"
                value="Vidéo"
                checked={reponse3 === "Vidéo"}
                onChange={(e) => setReponse3(e.target.value)}
              />
            </label>
            <label>
              Blog
              <input
                type="radio"
                name="q3"
                value="Blog"
                checked={reponse3 === "Blog"}
                onChange={(e) => setReponse3(e.target.value)}
              />
            </label>
            <label>
              Podcast
              <input
                type="radio"
                name="q3"
                value="Podcast"
                checked={reponse3 === "Podcast"}
                onChange={(e) => setReponse3(e.target.value)}
              />
            </label>
            <label>
              Autre
              <input
                type="radio"
                name="q3"
                value="Autre"
                checked={reponse3 === "Autre"}
                onChange={(e) => setReponse3(e.target.value)}
              />
            </label>
          </div>
        </div>
      )}

      {(reponse3 === "Vidéo" ||
        reponse3 === "Blog" ||
        reponse3 === "Podcast" ||
        reponse3 === "Autre") && (
        <div className="joinus-form-question question4">
          <p className="question">Combien de contenus avez-vous à votre actif ?</p>
          <input
            type="number"
            name="q4"
            min={0}
            inputMode="numeric"
            value={reponse4}
            onChange={(e) => setReponse4(e.target.value)}
          />

          {/* FORMULAIRE DE CANDIDATURE */}
          {Number(reponse4) >= 6 ? (
            <form className="joinus-form-info" onSubmit={handleSubmit} noValidate>
              <p className="joinus-form-ok">
                Vous êtes éligible à la candidature, vous pouvez la remplir ci-dessous.
              </p>

              <label className="question" htmlFor="cand-nom">
                Nom, Prénom, Pseudo* :
              </label>
              <input
                id="cand-nom"
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />

              <p className="question">Genre :</p>
              <div className="gender">
                <label>
                  <input
                    type="radio"
                    name="genre"
                    value="femme"
                    checked={genre === "femme"}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                  <span>Femme</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="genre"
                    value="homme"
                    checked={genre === "homme"}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                  <span>Homme</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="genre"
                    value="non-binaire"
                    checked={genre === "non-binaire"}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                  <span>Non-binaire</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="genre"
                    value="autre"
                    checked={genre === "autre"}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                  <span>Autre</span>
                </label>
              </div>

              <label className="question" htmlFor="cand-email">
                Adresse mail *:
              </label>
              <input
                id="cand-email"
                type="email"
                value={adresseMail}
                onChange={(e) => setAdresseMail(e.target.value)}
                required
              />

              <label className="question" htmlFor="cand-nomcontenu">
                Nom du contenu *:
              </label>
              <input
                id="cand-nomcontenu"
                type="text"
                value={nomContenu}
                onChange={(e) => setNomContenu(e.target.value)}
                required
              />

              <label className="question" htmlFor="cand-lien">
                Lien *:
              </label>
              <input
                id="cand-lien"
                type="url"
                value={lien}
                onChange={(e) => setLien(e.target.value)}
                placeholder="https://…"
                required
              />

              <label className="question" htmlFor="cand-rs">
                Liens de vos réseaux sociaux *:
              </label>
              <input
                id="cand-rs"
                type="text"
                value={liensRS}
                onChange={(e) => setLiensRS(e.target.value)}
                placeholder="Ex: https://bsky.app/… ; https://youtube.com/…"
              />

              <label className="question" htmlFor="cand-motiv">
                Vos motivations *:
              </label>
              <textarea
                id="cand-motiv"
                value={motivations}
                onChange={(e) => setMotivations(e.target.value)}
                required
              />

              <Button
                type="submit"
                texte={sending ? "Envoi en cours…" : "Envoyer votre candidature"}
                disabled={sending || !isEligible || !requiredFilled}
              />

              {successMessage && <p className="success-message-candit">{successMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
          ) : (
            reponse4 !== "" && (
              <p className="negative">
                Malheureusement votre nombre de contenus est insuffisant.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ContactCandidacy;
