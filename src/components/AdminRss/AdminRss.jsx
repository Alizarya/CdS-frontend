import { useEffect, useState } from "react";
import { getRss, addRss, deleteRss } from "../../utils/axiosRss";
import "./AdminRss.css";

function AdminRss() {
  const [items, setItems] = useState([]);
  const [feeds, setFeeds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    url: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadRss() {
    try {
      setLoading(true);
      setError("");

      const data = await getRss();

      setItems(Array.isArray(data?.items) ? data.items : []);
      setFeeds(Array.isArray(data?.feeds) ? data.feeds : []);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer le flux RSS.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRss();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const url = form.url.trim();

    if (!name || !url) {
      setError("Le nom et l'URL sont obligatoires.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await addRss({
        name,
        url,
      });

      setForm({
        name: "",
        url: "",
      });

      await loadRss();
    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Impossible d'ajouter ce flux RSS.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(feed) {
    const confirmed = window.confirm(
      `Supprimer le flux « ${feed.name} » ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(feed.id);
      setError("");

      await deleteRss(feed.id);

      await loadRss();
    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Impossible de supprimer ce flux RSS.";

      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(date) {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(parsedDate);
  }

  return (
    <section className="admin-rss">
      <div className="admin-rss-header">
        <h1>Gestion du flux RSS</h1>

        <p>
          Gérez les sources utilisées pour alimenter le flux du site.
        </p>
      </div>

      {error && (
        <div className="admin-rss-error">
          {error}
        </div>
      )}

      {/* ==========================
          FLUX ACTUEL
          ========================== */}

      <section className="admin-rss-card admin-rss-current">
        <div className="admin-rss-section-header">
          <div>
            <h2>Flux actuel</h2>
            <span>
              {items.length} publication
              {items.length > 1 ? "s" : ""}
            </span>
          </div>

          <button
            type="button"
            className="admin-rss-refresh"
            onClick={loadRss}
            disabled={loading}
          >
            {loading ? "Actualisation..." : "Actualiser"}
          </button>
        </div>

        {loading ? (
          <p className="admin-rss-empty">
            Chargement du flux...
          </p>
        ) : items.length === 0 ? (
          <p className="admin-rss-empty">
            Aucun contenu RSS disponible.
          </p>
        ) : (
          <div className="admin-rss-current-list">
            {items.slice(0, 8).map((item, index) => (
              <article
                className="admin-rss-current-item"
                key={`${item.link || item.title}-${index}`}
              >
                <div className="admin-rss-current-source">
                  {item.source || "Source inconnue"}

                  {item.date && (
                    <span>{formatDate(item.date)}</span>
                  )}
                </div>

                {item.title && (
                  <h3>{item.title}</h3>
                )}

                {item.content && (
                  <p>{item.content}</p>
                )}

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir la publication
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ==========================
          SOURCES + AJOUT
          ========================== */}

      <div className="admin-rss-management">

        {/* ==========================
            SOURCES PRÉSENTES
            ========================== */}

        <section className="admin-rss-card admin-rss-sources-card">
          <div className="admin-rss-section-header">
            <div>
              <h2>Sources présentes</h2>

              <span>
                {feeds.length} source
                {feeds.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {feeds.length === 0 ? (
            <p className="admin-rss-empty">
              Aucune source RSS configurée.
            </p>
          ) : (
            <div className="admin-rss-sources-list">
              {feeds.map((feed) => (
<div className="admin-rss-source">
  <div className="admin-rss-source-content">
    <strong>{feed.name}</strong>

    <a
      href={feed.url}
      target="_blank"
      rel="noopener noreferrer"
      className="admin-rss-source-url"
    >
      {feed.url}
    </a>

    <div
      className={`admin-rss-status ${
        feed.status === "ok"
          ? "admin-rss-status-ok"
          : "admin-rss-status-error"
      }`}
    >
      <span className="admin-rss-status-dot">
        ●
      </span>

      {feed.status === "ok"
        ? "Flux OK"
        : "Flux inaccessible ou URL invalide"}
    </div>

    {feed.status === "error" && feed.error && (
      <div className="admin-rss-error-details">
        {feed.error}
      </div>
    )}
  </div>

  <button
    type="button"
    className="admin-rss-delete"
    onClick={() => handleDelete(feed)}
    disabled={deletingId === feed.id}
  >
    {deletingId === feed.id
      ? "Suppression..."
      : "Supprimer"}
  </button>
</div>
              ))}
            </div>
          )}
        </section>

        {/* ==========================
            COLONNE DROITE
            ========================== */}

        <aside className="admin-rss-side">

          {/* AJOUTER UNE SOURCE */}

          <section className="admin-rss-card">
            <div className="admin-rss-section-header">
              <div>
                <h2>Ajouter une source</h2>
              </div>
            </div>

            <form
              className="admin-rss-form"
              onSubmit={handleSubmit}
            >
              <label>
                Nom de la source

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="Ex. Café des sciences - Bluesky"
                  disabled={submitting}
                />
              </label>

              <label>
                URL du flux RSS

                <input
                  type="url"
                  value={form.url}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      url: event.target.value,
                    })
                  }
                  placeholder="https://..."
                  disabled={submitting}
                />
              </label>

              <button
                type="submit"
                className="admin-rss-submit"
                disabled={submitting}
              >
                {submitting
                  ? "Ajout..."
                  : "Ajouter la source"}
              </button>
            </form>
          </section>

          {/* COMMENT TROUVER UN FLUX */}

          <section className="admin-rss-card admin-rss-help">
            <h2>Comment trouver un flux RSS ?</h2>

            <div className="admin-rss-help-item">
              <strong>Bluesky</strong>

              <p>
                Pour un profil Bluesky, ajoute généralement
                <code>/rss</code> à l'URL du profil.
              </p>

              <p className="admin-rss-example">
                Exemple :
                <br />
                <code>
                  https://bsky.app/profile/nom/rss
                </code>
              </p>
            </div>

            <div className="admin-rss-help-item">
              <strong>YouTube</strong>

              <p>
                Une URL classique de chaîne YouTube n'est pas
                automatiquement un flux RSS. Il faut utiliser
                une URL RSS compatible avec la chaîne.
              </p>
            </div>

            <div className="admin-rss-help-item">
              <strong>LinkedIn</strong>

              <p>
                Une URL de profil LinkedIn classique n'est pas
                un flux RSS. Il faut disposer d'un flux RSS
                fourni par le site ou par un service intermédiaire.
              </p>
            </div>

            <div className="admin-rss-help-item">
              <strong>Instagram</strong>

              <p>
                Une URL de profil Instagram classique n'est pas
                un flux RSS. Il faut utiliser une source RSS
                compatible.
              </p>
            </div>

            <div className="admin-rss-help-item">
              <strong>Autres sites</strong>

              <p>
                Cherche notamment une URL contenant
                <code>/rss</code>, <code>/feed</code> ou
                <code>.xml</code>.
              </p>
            </div>
          </section>

        </aside>
      </div>
    </section>
  );
}

export default AdminRss;