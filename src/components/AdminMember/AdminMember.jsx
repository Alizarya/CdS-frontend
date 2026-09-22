import { useEffect, useState, useCallback, useMemo } from "react";
import {
  getMembers,
  deleteMember,
  updateMember,
} from "../../utils/axiosMembers";
import MemberCard from "../Card/CardPrev";
import baseURL from "../../utils/urlApi";
import "./AdminMember.css";

function AdminMember() {
  const getMemberImage = (image) => {
    if (!image) {
      return "https://img.freepik.com/premium-vector/art-illustration_890735-11.jpg?w=740";
    }

    if (image.startsWith("data:image")) {
      return image;
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/public/")) {
      return `${baseURL}${image}`;
    }

    if (image.startsWith("/uploads/")) {
      return `${baseURL}/public${image}`;
    }

    return image;
  };

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modale d'aperçu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewMember, setPreviewMember] = useState(null);

  // Recherche + filtre
  const [searchTerm, setSearchTerm] = useState("");

  // all | visible | hidden | hidden-filled | hidden-empty
  const [filter, setFilter] = useState("all");

  const loadMembers = async () => {
    try {
      const response = await getMembers();
      const list = response?.data ?? response ?? [];

      setMembers(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des membres:",
        error
      );

      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const getDisplayName = (member) => {
    if (member?.pseudo && member.pseudo.trim()) {
      return member.pseudo.trim();
    }

    if (member?.email && member.email.trim()) {
      return member.email.trim();
    }

    return "Utilisateur";
  };

  // ==========================
  // Vérification du contenu
  // ==========================

  const hasNonEmpty = (value) => {
    return (
      typeof value === "string" &&
      value.trim().length > 0
    );
  };

  const hasAnyInfo = (member) => {
    if (
      hasNonEmpty(member?.pseudo) ||
      hasNonEmpty(member?.image) ||
      hasNonEmpty(member?.shortdescription) ||
      hasNonEmpty(member?.description)
    ) {
      return true;
    }

    const hasTags =
      Array.isArray(member?.tags) &&
      member.tags.some((tag) => hasNonEmpty(tag));

    const hasLinks =
      member?.links &&
      typeof member.links === "object"
        ? Object.values(member.links).some((value) =>
            hasNonEmpty(value)
          )
        : false;

    const hasContent =
      Array.isArray(member?.content) &&
      member.content.some((content) =>
        ["title", "link", "image", "description"].some(
          (key) => hasNonEmpty(content?.[key])
        )
      );

    return hasTags || hasLinks || hasContent;
  };

  // ==========================
  // Recherche + filtres
  // ==========================

  const filteredMembers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return members.filter((member) => {
      const visible = !member.softDelete;
      const filled = hasAnyInfo(member);

      const pseudo = (
        member?.pseudo || ""
      ).toLowerCase();

      const nom = (
        member?.nom || ""
      ).toLowerCase();

      const email = (
        member?.email || ""
      ).toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        pseudo.includes(query) ||
        nom.includes(query) ||
        email.includes(query);

      if (!matchesSearch) {
        return false;
      }

      switch (filter) {
        case "visible":
          return visible;

        case "hidden":
          return !visible;

        case "hidden-filled":
          return !visible && filled;

        case "hidden-empty":
          return !visible && !filled;

        case "all":
        default:
          return true;
      }
    });
  }, [members, filter, searchTerm]);

  // ==========================
  // Masquer / remettre en ligne
  // ==========================

  const handleToggleVisibility = async (
    id,
    makeVisible
  ) => {
    const texte = makeVisible
      ? "remettre en ligne"
      : "masquer";

    const ok = window.confirm(
      `Voulez-vous ${texte} ce membre ?`
    );

    if (!ok) {
      return;
    }

    try {
      await updateMember(id, {
        softDelete: !makeVisible,
      });

      setMembers((prev) =>
        prev.map((member) =>
          member._id === id
            ? {
                ...member,
                softDelete: !makeVisible,
              }
            : member
        )
      );

      alert(
        `Le membre a été ${
          makeVisible ? "remis en ligne" : "masqué"
        }.`
      );
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du membre:",
        error
      );

      alert(
        "Une erreur est survenue lors de la mise à jour."
      );
    }
  };

  // ==========================
  // Suppression définitive
  // ==========================

  const handleSupprimer = async (id) => {
    const confirmSupprimer = window.confirm(
      "Êtes-vous sûr de vouloir supprimer définitivement ce membre ?"
    );

    if (!confirmSupprimer) {
      return;
    }

    try {
      await deleteMember(id);

      setMembers((prev) =>
        prev.filter((member) => member._id !== id)
      );

      alert("Le membre a été supprimé.");
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du membre:",
        error
      );

      alert(
        "Une erreur est survenue lors de la suppression."
      );
    }
  };

  // ==========================
  // Aperçu
  // ==========================

  const openPreview = (member) => {
    setPreviewMember(member);
    setIsModalOpen(true);
  };

  const closePreview = useCallback(() => {
    setIsModalOpen(false);
    setPreviewMember(null);
  }, []);

  // Fermer avec Échap
  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closePreview();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
    };
  }, [isModalOpen, closePreview]);

  // Bloquer le scroll derrière la modale
  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isModalOpen]);

  return (
    <section className="admin-member">
      <div className="admin-member-header">
        <h1>Gestion des membres</h1>

        <p>
          Gérez les profils des membres, leur visibilité
          et leur présence sur le site.
        </p>
      </div>

      {/* ==========================
          RECHERCHE
          ========================== */}

      <div className="admin-member-toolbar">
        <div className="admin-member-search">
          <label htmlFor="member-search">
            Rechercher
          </label>

          <input
            id="member-search"
            type="search"
            placeholder="Pseudo, nom ou email…"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="admin-member-filter">
          <label htmlFor="member-filter">
            Filtrer
          </label>

          <select
            id="member-filter"
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value)
            }
          >
            <option value="all">
              Tous
            </option>

            <option value="visible">
              En ligne
            </option>

            <option value="hidden">
              Masqués (tous)
            </option>

            <option value="hidden-filled">
              Masqués — complétés
            </option>

            <option value="hidden-empty">
              Masqués — vides
            </option>
          </select>
        </div>
      </div>

      {/* ==========================
          LISTE
          ========================== */}

      {loading ? (
        <p className="admin-member-loading">
          Chargement...
        </p>
      ) : filteredMembers.length > 0 ? (
        <div className="admin-member-list">
          {filteredMembers.map((member) => {
            const visible = !member.softDelete;

            const displayName =
              getDisplayName(member);

            const displayEmail =
              member?.email &&
              member.email.trim()
                ? member.email.trim()
                : "—";

            return (
              <article
                key={member._id}
                className="admin-member-card"
              >
                {/* Avatar */}

                <img
  src={getMemberImage(member.image)}
  alt={displayName}
  className="admin-member-avatar"
/>
                {/* Nom + email */}

                <div className="admin-member-identity">
                  <div className="admin-member-name">
                    {displayName}
                  </div>

                  <div className="admin-member-email">
                    {displayEmail}
                  </div>
                </div>

                {/* État */}

                <div className="admin-member-status">
                  <span
                    className={
                      visible
                        ? "admin-member-status-online"
                        : "admin-member-status-hidden"
                    }
                  >
                    {visible
                      ? "En ligne"
                      : "Masqué"}
                  </span>
                </div>

                {/* Actions */}

                <div className="admin-member-actions">
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Fonction bientôt disponible"
                      )
                    }
                    title="Modifier"
                  >
                    Modifier
                  </button>

                  {visible ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleVisibility(
                          member._id,
                          false
                        )
                      }
                      title="Masquer"
                    >
                      Masquer
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleVisibility(
                          member._id,
                          true
                        )
                      }
                      title="Remettre en ligne"
                    >
                      Remettre en ligne
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleSupprimer(member._id)
                    }
                    title="Supprimer définitivement"
                  >
                    Supprimer
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openPreview(member)
                    }
                    title="Voir le profil"
                  >
                    Voir le profil
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="admin-member-empty">
          Aucun membre pour ce filtre / recherche
        </div>
      )}

      {/* ==========================
          MODALE APERÇU
          ========================== */}

      {isModalOpen && previewMember && (
        <div
          className="admin-member-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Aperçu du profil"
          onClick={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closePreview();
            }
          }}
        >
          <div className="admin-member-modal">
            <div className="admin-member-modal-header">
              <h2>
                {getDisplayName(previewMember)}
                {" — Aperçu de la carte"}
              </h2>

              <button
                type="button"
                onClick={closePreview}
                aria-label="Fermer"
                className="admin-member-modal-close"
              >
                ×
              </button>
            </div>

            <div className="admin-member-modal-content">
              <MemberCard
                member={previewMember}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


export default AdminMember;