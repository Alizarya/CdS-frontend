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
import { getMembers } from "../../utils/axiosMembers";

import baseURL from "../../utils/urlApi";

import { Link } from "react-router-dom";

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
// Normalisation
// =========================

function normalize(value) {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

// =========================
// Composant
// =========================

function Content() {
  const [featuredContent, setFeaturedContent] =
    useState(null);

  const [contents, setContents] = useState([]);

  const [rssItems, setRssItems] = useState([]);

  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [rssError, setRssError] = useState(null);

  const featuredRef = useRef(null);

  const [rssHeight, setRssHeight] =
    useState(null);

  // =========================
  // Chargement des données
  // =========================

  useEffect(() => {
    async function loadContents() {
      try {
        const [
          featured,
          allContents,
        ] = await Promise.all([
          getFeaturedContent(),
          getContents(),
        ]);

        setFeaturedContent(featured);

        setContents(
          allContents.contents || []
        );
      } catch (error) {
        console.error(
          "Erreur lors du chargement des contenus :",
          error
        );

        setError(
          "Impossible de charger les contenus."
        );
      } finally {
        setLoading(false);
      }
    }

    async function loadRss() {
      try {
        const data = await getRss();

        const feeds = Array.isArray(
          data?.feeds
        )
          ? data.feeds
          : [];

        const items = Array.isArray(
          data?.items
        )
          ? data.items
          : [];

        // Seules les sources non masquées
        // alimentent le flux RSS affiché.
        const onlineFeeds = feeds.filter(
          (feed) =>
            feed.online !== false
        );

        // On conserve uniquement les publications
        // provenant d'une source actuellement en ligne.
        const visibleItems = items.filter(
          (item) =>
            onlineFeeds.some(
              (feed) =>
                feed.name === item.source
            )
        );

        setRssItems(visibleItems);
      } catch (error) {
        console.error(
          "Erreur lors du chargement du flux RSS :",
          error
        );

        setRssError(
          "Impossible de charger le flux RSS."
        );
      }
    }

    async function loadMembers() {
      try {
        const data = await getMembers();

        const visibleMembers = (
          Array.isArray(data)
            ? data
            : []
        ).filter(
          (member) =>
            !member.softDelete
        );

        setMembers(visibleMembers);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des membres :",
          error
        );

        setMembers([]);
      }
    }

    loadContents();
    loadRss();
    loadMembers();
  }, []);

  // =========================
  // Mesurer la hauteur du featured
  // =========================

  useEffect(() => {
    if (!featuredRef.current) {
      return;
    }

    const element =
      featuredRef.current;

    function updateRssHeight() {
      setRssHeight(
        element.offsetHeight
      );
    }

    updateRssHeight();

    const resizeObserver =
      new ResizeObserver(() => {
        updateRssHeight();
      });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [featuredContent]);

  // =========================
  // Image contenu
  // =========================

  function getContentImage(image) {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${baseURL}/data${image}`;
  }

  // =========================
  // Date RSS
  // =========================

  function formatRssDate(date) {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }

  // =========================
  // Texte RSS
  // =========================

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

  // =========================
  // Trouver un membre par auteur
  // =========================

  function getAuthorMember(author) {
    if (!author) {
      return null;
    }

    const normalizedAuthor =
      normalize(author);

    return (
      members.find(
        (member) =>
          normalize(member.pseudo) ===
          normalizedAuthor
      ) || null
    );
  }

  // =========================
  // Lien vers le membre
  // =========================

  function renderAuthor(author) {
    if (!author) {
      return null;
    }

    const authorMember =
      getAuthorMember(author);

    if (!authorMember) {
      return (
        <span>
          {author}
        </span>
      );
    }

    const slugSource =
      authorMember.pseudo ||
      authorMember.nom;

    const memberSlug =
      createMemberSlug(
        slugSource
      );

    if (!memberSlug) {
      return (
        <span>
          {author}
        </span>
      );
    }

    return (
      <Link
        to={`/Members/${memberSlug}`}
        className="content-author-link"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {authorMember.pseudo}
      </Link>
    );
  }

  // =========================
  // Chargement
  // =========================

  if (loading) {
    return (
      <>
        <Header />

        <main className="main-content">
          <h1 className="banner">
            Une sélection des contenus de nos
            membres
          </h1>

          <div className="content">
            <p>
              Chargement des contenus...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // Erreur
  // =========================

  if (error) {
    return (
      <>
        <Header />

        <main className="main-content">
          <h1 className="banner">
            Une sélection des contenus de nos
            membres
          </h1>

          <div className="content">
            <p>{error}</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // Affichage
  // =========================

  return (
    <>
      <Header />

      <main className="main-content">

        <h1 className="banner">
          Une sélection des contenus de nos
          membres
        </h1>

        {/* =================================
            FEATURED + RSS
            ================================= */}

        <div className="content-featured-layout">

          {/* ===============================
              FLUX RSS
              =============================== */}

          <aside
            className="content-rss"
            style={
              rssHeight
                ? {
                    height: `${rssHeight}px`,
                  }
                : undefined
            }
          >
            <div className="rss-container">

              <h2>
                Actualités des membres
              </h2>

              {rssError && (
                <p className="rss-error">
                  {rssError}
                </p>
              )}

              {!rssError &&
                rssItems.length === 0 && (
                  <p className="rss-empty">
                    Aucun article disponible.
                  </p>
                )}

              {!rssError &&
                rssItems.length > 0 && (
                  <div className="rss-list">

                    {rssItems.map(
                      (item, index) => (
                        <article
                          className="rss-item"
                          key={`${
                            item.link ||
                            item.title
                          }-${index}`}
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
                                {getRssText(
                                  item
                                )}
                              </p>
                            </a>
                          ) : (
                            <>
                              <p className="rss-item-source">
                                {item.source}
                              </p>

                              <p className="rss-item-text">
                                {getRssText(
                                  item
                                )}
                              </p>
                            </>
                          )}

                        </article>
                      )
                    )}

                  </div>
                )}

            </div>
          </aside>

          {/* ===============================
              CONTENU MIS EN AVANT
              =============================== */}

          {featuredContent && (
            <article
              className="content-featured"
              ref={featuredRef}
            >

              <a
                className="content-featured-link"
                href={
                  featuredContent.url
                }
                target="_blank"
                rel="noopener noreferrer"
              >

                <div className="content-featured-image">

                  <img
                    src={getContentImage(
                      featuredContent.image
                    )}
                    alt={
                      featuredContent.title
                    }
                  />

                </div>

                <div className="content-featured-info">

                  <h2>
                    {
                      featuredContent.title
                    }
                  </h2>

                  {featuredContent.author && (
                    <p className="content-author">
                      Par{" "}
                      {renderAuthor(
                        featuredContent.author
                      )}
                    </p>
                  )}

                  <p className="content-featured-description">
                    {
                      featuredContent.description
                    }
                  </p>

                </div>

              </a>

            </article>
          )}

        </div>

        {/* =================================
            CONTENUS NON FEATURED
            ================================= */}

        <section className="content-grid">

          {contents
            .filter(
              (content) =>
                content.featured !== true
            )
            .map((content) => (

              <article
                className="content-card"
                key={content.id}
              >

                <a
                  className="content-card-link"
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >

                  <div className="content-card-image">

                    <img
                      src={getContentImage(
                        content.image
                      )}
                      alt={content.title}
                    />

                  </div>

                  <div className="content-card-info">

                    <h2>
                      {content.title}
                    </h2>

                    {content.author && (
                      <p className="content-card-author">
                        Par{" "}
                        {renderAuthor(
                          content.author
                        )}
                      </p>
                    )}

                    <p className="content-card-description">
                      {
                        content.description
                      }
                    </p>

                  </div>

                </a>

              </article>

            ))}

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Content;