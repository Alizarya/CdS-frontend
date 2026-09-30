// Import des styles
import "./Card.css";

// Import des besoins
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getMembers } from "../../utils/axiosMembers";

// Import des composants
import Tags from "../../components/Tags/Tags";
import Button from "../../components/Button/Button";
import Error404 from "../../pages/Error404/Error404";

// Import des données
import DataSocialsLogo from "../../data/DataSocialsLogo";

const API_URL = "https://api.cafe-sciences.org/public";

const DEFAULT_IMAGE =
  "https://img.freepik.com/vecteurs-libre/aucune-illustration-concept-donnees_114360-2506.jpg?t=st=1728895997~exp=1728899597~hmac=5fbf097feef816adab0ec43d12d218ebe44fbe0e7b3a60c328c7bed612945f91&w=900";

// =========================
// Création du slug membre
// =========================

function createMemberSlug(value) {
  if (!value) {
    return "";
  }

  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// =========================
// Composant
// =========================

function Card() {
  const { pseudo: memberSlug } = useParams();

  const { state } = useLocation();

  const [member, setMember] = useState(
    state?.memberData || null
  );

  const [isLoading, setIsLoading] = useState(!member);

  // =========================
  // Récupération du membre
  // =========================

  useEffect(() => {
    if (member) {
      setIsLoading(false);
      return;
    }

    const fetchMember = async () => {
      try {
        const membersData = await getMembers();

        const foundMember = membersData.find((currentMember) => {
          const slugSource =
            currentMember.pseudo ||
            currentMember.nom;

          return (
            createMemberSlug(slugSource) ===
            memberSlug
          );
        });

        setMember(foundMember || null);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des membres :",
          error
        );

        setMember(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [memberSlug, member]);

  // =========================
  // Chargement
  // =========================

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  // =========================
  // Membre introuvable
  // =========================

  if (!member) {
    return <Error404 />;
  }

  // =========================
  // Données du membre
  // =========================

  const {
    _id,
    image,
    nom,
    pseudo,
    tags,
    description,
    content,
    links,
    content_format,
  } = member;

  // =========================
  // Image
  // =========================

  const profileImage = image
    ? image.startsWith("http")
      ? image
      : `${API_URL}${image}`
    : DEFAULT_IMAGE;

  // =========================
  // Taille des contenus
  // =========================

  const getImageSize = (format) => {
    switch (format) {
      case "paysage":
        return {
          width: "250px",
          height: "150px",
        };

      case "carré":
        return {
          width: "250px",
          height: "250px",
        };

      case "portrait":
        return {
          width: "250px",
          height: "350px",
        };

      default:
        return {
          width: "250px",
          height: "150px",
        };
    }
  };

  // =========================
  // Description
  // =========================

  const formatDescription = (text) =>
    text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));

  // =========================
  // Affichage
  // =========================

  return (
    <main className="memberCard-details">
      <section className="memberCard-section">

        {/* =========================
            IMAGE + RÉSEAUX
            ========================= */}

        <div className="member-image">

          <img
            src={profileImage}
            alt={pseudo || nom || "Membre"}
          />

          <div className="social-links">
            {Object.entries(links || {})
              .filter(([, value]) => value)
              .map(
                ([socialLink, url], index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i
                      className={`fa ${
                        DataSocialsLogo[socialLink]
                      }`}
                    ></i>

                    {socialLink
                      .charAt(0)
                      .toUpperCase() +
                      socialLink.slice(1)}
                  </a>
                )
              )}
          </div>

          <Tags
            memberId={_id}
            tags={tags}
          />

        </div>

        {/* =========================
            INFORMATIONS
            ========================= */}

        <div className="member-info">

          {pseudo ? (
            <>
              <h2>{pseudo}</h2>
              {nom && <h3>{nom}</h3>}
            </>
          ) : (
            <h2>{nom}</h2>
          )}

          <p>
            {description
              ? formatDescription(description)
              : "Description non fournie."}
          </p>

          {/* =========================
              CONTENUS DU MEMBRE
              ========================= */}

          {content && (
            <div className="content-links">

              {Object.values(content).map(
                (item, index) => {
                  const imageSize =
                    getImageSize(
                      item.content_format ||
                        content_format
                    );

                  return (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={imageSize}
                      />

                      <h4>{item.title}</h4>

                      <p>
                        {item.description}
                      </p>
                    </a>
                  );
                }
              )}

            </div>
          )}

        </div>

      </section>

      <Button
        texte="Découvrir les autres membres"
        to="/Members"
      />
    </main>
  );
}

export default Card;