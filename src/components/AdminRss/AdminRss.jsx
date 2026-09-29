import { useEffect, useState } from "react";

import {
  getRss,
  addRss,
  updateRss,
  deleteRss,
} from "../../utils/axiosRss";

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
  const [updatingId, setUpdatingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    url: "",
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");

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

  function handleEditStart(feed) {
    setError("");

    setEditingId(feed.id);

    setEditForm({
      name: feed.name || "",
      url: feed.url || "",
    });
  }

  function handleEditCancel() {
    setEditingId(null);

    setEditForm({
      name: "",
      url: "",
    });
  }

  async function handleEditSave(feed) {
    const name = editForm.name.trim();
    const url = editForm.url.trim();

    if (!name || !url) {
      setError("Le nom et l'URL sont obligatoires.");
      return;
    }

    try {
      setUpdatingId(feed.id);
      setError("");

      await updateRss(feed.id, {
        name,
        url,
      });

      handleEditCancel();

      await loadRss();
    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Impossible de modifier ce flux RSS.";

      setError(message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleToggleOnline(feed) {
    try {
      setUpdatingId(feed.id);
      setError("");

      await updateRss(feed.id, {
        online: feed.online === false,
      });

      await loadRss();
    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Impossible de modifier l'état de ce flux RSS.";

      setError(message);
    } finally {
      setUpdatingId(null);
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

      if (editingId === feed.id) {
        handleEditCancel();
      }

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

  function getFeedType(feed) {
    const name = (feed.name || "").toLowerCase();
    const url = (feed.url || "").toLowerCase();

    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be")
    ) {
      return "Youtube";
    }

    if (url.includes("bsky.app")) {
      return "Bluesky";
    }

    if (
      url.includes("instagram.com") ||
      name.includes("instagram")
    ) {
      return "Instagram";
    }

    if (
      url.includes("tiktok.com") ||
      name.includes("tiktok")
    ) {
      return "Tiktok";
    }

    if (
      url.includes("podcast") ||
      name.includes("podcast")
    ) {
      return "Podcast";
    }

    if (
      url.includes("blog") ||
      name.includes("blog")
    ) {
      return "Blog";
    }

    if (
      url.includes("rss") ||
      url.includes("feed") ||
      url.includes(".xml")
    ) {
      return "Autre";
    }

    return "Site";
  }

  /*
   * Sources visibles sur le site.
   *
   * Les sources masquées restent présentes dans
   * "Sources présentes", mais leurs publications
   * ne doivent pas apparaître dans "Flux actuel".
   */
  const onlineFeeds = feeds.filter(
    (feed) => feed.online !== false
  );

  /*
   * On conserve uniquement les publications provenant
   * d'une source actuellement en ligne.
   */
  const currentItems = items.filter((item) =>
    onlineFeeds.some(
      (feed) => feed.name === item.source
    )
  );

  /*
   * Recherche et filtre des sources dans le panneau
   * d'administration.
   *
   * La recherche porte à la fois sur le nom et l'URL.
   */
  const filteredFeeds = feeds.filter((feed) => {
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      (feed.name || "")
        .toLowerCase()
        .includes(searchValue) ||
      (feed.url || "")
        .toLowerCase()
        .includes(searchValue);

    const matchesType =
      typeFilter === "Tous" ||
      getFeedType(feed) === typeFilter;

    return matchesSearch && matchesType;
  });

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
              {currentItems.length} publication
              {currentItems.length > 1 ? "s" : ""}
            </span>
          </div>

          <button
            type="button"
            className="admin-rss-refresh"
            onClick={loadRss}
            disabled={loading}
          >
            {loading
              ? "Actualisation..."
              : "Actualiser"}
          </button>
        </div>

        {loading ? (
          <p className="admin-rss-empty">
            Chargement du flux...
          </p>
        ) : currentItems.length === 0 ? (
          <p className="admin-rss-empty">
            Aucun contenu RSS disponible.
          </p>
        ) : (
          <div className="admin-rss-current-list">
            {currentItems
              .slice(0, 8)
              .map((item, index) => (
                <article
                  className="admin-rss-current-item"
                  key={`${item.link || item.title}-${index}`}
                >
                  <div className="admin-rss-current-source">
                    {item.source || "Source inconnue"}

                    {item.date && (
                      <span>
                        {formatDate(item.date)}
                      </span>
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
                {filteredFeeds.length} source
                {filteredFeeds.length > 1 ? "s" : ""}
                {filteredFeeds.length !== feeds.length &&
                  ` sur ${feeds.length}`}
              </span>
            </div>
          </div>

          <div className="admin-rss-filters">
            <input
              type="search"
              className="admin-rss-search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Rechercher une source..."
            />

            <select
              className="admin-rss-type-filter"
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
            >
              <option value="Tous">Tous</option>
              <option value="Podcast">Podcast</option>
              <option value="Youtube">Youtube</option>
              <option value="Bluesky">Bluesky</option>
              <option value="Blog">Blog</option>
              <option value="Site">Site</option>
              <option value="Instagram">Instagram</option>
              <option value="Tiktok">Tiktok</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {feeds.length === 0 ? (
            <p className="admin-rss-empty">
              Aucune source RSS configurée.
            </p>
          ) : filteredFeeds.length === 0 ? (
            <p className="admin-rss-empty">
              Aucune source ne correspond à votre recherche.
            </p>
          ) : (
            <div className="admin-rss-sources-list">
              {filteredFeeds.map((feed) => {
                const isEditing =
                  editingId === feed.id;

                const isUpdating =
                  updatingId === feed.id;

                const isDeleting =
                  deletingId === feed.id;

                return (
                  <div
                    className={`admin-rss-source ${
                      feed.online === false
                        ? "admin-rss-source-offline"
                        : ""
                    }`}
                    key={feed.id}
                  >
                    {isEditing ? (
                      <div className="admin-rss-source-edit">
                        <label>
                          Nom de la source

                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                name: event.target.value,
                              })
                            }
                            disabled={isUpdating}
                          />
                        </label>

                        <label>
                          URL du flux RSS

                          <input
                            type="url"
                            value={editForm.url}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                url: event.target.value,
                              })
                            }
                            disabled={isUpdating}
                          />
                        </label>

                        <div className="admin-rss-source-actions">
                          <button
                            type="button"
                            className="admin-rss-save"
                            onClick={() =>
                              handleEditSave(feed)
                            }
                            disabled={isUpdating}
                          >
                            {isUpdating
                              ? "Enregistrement..."
                              : "Enregistrer"}
                          </button>

                          <button
                            type="button"
                            className="admin-rss-cancel"
                            onClick={handleEditCancel}
                            disabled={isUpdating}
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="admin-rss-source-content">
                          <div className="admin-rss-source-title">
                            <strong>
                              {feed.name}
                            </strong>

                            <span
                              className={`admin-rss-visibility ${
                                feed.online === false
                                  ? "admin-rss-visibility-hidden"
                                  : "admin-rss-visibility-online"
                              }`}
                            >
                              <span className="admin-rss-visibility-dot">
                                ●
                              </span>

                              {feed.online === false
                                ? "MASQUÉ"
                                : "EN LIGNE"}
                            </span>
                          </div>

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

                          {feed.status === "error" &&
                            feed.error && (
                              <div className="admin-rss-error-details">
                                {feed.error}
                              </div>
                            )}
                        </div>

                        <div className="admin-rss-source-actions">
                          <button
                            type="button"
                            className="admin-rss-edit"
                            onClick={() =>
                              handleEditStart(feed)
                            }
                            disabled={
                              isUpdating ||
                              isDeleting
                            }
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            className={
                              feed.online === false
                                ? "admin-rss-online"
                                : "admin-rss-offline"
                            }
                            onClick={() =>
                              handleToggleOnline(feed)
                            }
                            disabled={
                              isUpdating ||
                              isDeleting
                            }
                          >
                            {isUpdating
                              ? "Modification..."
                              : feed.online === false
                              ? "Mettre en ligne"
                              : "Masquer"}
                          </button>

                          <button
                            type="button"
                            className="admin-rss-delete"
                            onClick={() =>
                              handleDelete(feed)
                            }
                            disabled={
                              isDeleting ||
                              isUpdating
                            }
                          >
                            {isDeleting
                              ? "Suppression..."
                              : "Supprimer"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
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