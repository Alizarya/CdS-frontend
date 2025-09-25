// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { NavLink, Routes, Route, useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import UpdateData from "./UpdateData";
import PutOnline from "./PutOnline";
import Preview from "./Preview";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../../utils/axiosMembers";

/**
 * Navigation clean sans badge.
 */
function DashboardNav({ onDelete, onPreview }) {
  return (
    <div className="dashboard-nav-colum">
      <nav className="dashboard-nav sticky" aria-label="Navigation du tableau de bord">
        <NavLink className="button-nav" to="updateData">
          <i className="fa-solid fa-pen" /> Modifier ta carte
        </NavLink>

        <button className="button-nav" onClick={onPreview}>
          <i className="fa-solid fa-magnifying-glass" /> Prévisualiser ta carte
        </button>

        <NavLink className="button-nav" to="putOnline">
          <i className="fa-solid fa-chalkboard-user" /> Gérer la mise en ligne
        </NavLink>

        <button className="button-nav danger" onClick={onDelete}>
          <i className="fa-solid fa-trash-can" /> Supprimer ta carte
        </button>
      </nav>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const [memberData, setMemberData] = useState(null);
  const [isUserExists, setIsUserExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;

  // Fetch unique pour le membre courant
  const fetchMembersData = useCallback(async () => {
    if (!token || !userId) {
      setLoading(false);
      setIsUserExists(false);
      setMemberData(null);
      return;
    }
    try {
      setLoading(true);
      setErr(null);
      const data = await getMembers();
      const member = data.find((m) => m.userId === userId);
      if (member) {
        setIsUserExists(true);
        setMemberData(member);
      } else {
        setIsUserExists(false);
        setMemberData(null);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des membres", error);
      setErr(error);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    fetchMembersData();
  }, [fetchMembersData]);

  const handleCreateMember = async () => {
    const newMemberData = {
      userId,
      pseudo: "",
      nom: "",
      image: "",
      tags: "", // ← string, pas array
      shortdescription: "",
      description: "",
      links: {}, // ← objet vide
      content_format: "",
      content: [ // ← 3 items vides
        { image: "", link: "", title: "", description: "" },
        { image: "", link: "", title: "", description: "" },
        { image: "", link: "", title: "", description: "" },
      ],
      softDelete: true, // créé en brouillon
    };

    try {
      await createMember(newMemberData);
      alert("Félicitations, ta carte de membre a été créée !");
      await fetchMembersData(); // recharge les données
      navigate("/dashboard/updateData");
    } catch (error) {
      console.error("Erreur lors de la création du membre", error);
      alert(
        `Création impossible${
          error?.response?.data?.message ? ` : ${error.response.data.message}` : ""
        }. Regarde la console pour les détails.`
      );
    }
  };

  const handleDeleteMember = async () => {
    if (!memberData) return;

    const confirmDelete = window.confirm(
      "Es-tu sûr de vouloir supprimer définitivement ton profil membre ? Cela ne peut pas être annulé."
    );

    if (!confirmDelete) return;

    try {
      await deleteMember(memberData._id);
      alert("Ton profil membre a été supprimé définitivement !");
      setIsUserExists(false);
      setMemberData(null);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la suppression du membre", error);
      alert("Une erreur est survenue lors de la suppression. Réessaie.");
    }
  };

  const handlePreview = async () => {
    await fetchMembersData(); // recharge avant d’ouvrir la preview
    navigate("/dashboard/preview");
  };

  // Si pas connecté
  if (!token) {
    return (
      <>
        <Header />
        <h1 className="banner">Tableau de bord</h1>
        <div className="container">
          <p>Tu dois être connecté pour accéder à ton tableau de bord.</p>
          <Link className="button-cta" to="/login">
            Se connecter
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <h1 className="banner">Tableau de bord</h1>

      {loading && (
        <div className="skeleton" role="status" aria-live="polite">
          Chargement de tes informations…
        </div>
      )}

      {err && (
        <div className="alert error" role="alert">
          Une erreur est survenue lors du chargement. Réessaie.
        </div>
      )}

      {!loading && !isUserExists && (
        <div className="member-creation">
          <button className="button-cta" onClick={handleCreateMember}>
            Créer ta carte de membre
          </button>
        </div>
      )}

      {!loading && isUserExists && (
        <DashboardNav onDelete={handleDeleteMember} onPreview={handlePreview} />
      )}

      <Routes>
        <Route
          path="updateData"
          element={<UpdateData refresh={fetchMembersData} memberData={memberData} />}
        />
        <Route
          path="putOnline"
          element={
            <PutOnline
              memberData={memberData}
              updateMember={updateMember}
              fetchMembersData={fetchMembersData}
            />
          }
        />
        <Route path="preview" element={<Preview memberData={memberData} />} />
      </Routes>
    </>
  );
}

export default Dashboard;
