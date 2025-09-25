// src/pages/Dashboard/UpdateData.jsx

// Import des styles
import "./Dashboard.css";
import "./DashboardResponsive.css";

// Import des besoins
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import des datas
import { updateMember } from "../../utils/axiosMembers";
import dataTags from "../../data/DataTags";
import SocialsLogos from "../../data/DataSocialsLogo";

const DEFAULT_LINKS = {
  website: "",
  blog: "",
  youtube: "",
  twitch: "",
  tiktok: "",
  twitter: "",
  bluesky: "",
  mastodon: "",
  facebook: "",
  instagram: "",
  threads: "",
  linkedin: "",
  podcast: "",
  financement: "",
};

const DEFAULT_CONTENT = [
  { image: "", link: "", title: "", description: "" },
  { image: "", link: "", title: "", description: "" },
  { image: "", link: "", title: "", description: "" },
];

// --- Utils -------------------------------------------------------------

// Nettoie, dédoublonne et borne un tableau de tags
const normalizeTagsArray = (val, max = 3) => {
  if (!val) return [];
  const arr = Array.isArray(val) ? val : String(val).split(",");
  const cleaned = arr
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter((t) => t.length > 0);
  return Array.from(new Set(cleaned)).slice(0, max);
};

const normalizeHttps = (url) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/^http:\/\//i, "https://");
  return `https://${trimmed}`;
};

function UpdateData({ refresh, memberData }) {
  const navigate = useNavigate();

  // Vérifier si le token est présent dans le sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/404");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    userId: "",
    pseudo: "",
    nom: "",
    image: "",
    tags: [],
    shortdescription: "",
    description: "",
    links: { ...DEFAULT_LINKS },
    content: [...DEFAULT_CONTENT],
    content_format: "",
    content_question: "no",
  });

  const [selectedLinks, setSelectedLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrater le formulaire depuis les props memberData
  useEffect(() => {
    if (!memberData) {
      setIsLoading(false);
      return;
    }

    // Tags : nettoyage pour éviter les tags fantômes (ex: chaîne vide)
    const tagsArray = normalizeTagsArray(memberData.tags, 3);

    // Liens
    const linksObj = { ...DEFAULT_LINKS, ...(memberData.links || {}) };
    // Nettoie les clefs sélectionnées (non vides)
    const initialSelectedLinks = Object.keys(linksObj).filter((k) => {
      const v = linksObj[k];
      return typeof v === "string" ? v.trim().length > 0 : !!v;
    }).slice(0, 3); // borne à 3

    // Contenu
    const contentArr =
      Array.isArray(memberData.content) && memberData.content.length
        ? memberData.content
        : [...DEFAULT_CONTENT];

    const hasAnyContent = contentArr.some(
      (c) =>
        (c.title && c.title.trim()) ||
        (c.link && c.link.trim()) ||
        (c.image && c.image.trim()) ||
        (c.description && c.description.trim())
    );

    setFormData((prev) => ({
      ...prev,
      userId: memberData.userId || "",
      pseudo: memberData.pseudo || "",
      nom: memberData.nom || "",
      image: memberData.image || "",
      tags: tagsArray,
      shortdescription: memberData.shortdescription || "",
      description: memberData.description || "",
      links: linksObj,
      content: contentArr,
      content_format: memberData.content_format || "",
      content_question: hasAnyContent ? "yes" : "no",
    }));

    setSelectedLinks(initialSelectedLinks);
    setIsLoading(false);
  }, [memberData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Gestion de l'image uploadée (en DataURL)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Liens : limiter à 3 et désactiver visuellement
  const handleLinkCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (checked) {
      if (selectedLinks.length < 3) {
        setSelectedLinks((prev) => [...prev, name]);
      } else {
        alert("Tu ne peux sélectionner que 3 liens maximum.");
        e.target.checked = false;
      }
    } else {
      setSelectedLinks((prev) => prev.filter((link) => link !== name));
      // Lors de la désélection, on vide la valeur du lien
      setFormData((prevState) => ({
        ...prevState,
        links: {
          ...prevState.links,
          [name]: "",
        },
      }));
    }
  };

  const handleLinkInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      links: {
        ...prevState.links,
        [name]: value,
      },
    }));
  };

  const handleContentChange = (e, index) => {
    const { name, value } = e.target;
    const updatedContent = [...formData.content];
    updatedContent[index][name] = value;

    setFormData((prevState) => ({
      ...prevState,
      content: updatedContent,
    }));
  };

  // Tags : limite à 3 avec nettoyage défensif
  const handleTagChange = (rawTag) => {
    const tag = typeof rawTag === "string" ? rawTag.trim() : rawTag;

    setFormData((prevState) => {
      const cleanTags = normalizeTagsArray(prevState.tags, 999); // nettoie sans borner à 3 ici
      const isSelected = cleanTags.includes(tag);

      if (isSelected) {
        return { ...prevState, tags: cleanTags.filter((t) => t !== tag) };
      }

      if (cleanTags.length >= 3) {
        alert("Tu ne peux sélectionner que 3 tags maximum.");
        return prevState;
      }

      return { ...prevState, tags: [...cleanTags, tag] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!memberData?._id) {
      alert("Impossible d'enregistrer : aucune carte de membre trouvée.");
      return;
    }

    // Vérifier/normaliser les liens dans 'links'
    const modifiedLinks = { ...formData.links };
    Object.keys(modifiedLinks).forEach((key) => {
      if (modifiedLinks[key]) {
        modifiedLinks[key] = normalizeHttps(String(modifiedLinks[key]).trim());
      }
    });

    // Vérifier/normaliser les liens dans 'content'
    const modifiedContent = formData.content.map((content) => {
      const next = { ...content };
      if (next.link) next.link = normalizeHttps(String(next.link).trim());
      return next;
    });

    // Tags sûrs (trim + unique + max 3)
    const safeTags = normalizeTagsArray(formData.tags, 3);

    const userIdFromSession = sessionStorage.getItem("userId") || "";
    const memberId = memberData._id;

    const formDataToSend = {
      userId: userIdFromSession,
      pseudo: formData.pseudo || "",
      nom: formData.nom || "",
      image: formData.image || "",
      tags: safeTags,
      shortdescription: formData.shortdescription || "",
      description: formData.description || "",
      links: modifiedLinks,
      content: modifiedContent,
      content_format: formData.content_format,
    };

    try {
      await updateMember(memberId, formDataToSend);
      alert("Modifications bien prises en compte");

      if (typeof refresh === "function") {
        await refresh();
      }

      navigate("/dashboard/preview", { state: { updatedMember: formDataToSend } });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du membre", error);
      alert("Une erreur est survenue lors de la mise à jour du membre.");
    }
  };

  if (isLoading) {
    return <p>Chargement des données du membre...</p>;
  }

  const tagsLimitReached = (formData.tags?.length || 0) >= 3;

  return (
    <>
      <div className="dashboard-header">
        <h2>Mise à jour de ta carte de membre</h2>
        <p>
          C’est l’occasion parfaite pour montrer qui tu es, ce que tu apportes à la
          communauté et ta passion pour la vulga scientifique.
        </p>
        <p>
          Pas de panique, tu peux enregistrer tes données à tout moment et y revenir plus
          tard pour les modifier.
        </p>
        <p>Le bouton "enregistrer" se trouve maintenant dans les différentes sections du formulaire.</p>
      </div>

      <div className="dashboard-main">
        <form className="dashboard" onSubmit={handleSubmit}>
          <section className="dashboard-presentation">
            <h3>Ta présentation</h3>

            <label>Pseudo </label>
            <input type="text" name="pseudo" value={formData.pseudo} onChange={handleChange} />

            <label>Nom / Prénom (facultatif)</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} />

            <label>Image de profil </label>
            <input
              className="fileBtn"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Aperçu"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            )}

            <label>Description Courte </label>
            <p>{120 - (formData.shortdescription?.length || 0)} caractères restants</p>
            <textarea
              name="shortdescription"
              value={formData.shortdescription}
              onChange={handleChange}
              maxLength={120}
            />

            <label>Description Longue</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </section>

          <button className="button-cta button-update seventy" type="submit">
            Enregistrer tes mises à jour
          </button>

          {/* Liens avec logos */}
          <section className="dashboard-links">
            <h3>Tes liens</h3>
            <p>Tu peux insérer jusqu'à trois liens parmi les suivants.</p>
            <div className="links-container">
              {Object.keys(formData.links).map((link) => {
                const isChecked = selectedLinks.includes(link);
                const disableUnchecked = !isChecked && selectedLinks.length >= 3;
                return (
                  <div key={link} className="link-item">
                    <input
                      type="checkbox"
                      name={link}
                      checked={isChecked}
                      onChange={handleLinkCheckboxChange}
                      disabled={disableUnchecked}
                    />
                    <label className="link-label">
                      <i className={SocialsLogos[link]}></i>
                      {link.charAt(0).toUpperCase() + link.slice(1)}
                    </label>

                    {isChecked && (
                      <input
                        type="text"
                        name={link}
                        placeholder={`Lien pour ${link}`}
                        value={formData.links[link]}
                        onChange={handleLinkInputChange}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <button className="button-cta button-update seventy" type="submit">
            Enregistrer tes mises à jour
          </button>

          {/* Tags */}
          <section className="dashboard-tags">
            <h3>Tags</h3>
            <p>Tu peux sélectionner jusqu'à trois étiquettes parmi les suivantes.</p>
            <div className="dashboard-tags-container">
              {[...dataTags].sort().map((tag, index) => {
                const isChecked = formData.tags.includes(tag);
                const disableUnchecked = !isChecked && tagsLimitReached;
                return (
                  <div key={index} className="tag-solo">
                    <input
                      type="checkbox"
                      name={tag}
                      checked={isChecked}
                      onChange={() => handleTagChange(tag)}
                      disabled={disableUnchecked}
                    />
                    <label className={isChecked ? "selected" : ""}>{tag}</label>
                  </div>
                );
              })}
            </div>
          </section>

          <button className="button-cta button-update seventy" type="submit">
            Enregistrer tes mises à jour
          </button>

          {/* Contenu */}
          <section className="dashboard-content">
            <h3>Ton contenu</h3>

            <div className="dashboard-content-question">
              <p>As-tu du contenu à mettre en avant ? </p>
              <div>
                <label>
                  <input
                    type="radio"
                    name="content_question"
                    value="yes"
                    checked={formData.content_question === "yes"}
                    onChange={() =>
                      setFormData((prevState) => ({ ...prevState, content_question: "yes" }))
                    }
                  />
                  Oui
                </label>

                <label>
                  <input
                    type="radio"
                    name="content_question"
                    value="no"
                    checked={formData.content_question === "no"}
                    onChange={() =>
                      setFormData((prevState) => ({ ...prevState, content_question: "no" }))
                    }
                  />
                  Non
                </label>
              </div>
            </div>

            {formData.content_question === "yes" && (
              <>
                <div className="dashboard-content-form">
                  <p>Quel format souhaites-tu appliquer pour tes miniatures ?</p>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="content_format"
                        value="portrait"
                        checked={formData.content_format === "portrait"}
                        onChange={handleChange}
                      />
                      Portrait
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="content_format"
                        value="paysage"
                        checked={formData.content_format === "paysage"}
                        onChange={handleChange}
                      />
                      Paysage
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="content_format"
                        value="carré"
                        checked={formData.content_format === "carré"}
                        onChange={handleChange}
                      />
                      Carré
                    </label>
                  </div>
                </div>

                <div className="dashboard-content-row">
                  {formData.content.map((content, index) => (
                    <div className="content-n" key={index}>
                      <h4>Contenu {index + 1}</h4>

                      <label>Titre</label>
                      <input
                        type="text"
                        name="title"
                        value={content.title}
                        onChange={(e) => handleContentChange(e, index)}
                      />

                      <label>Lien</label>
                      <input
                        type="text"
                        name="link"
                        value={content.link}
                        onChange={(e) => handleContentChange(e, index)}
                      />

                      <label>Description</label>
                      <textarea
                        name="description"
                        value={content.description}
                        onChange={(e) => handleContentChange(e, index)}
                      />

                      <label>Image (insère le lien de ta miniature)</label>
                      <input
                        type="text"
                        name="image"
                        value={content.image}
                        onChange={(e) => handleContentChange(e, index)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          <button className="button-cta button-update seventy" type="submit">
            Enregistrer tes mises à jour
          </button>
        </form>
      </div>
    </>
  );
}

export default UpdateData;
