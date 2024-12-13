import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateMember, getMembers } from '../../utils/axiosMembers';

function PutOnline() {
  const navigate = useNavigate();

  const [isPublished, setIsPublished] = useState(false); // L'état de publication (par défaut hors ligne)
  const [memberData, setMemberData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate("/404");
    }

    // Charger les données du membre (par exemple, son statut de publication)
    const fetchMemberData = async () => {
      const userIdFromSession = sessionStorage.getItem('userId');
      if (userIdFromSession) {
        try {
          const membersData = await getMembers();
          const foundMember = membersData.find(member => member.userId === userIdFromSession);
          if (foundMember) {
            setMemberData(foundMember);
            setIsPublished(foundMember.softDelete === false); // Mettre à jour l'état selon softDelete
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des membres:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMemberData();
  }, [navigate]);

  // Fonction de validation des conditions avant publication
  const canPublish = () => {
    const { pseudo, image, tags, shortdescription, description, content, links } = memberData;

    // Vérifie si tous les champs requis sont remplis
    const isValidContent = content.every(item => item.image && item.link && item.title && item.description);
    const hasValidLink = Object.values(links).some(link => link !== "");

    return (
      pseudo && image && tags && shortdescription && description &&
      isValidContent && hasValidLink
    );
  };

  const handleTogglePublish = async () => {
    if (!canPublish()) {
      alert('Tous les champs de ta carte doivent être remplis pour la publier.');
      navigate('/dashboard/updateData');
      return;
    }

    try {
      const updatedMember = {
        ...memberData,
        softDelete: isPublished ? true : false, // Si déjà en ligne, met à true (dépublier), sinon met à false (publier)
      };

      // Appel à l'API pour mettre à jour les données du membre
      const response = await updateMember(memberData._id, updatedMember);

      if (response && response.message === 'Membre mis à jour avec succès') {
        // Mettre à jour l'état local en fonction du résultat
        setIsPublished(!isPublished);  
        setMemberData(response.member); 
      } else {
        console.error("Erreur lors de la mise à jour de la publication", response);
        alert('Une erreur est survenue lors de la mise à jour de la publication.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la publication du membre', error);
      alert('Une erreur est survenue lors de la mise à jour de la publication.');
    }
  };

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  return (
    
    <div className="dashboard-publish">
    <h2>Gestion de la mise en ligne</h2>
      {isPublished ? (
        <>
          <p>
            Actuellement, ta carte de créateur·ice est en ligne. <br />
            Souhaites-tu la dépublier ?
          </p>
          <button className="button-cta seventy" onClick={handleTogglePublish}>
            Retirer la mise en ligne de ta carte
          </button>
        </>
      ) : (
        <>
          <p>
            Actuellement, ta carte de créateur·ice n'est pas en ligne. <br />
            Souhaites-tu la publier ?
          </p>
          <button className="button-cta seventy" onClick={handleTogglePublish}>
            Mettre en ligne
          </button>
        </>
      )}
    </div>
 
  );
}

export default PutOnline;
