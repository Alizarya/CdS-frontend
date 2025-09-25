// src/pages/Dashboard/DashboardAdmin.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { getMembers, deleteMember, updateMember } from "../../utils/axiosMembers";
import MemberCard from "../../components/Card/CardPrev";

function DashboardAdmin() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modale d'aperçu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewMember, setPreviewMember] = useState(null);

  // Recherche + Filtre
  const [searchTerm, setSearchTerm] = useState("");
  // all | visible | hidden | hidden-filled | hidden-empty
  const [filter, setFilter] = useState("all");

  const loadMembers = async () => {
    try {
      const response = await getMembers();
      const list = response?.data ?? response ?? [];
      setMembers(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Erreur lors de la récupération des membres:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const getDisplayName = (member) => {
    if (member?.pseudo && member.pseudo.trim()) return member.pseudo.trim();
    if (member?.email && member.email.trim()) return member.email.trim();
    return "Utilisateur";
  };

  // Helpers "rempli ?"
  const hasNonEmpty = (v) => typeof v === "string" && v.trim().length > 0;

  const hasAnyInfo = (m) => {
    if (
      hasNonEmpty(m?.pseudo) ||
      hasNonEmpty(m?.image) ||
      hasNonEmpty(m?.shortdescription) ||
      hasNonEmpty(m?.description)
    ) {
      return true;
    }
    const hasTags = Array.isArray(m?.tags) && m.tags.some((t) => hasNonEmpty(t));
    const hasLinks =
      m?.links && typeof m.links === "object"
        ? Object.values(m.links).some((v) => hasNonEmpty(v))
        : false;
    const hasContent =
      Array.isArray(m?.content) &&
      m.content.some((c) =>
        ["title", "link", "image", "description"].some((k) => hasNonEmpty(c?.[k]))
      );
    return hasTags || hasLinks || hasContent;
  };

  // Filtrage combiné: recherche + état
  const filteredMembers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return members.filter((m) => {
      const visible = !m.softDelete;
      const filled = hasAnyInfo(m);

      // 1) Recherche (pseudo || nom || email) contient q
      const pseudo = (m?.pseudo || "").toLowerCase();
      const nom = (m?.nom || "").toLowerCase();
      const email = (m?.email || "").toLowerCase();

      const matchesSearch =
        q.length === 0 || pseudo.includes(q) || nom.includes(q) || email.includes(q);
      if (!matchesSearch) return false;

      // 2) Filtre d'état
      switch (filter) {
        case "visible":
          return visible; // pas de "visible-empty"
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

  // Masquer / Remettre en ligne
  const handleToggleVisibility = async (id, makeVisible) => {
    const texte = makeVisible ? "remettre en ligne" : "masquer";
    const ok = window.confirm(`Voulez-vous ${texte} ce membre ?`);
    if (!ok) return;

    try {
      await updateMember(id, { softDelete: !makeVisible });
      setMembers((prev) =>
        prev.map((m) => (m._id === id ? { ...m, softDelete: !makeVisible } : m))
      );
      alert(`Le membre a été ${makeVisible ? "remis en ligne" : "masqué"}.`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du membre:", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  // Supprimer définitivement
  const handleSupprimer = async (id) => {
    const confirmSupprimer = window.confirm(
      "Êtes-vous sûr de vouloir supprimer définitivement ce membre ?"
    );
    if (!confirmSupprimer) return;

    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((m) => m._id !== id));
      alert("Le membre a été supprimé.");
    } catch (error) {
      console.error("Erreur lors de la suppression du membre:", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  // Ouvrir / Fermer la modale d’aperçu
  const openPreview = (member) => {
    setPreviewMember(member);
    setIsModalOpen(true);
  };

  const closePreview = useCallback(() => {
    setIsModalOpen(false);
    setPreviewMember(null);
  }, []);

  // Échap pour fermer
  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, closePreview]);

  // Bloquer le scroll en arrière-plan quand la modale est ouverte
  useEffect(() => {
    if (!isModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isModalOpen]);

  return (
    <div>
      <h1>Tableau de bord Admin</h1>
      <p>
        Il est tout moche pour le moment, don't worry, je bosse ça en début d'année 2025
      </p>

      <details open>
        <summary>Gestion des membres</summary>

        {/* Barre de recherche (sous “Gestion des membres”) */}
        <div style={{ margin: "12px 0 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <label htmlFor="search" style={{ alignSelf: "center" }}>
            Rechercher :
          </label>
          <input
            id="search"
            type="search"
            placeholder="Pseudo, nom ou email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "6px 10px", minWidth: 240 }}
          />
        </div>

        {/* Barre de filtres (toujours sous la zone de recherche) */}
        <div style={{ margin: "0 0 16px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <label htmlFor="filter">Filtrer :</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "6px 8px" }}
          >
            <option value="all">Tous</option>
            <option value="visible">En ligne</option>
            <option value="hidden">Masqués (tous)</option>
            <option value="hidden-filled">Masqués — complétés</option>
            <option value="hidden-empty">Masqués — vides</option>
          </select>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div>
            {Array.isArray(filteredMembers) && filteredMembers.length > 0 ? (
              filteredMembers.map((member) => {
                const visible = !member.softDelete;
                const displayName = getDisplayName(member);
                const displayEmail =
                  member?.email && member.email.trim() ? member.email.trim() : "—";

                return (
                  <div
                    key={member._id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: "14px",
                      padding: "12px",
                      border: "1px solid #eee",
                      borderRadius: 8,
                      maxWidth: 520,
                    }}
                  >
                    {/* Avatar */}
                    <img
                      src={
                        member.image
                          ? member.image
                          : "https://img.freepik.com/premium-vector/art-illustration_890735-11.jpg?w=740"
                      }
                      alt={displayName}
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        marginBottom: 6,
                        objectFit: "cover",
                      }}
                    />

                    {/* Nom + email */}
                    <div style={{ textAlign: "center", marginBottom: 6 }}>
                      <div style={{ fontWeight: 600 }}>{displayName}</div>
                      <div style={{ fontSize: 13, color: "#666" }}>{displayEmail}</div>
                    </div>

                    {/* État */}
                    <div style={{ marginBottom: 8 }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          background: visible ? "#e6f7ee" : "#fdecec",
                          color: visible ? "#257a3a" : "#a12020",
                          border: `1px solid ${visible ? "#b9e6cc" : "#f5c2c2"}`,
                        }}
                      >
                        {visible ? "En ligne" : "Masqué"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        onClick={() => alert("Fonction bientôt disponible")}
                        title="Modifier"
                      >
                        Modifier
                      </button>

                      {visible ? (
                        <button
                          onClick={() => handleToggleVisibility(member._id, false)}
                          title="Masquer"
                        >
                          Masquer
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleVisibility(member._id, true)}
                          title="Remettre en ligne"
                        >
                          Remettre en ligne
                        </button>
                      )}

                      <button
                        onClick={() => handleSupprimer(member._id)}
                        title="Supprimer définitivement"
                      >
                        Supprimer
                      </button>

                      {/* Voir le profil (modale plein écran) */}
                      <button onClick={() => openPreview(member)} title="Voir le profil">
                        Voir le profil
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>Aucun membre pour ce filtre / recherche</div>
            )}
          </div>
        )}
      </details>

      {/* Modale d'aperçu plein écran */}
      {isModalOpen && previewMember && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Aperçu du profil"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePreview();
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "stretch",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              height: "100%",
              borderRadius: 0,
              overflowY: "auto",
              position: "relative",
              boxShadow: "none",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Barre de titre */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px solid #eee",
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 1,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18 }}>
                {getDisplayName(previewMember)} — Aperçu de la carte
              </h2>
              <button
                onClick={closePreview}
                aria-label="Fermer"
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 24,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: 16 }}>
              <MemberCard member={previewMember} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardAdmin;
