// src/pages/Dashboard/Preview.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CardPrev from "../../components/Card/CardPrev";
import { getMembers } from "../../utils/axiosMembers";

const Preview = ({ memberData: initialMemberData }) => {
  const location = useLocation();
  const updatedFromNav = location.state?.updatedMember || null;

  const [memberData, setMemberData] = useState(updatedFromNav || initialMemberData);

  useEffect(() => {
    // Si on a reçu des données fraîches via navigate, on les affiche direct
    if (updatedFromNav) {
      setMemberData(updatedFromNav);
      return;
    }

    // Si le parent fournit des données, on les utilise
    if (initialMemberData) {
      setMemberData(initialMemberData);
      return;
    }

    // Fallback : on refetch (ex. accès direct à l'URL)
    const fetchMemberData = async () => {
      const userIdFromSession = sessionStorage.getItem("userId");
      if (!userIdFromSession) {
        console.error("Aucun ID utilisateur trouvé dans la session.");
        return;
      }

      try {
        const membersData = await getMembers();
        const foundMember = membersData.find((member) => member.userId === userIdFromSession);

        if (foundMember) {
          setMemberData(foundMember);
        } else {
          console.warn("Aucun membre correspondant trouvé.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des membres :", error);
      }
    };

    fetchMemberData();
  }, [updatedFromNav, initialMemberData]);

  if (!memberData) {
    return <p>Aucun membre trouvé.</p>;
  }

  return (
    <div className="dashboard-header">
      <h2>Prévisualisation de ta carte</h2>
      <CardPrev member={memberData} />
    </div>
  );
};

export default Preview;
