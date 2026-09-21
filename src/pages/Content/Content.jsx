import React, { useEffect, useState } from "react";

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

import baseURL from "../../utils/urlApi";

function Content() {
  const [featuredContent, setFeaturedContent] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadContents() {
      try {
        const featured = await getFeaturedContent();
        const allContents = await getContents();

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

    loadContents();
  }, []);

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

        {/* Featured + futur flux RSS */}
        <div className="content-featured-layout">

          {/* Espace réservé au futur flux RSS */}
          <aside className="content-rss">
            <div className="rss-placeholder">
              Flux RSS des membres
            </div>
          </aside>

          {/* Contenu mis en avant */}
          {featuredContent && (
            <article className="content-featured">

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