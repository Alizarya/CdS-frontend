import React, { useEffect, useRef, useState } from "react";

// Styles
import "./JoinUs.css";

// Composants
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import ContactCandidacy from "../../components/ContactCandidacy/ContactCandidacy";

function JoinUs() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef(null);

  const handleButtonClick = () => {
    setIsFormVisible((v) => !v);
  };

  // Scroll vers le formulaire quand il s’affiche
  useEffect(() => {
    if (isFormVisible && formRef.current) {
      // petit rafraîchissement pour laisser le DOM peindre
      const t = setTimeout(() => {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isFormVisible]);

  return (
    <>
      <Header />
      <main className="main-joinus">
        <h1 className="banner">Comment nous rejoindre ?</h1>

        <div className="joinus">
          <p>
            Vous souhaitez rejoindre le Café des Sciences ? Suivez le parcours ci-dessous
            pour vérifier votre éligibilité, puis envoyez votre candidature via le
            formulaire.
          </p>

          <h2>Par candidature</h2>
          <p>
            Notre association regroupe des créatrices et créateurs de contenus de
            vulgarisation scientifique. Le processus de candidature nous permet de mieux
            comprendre votre travail, vos motivations et la manière dont vous souhaitez
            contribuer à la communauté.
          </p>

          <Button
            texte={isFormVisible ? "Masquer le formulaire" : "Vérifier si vous êtes éligible"}
            onClick={handleButtonClick}
            aria-expanded={isFormVisible}
            aria-controls="joinus-form"
          />

          {isFormVisible && (
            <div
              id="joinus-form"
              ref={formRef}
              className={`joinus-form ${isFormVisible ? "visible" : "hidden"}`}
            >
              <ContactCandidacy />
            </div>
          )}

          <h2>Par marrainage ou parrainage</h2>
          <p>
            Vous pouvez également être recommandé·e par un·e membre. Le marrainage /
            parrainage accélère l’évaluation, mais n’exonère pas d’une vérification de
            votre production et de l’alignement avec les valeurs de l’association.
          </p>
          <p>
            Vous pouvez aussi{" "}
            <a href="/#contact" className="joinus-link">
              contacter directement l’association
            </a>{" "}
            pour plus d’informations.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default JoinUs;
