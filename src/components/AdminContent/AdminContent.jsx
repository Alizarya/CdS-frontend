import { useEffect, useState } from "react";

import {
  getContents,
  createContent,
  deleteContent,
  updateContent,
} from "../../utils/axiosContent";

import baseURL from "../../utils/urlApi";

import "./AdminContent.css";

function AdminContent() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    author: "",
    url: "",
    date: "",
    featured: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [reordering, setReordering] = useState(false);

  // =========================
  // MODIFICATION
  // =========================

  const [editingContent, setEditingContent] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    image: "",
    author: "",
    url: "",
    date: "",
    featured: false,
  });

  const [updating, setUpdating] = useState(false);

  // =========================
  // Récupérer les contenus
  // =========================

  async function loadContents() {
    try {
      setLoading(true);
      setError("");

      const data = await getContents();

      const sortedContents = [...(data.contents || [])].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );

      setContents(sortedContents);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des contenus :",
        error
      );

      setError("Impossible de récupérer les contenus.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContents();
  }, []);

  // =========================
  // Dates
  // =========================

  function formatDate(date) {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(parsedDate);
  }

  // =========================
  // Gestion du formulaire
  // =========================

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // =========================
  // Gestion de l'image
  // =========================

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previousForm) => ({
        ...previousForm,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  // =========================
  // Ajouter un contenu
  // =========================

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const newContent = {
        title: form.title,
        description: form.description,
        image: form.image,
        author: form.author,
        url: form.url,
        date: form.date,
        featured: form.featured,
      };

      const createdContent = await createContent(newContent);

      setContents((previousContents) =>
        [...previousContents, createdContent].sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        )
      );

      setForm({
        title: "",
        description: "",
        image: "",
        author: "",
        url: "",
        date: "",
        featured: false,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la création du contenu :",
        error
      );

      setError("Impossible de créer le contenu.");
    } finally {
      setSubmitting(false);
    }
  }

  // =========================
  // Supprimer un contenu
  // =========================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce contenu ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteContent(id);

      await loadContents();
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du contenu :",
        error
      );

      setError("Impossible de supprimer le contenu.");
    }
  }

  // =========================
  // Ouvrir la modification
  // =========================

  function handleEdit(content) {
    setEditingContent(content);

    setEditForm({
      title: content.title || "",
      description: content.description || "",
      image: "",
      author: content.author || "",
      url: content.url || "",
      date: content.date || "",
      featured: content.featured === true,
    });
  }

  // =========================
  // Fermer la modale
  // =========================

  function handleCloseEdit() {
    if (updating) {
      return;
    }

    setEditingContent(null);

    setEditForm({
      title: "",
      description: "",
      image: "",
      author: "",
      url: "",
      date: "",
      featured: false,
    });
  }

  // =========================
  // Formulaire modification
  // =========================

  function handleEditChange(event) {
    const { name, value, type, checked } = event.target;

    setEditForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // =========================
  // Image modification
  // =========================

  function handleEditImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setEditForm((previousForm) => ({
        ...previousForm,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  // =========================
  // Enregistrer modification
  // =========================

  async function handleUpdate(event) {
    event.preventDefault();

    if (!editingContent) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const contentData = {
        title: editForm.title,
        description: editForm.description,
        author: editForm.author,
        url: editForm.url,
        date: editForm.date,
        featured: editForm.featured,
      };

      // On envoie l'image uniquement si elle a été remplacée.
      if (editForm.image) {
        contentData.image = editForm.image;
      }

      const updatedContent = await updateContent(
        editingContent.id,
        contentData
      );

      setContents((previousContents) =>
        previousContents
          .map((content) =>
            content.id === updatedContent.id
              ? updatedContent
              : content
          )
          .sort(
            (a, b) => (a.order || 0) - (b.order || 0)
          )
      );

      handleCloseEdit();
    } catch (error) {
      console.error(
        "Erreur lors de la modification du contenu :",
        error
      );

      setError("Impossible de modifier le contenu.");
    } finally {
      setUpdating(false);
    }
  }

  // =========================
  // Drag & Drop
  // =========================

  function handleDragStart(event, id) {
    if (reordering) {
      event.preventDefault();
      return;
    }

    setDraggedId(id);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/plain",
      String(id)
    );
  }

  function handleDragOver(event, id) {
    event.preventDefault();

    if (draggedId === null || draggedId === id) {
      return;
    }

    setDragOverId(id);

    event.dataTransfer.dropEffect = "move";
  }

  async function handleDrop(event, targetId) {
    event.preventDefault();

    if (
      draggedId === null ||
      draggedId === targetId ||
      reordering
    ) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const oldContents = [...contents];

    const draggedIndex = oldContents.findIndex(
      (content) => content.id === draggedId
    );

    const targetIndex = oldContents.findIndex(
      (content) => content.id === targetId
    );

    if (
      draggedIndex === -1 ||
      targetIndex === -1
    ) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const newContents = [...oldContents];

    const [draggedContent] = newContents.splice(
      draggedIndex,
      1
    );

    newContents.splice(
      targetIndex,
      0,
      draggedContent
    );

    const reorderedContents = newContents.map(
      (content, index) => ({
        ...content,
        order: index + 1,
      })
    );

    setContents(reorderedContents);

    setDraggedId(null);
    setDragOverId(null);
    setReordering(true);
    setError("");

    try {
      const newOrder =
        reorderedContents.findIndex(
          (content) => content.id === draggedId
        ) + 1;

      await updateContent(draggedId, {
        order: newOrder,
      });

      await loadContents();
    } catch (error) {
      console.error(
        "Erreur lors du réordonnement du contenu :",
        error
      );

      setError(
        "Impossible de modifier l'ordre des contenus."
      );

      await loadContents();
    } finally {
      setReordering(false);
    }
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  // =========================
  // URL de l'image
  // =========================

  function getContentImage(image) {
    if (!image) {
      return null;
    }

    if (image.startsWith("data:image")) {
      return image;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${baseURL}/data${image}`;
  }

  // =========================
  // Chargement
  // =========================

  if (loading) {
    return (
      <section className="admin-content">
        <h1>Gestion des contenus</h1>

        <p>Chargement des contenus...</p>
      </section>
    );
  }

  // =========================
  // Affichage
  // =========================

  return (
    <section className="admin-content">
      <h1>Gestion des contenus</h1>

      {error && (
        <p className="admin-content-error">
          {error}
        </p>
      )}

      <div className="admin-content-layout">

        {/* =========================
            CONTENUS EXISTANTS
        ========================= */}

        <div className="admin-content-list-section">
          <h2>Contenus en cours</h2>

          <p className="admin-content-drag-help">
            Fais glisser les cartes pour modifier
            leur ordre.
          </p>

          {contents.length === 0 ? (
            <p>Aucun contenu actuellement.</p>
          ) : (
            <div className="admin-content-list">
              {contents.map((content, index) => (
                <article
                  key={content.id}
                  className={[
                    "admin-content-card",
                    draggedId === content.id
                      ? "admin-content-card-dragging"
                      : "",
                    dragOverId === content.id
                      ? "admin-content-card-drag-over"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  draggable={!reordering}
                  onDragStart={(event) =>
                    handleDragStart(
                      event,
                      content.id
                    )
                  }
                  onDragOver={(event) =>
                    handleDragOver(
                      event,
                      content.id
                    )
                  }
                  onDrop={(event) =>
                    handleDrop(
                      event,
                      content.id
                    )
                  }
                  onDragEnd={handleDragEnd}
                >
                  <div className="admin-content-drag-handle">
                    ☰
                  </div>

                  <div className="admin-content-order">
                    {index + 1}
                  </div>

                  {content.image && (
                    <img
                      src={getContentImage(
                        content.image
                      )}
                      alt={content.title}
                      className="admin-content-card-image"
                    />
                  )}

                  <div className="admin-content-card-body">
                    <div className="admin-content-card-header">
                      <h3>{content.title}</h3>

                      {content.featured && (
                        <span className="admin-content-featured">
                          Mis en avant
                        </span>
                      )}
                    </div>

                    {content.author && (
                      <p className="admin-content-author">
                        {content.author}
                      </p>
                    )}

                    {content.description && (
                      <p className="admin-content-description">
                        {content.description}
                      </p>
                    )}

                    {content.date && (
                      <p className="admin-content-date">
                        {formatDate(content.date)}
                      </p>
                    )}

                    {content.url && (
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-content-link"
                      >
                        Voir le contenu
                      </a>
                    )}

                    <div className="admin-content-actions">
                      <button
                        type="button"
                        className="admin-content-edit"
                        onClick={() =>
                          handleEdit(content)
                        }
                        disabled={reordering}
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        className="admin-content-delete"
                        onClick={() =>
                          handleDelete(
                            content.id
                          )
                        }
                        disabled={reordering}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* =========================
            FORMULAIRE AJOUT
        ========================= */}

        <div className="admin-content-form-section">
          <h2>Ajouter un contenu</h2>

          <form
            className="admin-content-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-content-field">
              <label htmlFor="title">
                Titre
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="admin-content-field">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="admin-content-field">
              <label htmlFor="author">
                Auteur
              </label>

              <input
                id="author"
                name="author"
                type="text"
                value={form.author}
                onChange={handleChange}
              />
            </div>

            <div className="admin-content-field">
              <label htmlFor="url">
                URL
              </label>

              <input
                id="url"
                name="url"
                type="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="admin-content-field">
              <label htmlFor="date">
                Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="admin-content-field">
              <label htmlFor="image">
                Image
              </label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {form.image && (
              <div className="admin-content-image-preview">
                <img
                  src={form.image}
                  alt="Aperçu"
                />
              </div>
            )}

            <label className="admin-content-checkbox">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              <span>
                Mettre en avant
              </span>
            </label>

            <button
              type="submit"
              className="admin-content-submit"
              disabled={submitting}
            >
              {submitting
                ? "Ajout en cours..."
                : "Ajouter le contenu"}
            </button>
          </form>
        </div>
      </div>

      {/* =========================
          MODALE MODIFICATION
      ========================= */}

      {editingContent && (
        <div
          className="admin-content-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              handleCloseEdit();
            }
          }}
        >
          <div className="admin-content-modal">
            <div className="admin-content-modal-header">
              <h2>Modifier le contenu</h2>

              <button
                type="button"
                className="admin-content-modal-close"
                onClick={handleCloseEdit}
                disabled={updating}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <form
              className="admin-content-form"
              onSubmit={handleUpdate}
            >
              <div className="admin-content-field">
                <label htmlFor="edit-title">
                  Titre
                </label>

                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  value={editForm.title}
                  onChange={handleEditChange}
                />
              </div>

              <div className="admin-content-field">
                <label htmlFor="edit-description">
                  Description
                </label>

                <textarea
                  id="edit-description"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="5"
                />
              </div>

              <div className="admin-content-field">
                <label htmlFor="edit-author">
                  Auteur
                </label>

                <input
                  id="edit-author"
                  name="author"
                  type="text"
                  value={editForm.author}
                  onChange={handleEditChange}
                />
              </div>

              <div className="admin-content-field">
                <label htmlFor="edit-url">
                  URL
                </label>

                <input
                  id="edit-url"
                  name="url"
                  type="url"
                  value={editForm.url}
                  onChange={handleEditChange}
                  placeholder="https://..."
                />
              </div>

              <div className="admin-content-field">
                <label htmlFor="edit-date">
                  Date
                </label>

                <input
                  id="edit-date"
                  name="date"
                  type="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                />
              </div>

              {editingContent.image && (
                <div className="admin-content-current-image">
                  <p>Image actuelle</p>

                  <img
                    src={getContentImage(
                      editingContent.image
                    )}
                    alt={editingContent.title}
                  />
                </div>
              )}

              <div className="admin-content-field">
                <label htmlFor="edit-image">
                  Remplacer l'image
                </label>

                <input
                  id="edit-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleEditImageChange
                  }
                />
              </div>

              {editForm.image && (
                <div className="admin-content-image-preview">
                  <img
                    src={editForm.image}
                    alt="Nouvelle image"
                  />
                </div>
              )}

              <label className="admin-content-checkbox">
                <input
                  type="checkbox"
                  name="featured"
                  checked={editForm.featured}
                  onChange={handleEditChange}
                />

                <span>
                  Mettre en avant
                </span>
              </label>

              <div className="admin-content-modal-actions">
                <button
                  type="button"
                  className="admin-content-cancel"
                  onClick={handleCloseEdit}
                  disabled={updating}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="admin-content-submit"
                  disabled={updating}
                >
                  {updating
                    ? "Enregistrement..."
                    : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminContent;