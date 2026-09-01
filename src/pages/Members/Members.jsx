// Import des styles
import "./Members.css";
import "./MembersResponsive.css";

// Import des composants
import Header from "../../components/Header/Header";
import Tags from "../../components/Tags/Tags";
import React, { useState, useEffect, useMemo } from "react";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";

// Import des données
import { getMembers } from "../../utils/axiosMembers";
import dataTags from "../../data/DataTags";

const API_URL = "https://api.cafe-sciences.org/public";

const DEFAULT_IMAGE =
  "https://img.freepik.com/vecteurs-libre/aucune-illustration-concept-donnees_114360-2506.jpg?t=st=1728895997~exp=1728899597~hmac=5fbf097feef816adab0ec43d12d218ebe44fbe0e7b3a60c328c7bed612945f91&w=900";

const getMemberImage = (image) => {
  if (!image) return DEFAULT_IMAGE;

  if (image.startsWith("http")) return image;

  return `${API_URL}${image}`;
};

function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normalisation des textes pour faciliter les recherches
  // (minuscules + suppression des accents)
  const norm = (v) =>
    (v ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  // Construction du texte dans lequel effectuer la recherche générale
  const buildHaystack = (m) => {
    const {
      name,
      pseudo,
      shortdescription,
      description,
      tags,
      links,
      content,
    } = m || {};

    const parts = [
      name,
      pseudo,
      shortdescription,
      description,
      Array.isArray(tags) ? tags.join(" ") : tags,
      ...Object.values(links || {}),
    ];

    if (Array.isArray(content)) {
      content.forEach((c) => {
        parts.push(
          c?.title,
          c?.description,
          c?.link,
          c?.image,
          c?.content_format
        );
      });
    }

    return norm(parts.filter(Boolean).join(" "));
  };

  // Permet de cliquer sur un tag pour activer/désactiver le filtre
  const handleTagFilterToggle = (tag) => {
    const t = (tag ?? "").toString().trim();

    setSelectedTag((prev) => (norm(prev) === norm(t) ? "" : t));
  };

  // Récupération des membres
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();

        setMembers(data.filter((m) => !m.softDelete));
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des membres.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Tags du filtre triés alphabétiquement
  const sortedTags = useMemo(() => {
    return [...dataTags].sort((a, b) =>
      a.localeCompare(b, "fr", { sensitivity: "base" })
    );
  }, []);

  // Filtrage des membres
  const filteredMembers = useMemo(() => {
    const tokens = norm(searchTerm).split(/\s+/).filter(Boolean);
    const tagNeedle = norm(selectedTag);

    return members.filter((m) => {
      /*
       * FILTRE PAR DISCIPLINE
       *
       * On vérifie maintenant directement les tags du membre.
       * Le filtre ne cherche donc plus le nom du tag dans toute
       * la description du membre.
       *
       * Exemple :
       * selectedTag = "Astronomie"
       *
       * Le membre doit réellement avoir "Astronomie" dans m.tags.
       */
      if (tagNeedle) {
        const memberTags = Array.isArray(m.tags) ? m.tags : [];

        const hasSelectedTag = memberTags.some(
          (tag) => norm(tag) === tagNeedle
        );

        if (!hasSelectedTag) {
          return false;
        }
      }

      /*
       * RECHERCHE GÉNÉRALE
       *
       * La recherche libre continue à chercher dans le nom,
       * pseudo, descriptions, tags, liens et contenus.
       */
      if (tokens.length > 0) {
        const hay = buildHaystack(m);

        if (!tokens.every((token) => hay.includes(token))) {
          return false;
        }
      }

      return true;
    });
  }, [members, searchTerm, selectedTag]);

  // Mélange aléatoire des membres
  const shuffledMembers = useMemo(() => {
    const arr = [...filteredMembers];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }, [filteredMembers]);

  if (loading) {
    return <div>Chargement des membres...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header />

      <main className="members-container">
        <section className="members-section">
          <aside className="members-aside">
            <div className="search-box">
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Rechercher un thème, un nom, un sujet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="tags-dropdown">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">
                  -- Filtrer par discipline --
                </option>

                {sortedTags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>

              {selectedTag && (
                <button
                  type="button"
                  className="clear-tag-filter"
                  onClick={() => setSelectedTag("")}
                  aria-label="Effacer le filtre"
                  style={{ marginTop: "8px" }}
                >
                  Effacer le filtre
                </button>
              )}
            </div>
          </aside>

          <article className="members-article">
            {shuffledMembers.length === 0 ? (
              <p style={{ padding: "1rem" }}>
                Aucun membre trouvé. Essaie d'alléger la recherche ou retire
                le filtre par discipline.
              </p>
            ) : (
              shuffledMembers.map((member) => (
                <div
                  className="members-relative"
                  key={member._id}
                >
                  <Link
                    to={`/Members/${member._id}`}
                    state={{ memberData: member }}
                    className="member-card-link"
                  >
                    <div className="member-card">
                      <img
                        src={getMemberImage(member.image)}
                        alt={member.name}
                      />

                      <div className="member-card-info">
                        <h2>
                          {member.pseudo || member.name}
                        </h2>

                        {member.tags ? (
                          <Tags
                            tags={member.tags}
                            searchTerm={selectedTag}
                            onTagClick={handleTagFilterToggle}
                          />
                        ) : (
                          <p>Aucun tag disponible.</p>
                        )}

                        <p>{member.shortdescription}</p>
                      </div>

                      <Button
                        texte={`Découvrir ${
                          member.pseudo || member.name
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Link>
                </div>
              ))
            )}
          </article>
        </section>
      </main>
    </>
  );
}

export default Members;
