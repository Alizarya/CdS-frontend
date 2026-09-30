import "./Members.css";
import "./MembersResponsive.css";

import Header from "../../components/Header/Header";
import Tags from "../../components/Tags/Tags";

import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";

import { getMembers } from "../../utils/axiosMembers";
import dataTags from "../../data/DataTags";

const API_URL = "https://api.cafe-sciences.org/public";

const DEFAULT_IMAGE =
  "https://img.freepik.com/vecteurs-libre/aucune-illustration-concept-donnees_114360-2506.jpg?t=st=1728895997~exp=1728899597~hmac=5fbf097feef816adab0ec43d12d218ebe44fbe0e7b3a60c328c7bed612945f91&w=900";

// =========================
// Image membre
// =========================

const getMemberImage = (image) => {
  if (!image) {
    return DEFAULT_IMAGE;
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `${API_URL}${image}`;
};

// =========================
// Normalisation des textes
// =========================

const norm = (value) =>
  (value ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

// =========================
// Création du slug membre
// =========================

const createMemberSlug = (value) => {
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
};

// =========================
// Texte utilisé pour la recherche
// =========================

const buildHaystack = (member) => {
  const {
    nom,
    pseudo,
    shortdescription,
    description,
    tags,
    links,
    content,
  } = member || {};

  const parts = [
    nom,
    pseudo,
    shortdescription,
    description,
    Array.isArray(tags) ? tags.join(" ") : tags,
    ...Object.values(links || {}),
  ];

  if (Array.isArray(content)) {
    content.forEach((item) => {
      parts.push(
        item?.title,
        item?.description,
        item?.link,
        item?.image,
        item?.content_format
      );
    });
  }

  return norm(parts.filter(Boolean).join(" "));
};

// =========================
// Composant
// =========================

function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // Filtre par tag
  // =========================

  const handleTagFilterToggle = (tag) => {
    const selected = (tag ?? "").toString().trim();

    setSelectedTag((previous) =>
      norm(previous) === norm(selected)
        ? ""
        : selected
    );
  };

  // =========================
  // Récupération des membres
  // =========================

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();

        setMembers(
          data.filter((member) => !member.softDelete)
        );
      } catch (err) {
        console.error(err);

        setError(
          "Erreur lors de la récupération des membres."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // =========================
  // Tags du filtre
  // =========================

  const sortedTags = useMemo(() => {
    return [...dataTags].sort((a, b) =>
      a.localeCompare(b, "fr", {
        sensitivity: "base",
      })
    );
  }, []);

  // =========================
  // Filtrage des membres
  // =========================

  const filteredMembers = useMemo(() => {
    const tokens = norm(searchTerm)
      .split(/\s+/)
      .filter(Boolean);

    const tagNeedle = norm(selectedTag);

    return members.filter((member) => {
      // =========================
      // FILTRE PAR DISCIPLINE
      // =========================

      if (tagNeedle) {
        const memberTags = Array.isArray(member.tags)
          ? member.tags
          : [];

        const hasSelectedTag = memberTags.some(
          (tag) => norm(tag) === tagNeedle
        );

        if (!hasSelectedTag) {
          return false;
        }
      }

      // =========================
      // RECHERCHE GÉNÉRALE
      // =========================

      if (tokens.length > 0) {
        const haystack = buildHaystack(member);

        const matches = tokens.every((token) =>
          haystack.includes(token)
        );

        if (!matches) {
          return false;
        }
      }

      return true;
    });
  }, [
    members,
    searchTerm,
    selectedTag,
  ]);

  // =========================
  // Mélange aléatoire
  // =========================

  const shuffledMembers = useMemo(() => {
    const array = [...filteredMembers];

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [array[i], array[j]] = [
        array[j],
        array[i],
      ];
    }

    return array;
  }, [filteredMembers]);

  // =========================
  // Chargement
  // =========================

  if (loading) {
    return (
      <div>
        Chargement des membres...
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  // =========================
  // Affichage
  // =========================

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
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="tags-dropdown">
              <select
                value={selectedTag}
                onChange={(event) =>
                  setSelectedTag(event.target.value)
                }
              >
                <option value="">
                  -- Filtrer par discipline --
                </option>

                {sortedTags.map((tag, index) => (
                  <option
                    key={index}
                    value={tag}
                  >
                    {tag}
                  </option>
                ))}
              </select>

              {selectedTag && (
                <button
                  type="button"
                  className="clear-tag-filter"
                  onClick={() =>
                    setSelectedTag("")
                  }
                  aria-label="Effacer le filtre"
                  style={{
                    marginTop: "8px",
                  }}
                >
                  Effacer le filtre
                </button>
              )}
            </div>

          </aside>

          <article className="members-article">

            {shuffledMembers.length === 0 ? (
              <p style={{ padding: "1rem" }}>
                Aucun membre trouvé. Essaie
                d'alléger la recherche ou retire
                le filtre par discipline.
              </p>
            ) : (
              shuffledMembers.map((member) => {

                // Le pseudo sert d'URL.
                // Si le pseudo est vide, on utilise le nom.
                const slugSource =
                  member.pseudo || member.nom;

                const memberSlug =
                  createMemberSlug(slugSource);

                return (
                  <div
                    className="members-relative"
                    key={member._id}
                  >
                    <Link
                      to={`/Members/${memberSlug}`}
                      state={{
                        memberData: member,
                      }}
                      className="member-card-link"
                    >
                      <div className="member-card">

                        <img
                          src={getMemberImage(
                            member.image
                          )}
                          alt={
                            member.pseudo ||
                            member.nom ||
                            "Membre"
                          }
                        />

                        <div className="member-card-info">

                          <h2>
                            {member.pseudo ||
                              member.nom}
                          </h2>

                          {member.tags ? (
                            <Tags
                              tags={member.tags}
                              searchTerm={
                                selectedTag
                              }
                              onTagClick={
                                handleTagFilterToggle
                              }
                            />
                          ) : (
                            <p>
                              Aucun tag
                              disponible.
                            </p>
                          )}

                          <p>
                            {
                              member.shortdescription
                            }
                          </p>

                        </div>

                        <Button
                          texte={`Découvrir ${
                            member.pseudo ||
                            member.nom
                          }`}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                        />

                      </div>
                    </Link>
                  </div>
                );
              })
            )}

          </article>

        </section>
      </main>
    </>
  );
}

export default Members;