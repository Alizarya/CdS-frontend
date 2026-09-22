import React, {
  useEffect,
  useRef,
  useState,
} from "react";

// Styles
import "./content.css";

// Composants
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

// Axios
import {
  getContents,
  getFeaturedContent,
} from "../../utils/axiosContent";

import { getRss } from "../../utils/axiosRss";

import baseURL from "../../utils/urlApi";

function Content() {
  const [featuredContent, setFeaturedContent] = useState(null);
  const [contents, setContents] = useState([]);
  const [rssItems, setRssItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rssError, setRssError] = useState(null);

  const featuredRef = useRef(null);
  const [rssHeight, setRssHeight] = useState(null);

  useEffect(() => {
    async function loadContents() {
      try {
        const [featured, allContents] = await Promise.all([
          getFeaturedContent(),
          getContents(),
        ]);

        setFeaturedContent(featured);
        setContents(allContents.contents || []);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des contenus :",
          error
        );

        setError("Impossible de charger les contenus.");
      } finally {
        setLoading(false);
      }
    }

    async function loadRss() {
      try {
        const data = await getRss();

        setRssItems(data.items || []);
      } catch (error) {
        console.error(
          "Erreur lors du chargement du flux RSS :",
          error
        );

        setRssError("Impossible de charger le flux RSS.");
      }
    }

    loadContents();
    loadRss();
  }, []);

  // Mesurer la hauteur du contenu featured
  useEffect(() => {
    if (!featuredRef.current) {
      return;
    }

    const element = featuredRef.current;

    function updateRssHeight() {
      setRssHeight(element.offsetHeight);
    }

    updateRssHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateRssHeight();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [featuredContent]);

  // Construire l'URL complète de l'image
  function getContentImage(image) {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${baseURL}/data${image}`;
  }

  // Formater la date du flux RSS
  function formatRssDate(date) {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Récupérer le texte du post RSS
  function getRssText(item) {
  const text =
    item.contentSnippet ||
    item.content ||
    item.description ||
    item.title ||
    "";

  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

  if (loading) {
    return (
      <>
        <Header />

        <main className="main-content">
          <h1 className="banner">
            Une sélection des contenus de nos membres
          </h1>

          <div className="content">
            <p>Chargement des contenus...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />

        <main className="main-content">
          <h1 className="banner">
            Une sélection des contenus de nos membres
          </h1>

          <div className="content">
            <p>{error}</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="main-content">
        <h1 className="banner">
          Une sélection des contenus de nos membres
        </h1>

        {/* Featured + flux RSS */}
        <div className="content-featured-layout">

          {/* Flux RSS */}
          <aside
            className="content-rss"
            style={
              rssHeight
                ? { height: `${rssHeight}px` }
                : undefined
            }
          >
            <div className="rss-container">
              <h2>Actualités des membres</h2>

              {rssError && (
                <p className="rss-error">
                  {rssError}
                </p>
              )}

              {!rssError && rssItems.length === 0 && (
                <p className="rss-empty">
                  Aucun article disponible.
                </p>
              )}

              {!rssError && rssItems.length > 0 && (
                <div className="rss-list">
  {rssItems.map((item, index) => (
    <article
      className="rss-item"
      key={`${item.link || item.title}-${index}`}
    >
      {item.link ? (
        <a
          className="rss-item-link"
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="rss-item-source">
            {item.source}
          </p>

          <p className="rss-item-text">
            {getRssText(item)}
          </p>
        </a>
      ) : (
        <>
          <p className="rss-item-source">
            {item.source}
          </p>

          <p className="rss-item-text">
            {getRssText(item)}
          </p>
        </>
      )}
    </article>
  ))}
</div>
              )}
            </div>
          </aside>

          {/* Contenu mis en avant */}
          {featuredContent && (
            <article
              className="content-featured"
              ref={featuredRef}
            >
              <div className="content-featured-image">
                <img
                  src={getContentImage(featuredContent.image)}
                  alt={featuredContent.title}
                />
              </div>

              <div className="content-featured-info">
                <h2>
                  {featuredContent.title}
                </h2>

                <p className="content-featured-description">
                  {featuredContent.description}
                </p>

                <p className="content-author">
                  Par{" "}
                  <span>{featuredContent.author}</span>
                </p>
              </div>
            </article>
          )}
        </div>

        {/* Contenus non featured */}
        <section className="content-grid">
          {contents
            .filter((content) => content.featured !== true)
            .map((content) => (
              <article
                className="content-card"
                key={content.id}
              >
                <div className="content-card-image">
                  <img
                    src={getContentImage(content.image)}
                    alt={content.title}
                  />
                </div>

                <div className="content-card-info">
                  <h2>
                    {content.title}
                  </h2>

                  <p className="content-card-author">
                    Par{" "}
                    <span>{content.author}</span>
                  </p>

                  <p className="content-card-description">
                    {content.description}
                  </p>
                </div>
              </article>
            ))}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Content;