import "./Landing.css";

import SocialsLogos from "../../data/DataSocialsLogo";
import DataSocials from "../../data/DataSocials";

import { getMembers } from "../../utils/axiosMembers";
import { getFeaturedContent } from "../../utils/axiosContent";
import baseURL from "../../utils/urlApi";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import ContactForm from "../../components/ContactForm/ContactForm";

import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const API_URL = "https://api.cafe-sciences.org/public";

const DEFAULT_MEMBER_IMAGE =
  "https://img.freepik.com/vecteurs-libre/aucune-illustration-concept-donnees_114360-2506.jpg?t=st=1728895997~exp=1728899597~hmac=5fbf097feef816adab0ec43d12d218ebe44fbe0e7b3a60c328c7bed612945f91&w=900";

const DEFAULT_CONTENT_IMAGE =
  "/images/Landing/science.jpg";

function getMemberImage(image) {
  if (!image) {
    return DEFAULT_MEMBER_IMAGE;
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `${API_URL}${image}`;
}

function getContentImage(image) {
  if (!image) {
    return DEFAULT_CONTENT_IMAGE;
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `${baseURL}/data${image}`;
}

function Landing() {
  const [members, setMembers] = useState([]);
  const [featuredContent, setFeaturedContent] = useState(null);

  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);

  const location = useLocation();

  /*
   * ========================================
   * SCROLL VERS UNE ANCRE
   * ========================================
   */

  useEffect(() => {
    const hash = location.hash?.slice(1);

    if (!hash) {
      return;
    }

    const timeout = setTimeout(() => {
      const element = document.getElementById(hash);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [location.hash]);

  /*
   * ========================================
   * RÉCUPÉRATION DES MEMBRES
   * ========================================
   */

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersData = await getMembers();

        setMembers(
          Array.isArray(membersData)
            ? membersData
            : membersData?.data || []
        );
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des membres :",
          error
        );

        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, []);

  /*
   * ========================================
   * RÉCUPÉRATION DU CONTENU FEATURED
   * ========================================
   */

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        const content = await getFeaturedContent();

        setFeaturedContent(content);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du contenu mis en avant :",
          error
        );

        setFeaturedContent(null);
      } finally {
        setLoadingContent(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  /*
   * ========================================
   * MEMBRE ALÉATOIRE
   * ========================================
   */

  const randomMember = useMemo(() => {
    const activeMembers = members.filter(
      (member) => !member.softDelete
    );

    if (activeMembers.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(
      Math.random() * activeMembers.length
    );

    return activeMembers[randomIndex];
  }, [members]);

  /*
   * ========================================
   * RENDU
   * ========================================
   */

  return (
    <div className="landing">
      <Header />

      {/* ========================================
          HERO
          ======================================== */}

      <section className="home">
        <h1 className="banner">
          C'est fort de sciences !
        </h1>

        <img
          className="homeImg"
          src="/images/Landing/goupePA.jpg"
          alt="Le Café des sciences lors de PlayAzur, en groupe"
        />

        <Button
          texte="Découvrir nos membres"
          to="/Members"
        />
      </section>

      {/* ========================================
          CONTENU FEATURED + MEMBRE
          ======================================== */}

      <section className="landing-highlight">

        {/* ================================
            CONTENU FEATURED
            ================================ */}

        <div className="landing-featured">

          <div className="landing-section-title landing-featured-title">
            <span>À découvrir absolument !</span>
          </div>

          {loadingContent ? (
            <p className="landing-loading">
              Chargement...
            </p>
          ) : featuredContent ? (
            <Link
              to={
                featuredContent.url ||
                "/Content"
              }
              className="landing-featured-link"
              target={
                featuredContent.url
                  ? "_blank"
                  : undefined
              }
              rel={
                featuredContent.url
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              <div className="landing-featured-image-container">
                <img
                  className="landing-featured-image"
                  src={getContentImage(
                    featuredContent.image
                  )}
                  alt={featuredContent.title}
                />
              </div>

              <div className="landing-featured-info">
                <h2>
                  {featuredContent.title}
                </h2>

                {featuredContent.description && (
                  <p className="landing-featured-description">
                    {featuredContent.description}
                  </p>
                )}

                {featuredContent.author && (
                  <p className="landing-featured-author">
                    Par{" "}
                    <span>
                      {featuredContent.author}
                    </span>
                  </p>
                )}
              </div>
            </Link>
          ) : (
            <p className="landing-empty">
              Aucun contenu mis en avant.
            </p>
          )}
        </div>

        {/* ================================
            MEMBRE RANDOM
            ================================ */}

        <div className="landing-member">

          <div className="landing-section-title landing-member-title">
            <span>Zoom sur</span>
          </div>

          {loadingMembers ? (
            <p className="landing-loading">
              Chargement...
            </p>
          ) : randomMember ? (
            <div className="landing-member-content">

  <div className="landing-member-main">

    <Link
      to={`/Members/${randomMember._id}`}
      className="landing-member-image-link"
    >
      <div className="landing-member-image-container">
        <img
          className="landing-member-image"
          src={getMemberImage(randomMember.image)}
          alt={`Profil de ${
            randomMember.pseudo ||
            randomMember.name ||
            "membre"
          }`}
        />

        <span className="landing-member-image-border" />
      </div>
    </Link>

    {randomMember.links && (
      <div className="landing-member-socials">
        {Object.keys(randomMember.links)
          .filter(
            (link) => randomMember.links[link]
          )
          .map((link) => (
            <a
              key={link}
              href={randomMember.links[link]}
              target="_blank"
              rel="noreferrer"
              title={
                link.charAt(0).toUpperCase() +
                link.slice(1)
              }
            >
              {SocialsLogos[link] && (
                <i className={SocialsLogos[link]} />
              )}
            </a>
          ))}
      </div>
    )}
  </div>

  <div className="landing-member-info">

    <div className="landing-member-name">
      {randomMember.pseudo ||
        randomMember.name}
    </div>

    {randomMember.shortdescription && (
      <p>
        {randomMember.shortdescription}
      </p>
    )}

  </div>

</div>
          ) : (
            <p className="landing-empty">
              Aucun membre disponible.
            </p>
          )}
        </div>
      </section>

      {/* ========================================
          SOUTIEN
          ======================================== */}

      <section
        className="support"
        id="support"
      >
        <div className="helloasso">

          <div className="helloasso-text">
            <p>
              Le Café des sciences est une
              association qui existe grâce
              notamment au soutien de ses membres
              et à leur travail{" "}
              <b>bénévole</b>.
            </p>

            <p>
              Si vous appréciez notre travail,
              n’hésitez pas à faire un{" "}
              <b>don</b> !
            </p>

            <p>
              Il servira à couvrir les frais de
              fonctionnement courant ou pourra
              être utilisé pour financer un projet
              spécifique !
            </p>
          </div>

          <a
            href="https://www.helloasso.com/associations/c-fetiers-des-sciences"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="supportImg"
              src="/images/Landing/logo-web-bleu.png"
              alt="Logo de HelloAsso"
            />

            <p className="supportTxt">
              Faire un don
            </p>
          </a>
        </div>

        <div className="socials">
          {DataSocials.map(
            (social, index) => (
              <Button
                key={index}
                to={social.link}
                icon={social.icon}
                texte={social.title}
                openNewTab={true}
              />
            )
          )}
        </div>
      </section>

      {/* ========================================
          CONTACT
          ======================================== */}

      <section
        className="contact"
        id="contact"
      >
        <ContactForm />
      </section>

      <Footer />
    </div>
  );
}

export default Landing;