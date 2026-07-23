// Import des styles
import "./Card.css";

import React from "react";
import Tags from "../../components/Tags/Tags";
import DataSocialsLogo from "../../data/DataSocialsLogo";

const API_URL = "https://api.cafe-sciences.org/public";

const DEFAULT_IMAGE =
  "https://img.freepik.com/vecteurs-libre/aucune-illustration-concept-donnees_114360-2506.jpg?t=st=1728895997~exp=1728899597~hmac=5fbf097feef816adab0ec43d12d218ebe44fbe0e7b3a60c328c7bed612945f91&w=900";

const CardPrev = ({ member }) => {
  if (!member) {
    return <p>Aucun membre trouvé.</p>;
  }

  const {
    _id,
    image,
    name,
    pseudo,
    description,
    links,
    tags,
    content,
    content_format,
  } = member;

  const profileImage = image
    ? image.startsWith("http")
      ? image
      : `${API_URL}${image}`
    : DEFAULT_IMAGE;

  const defaultContent = {
    link: "#",
    image:
      "https://img.freepik.com/vecteurs-libre/aucun-concept-donnees-dessine-main_52683-127823.jpg?t=st=1728895983~exp=1728899583~hmac=d75ee8ef3a344a317df4e25c358b3fcfe4410fb3a52a58141c838a160f1ff04f&w=826",
    title: "TITRE",
    description:
      "Voici la description rapide de ton contenu. Tu vas pouvoir écrire quelques lignes pour présenter ton travail.",
  };

  const getImageSize = (format) => {
    switch (format) {
      case "paysage":
        return { width: "250px", height: "150px" };
      case "carré":
        return { width: "250px", height: "250px" };
      case "portrait":
        return { width: "250px", height: "350px" };
      default:
        return { width: "250px", height: "150px" };
    }
  };

  const formatDescription = (text) =>
    text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

  return (
    <main className="memberCard-details">
      <section className="memberCard-section">
        <div className="member-image">
          <img src={profileImage} alt={name || "Nom inconnu"} />

          <div className="social-links">
            {links && Object.keys(links).length > 0 ? (
              Object.keys(links)
                .filter(
                  (social) =>
                    links[social] && links[social].trim() !== ""
                )
                .map((social, index) => (
                  <a
                    key={index}
                    href={links[social]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className={`fa ${DataSocialsLogo[social]}`}></i>
                    {social.charAt(0).toUpperCase() + social.slice(1)}
                  </a>
                ))
            ) : (
              <p>Aucun lien enregistré.</p>
            )}
          </div>

          <Tags memberId={_id} tags={tags} />
        </div>

        <div className="member-info">
          <h2>{pseudo || "TON NOM"}</h2>

          <p>
            {description
              ? formatDescription(description)
              : "Description non fournie."}
          </p>

          <div className="content-links">
            {content && content.length > 0 ? (
              content.map((item, index) => {
                const imageSize = getImageSize(
                  item.content_format || content_format
                );

                return (
                  <a
                    key={index}
                    href={item.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={item.image || defaultContent.image}
                      alt={item.title || defaultContent.title}
                      style={imageSize}
                    />

                    <h4>{item.title || defaultContent.title}</h4>

                    <p>
                      {item.description || defaultContent.description}
                    </p>
                  </a>
                );
              })
            ) : (
              <p>Aucun contenu disponible.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CardPrev;