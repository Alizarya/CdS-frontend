import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom"; // Importez useNavigate
import Header from "../../components/Header/Header";
import UpdateData from "./UpdateData";
import CardPrev from "../../components/Card/CardPrev"; 
import { getMembers, createMember, updateMember } from "../../utils/axiosMembers";

function Dashboard() {
    const [isPublished, setIsPublished] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isUserExists, setIsUserExists] = useState(false);
    const [memberData, setMemberData] = useState(null);
    const location = useLocation();
    const navigate = useNavigate(); // Ajoutez useNavigate pour la navigation

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            // Rediriger ou gérer le cas où l'utilisateur n'est pas connecté
            return;
        }

        const storedUserId = sessionStorage.getItem('userId');
        setUserId(storedUserId);

        const fetchMembersData = async () => {
            try {
                const data = await getMembers();
                console.log(data); // Log des données récupérées
                const member = data.find(member => member.userId === storedUserId);
                if (member) {
                    setIsUserExists(true);
                    setMemberData(member);
                    setIsPublished(!member.softDelete);
                    console.log("Membre trouvé :", member); // Vérifiez ici
                } else {
                    console.log("Aucun membre trouvé avec l'userId donné.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des membres", error);
            }
        };

        fetchMembersData();
    }, []);

    const handleTogglePublish = async () => {
        if (!memberData) return;
        const updatedMemberData = { ...memberData, softDelete: !isPublished };

        try {
            await updateMember(memberData._id, updatedMemberData);
            setIsPublished(!isPublished);
            // Rafraîchir les données après la mise à jour
            await fetchMembersData();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la publication du membre", error);
        }
    };

    const handleCreateMember = async () => {
        const memberData = {
            userId: sessionStorage.getItem('userId'),
            pseudo: '',
            nom: '',
            image: '',
            tags: '',
            shortdescription: '',
            description: '',
            links: {},
            content_format: '',
            content: [
                { image: '', link: '', title: '', description: '' },
                { image: '', link: '', title: '', description: '' },
                { image: '', link: '', title: '', description: '' },
            ],
            softDelete: true,
        };

        try {
            const newMember = await createMember(memberData);
            alert("Félicitations, ta carte de membre a été créée !");
            setIsUserExists(true);
            setMemberData(newMember);
            setIsPublished(false);
            // Rafraîchir les données après la création
            await fetchMembersData();
        } catch (error) {
            console.error("Erreur lors de la création du membre", error);
        }
    };

    const fetchMembersData = async () => {
        const storedUserId = sessionStorage.getItem('userId');

        try {
            const data = await getMembers();
            console.log(data); // Log des données récupérées
            const member = data.find(member => member.userId === storedUserId);
            if (member) {
                setIsUserExists(true);
                setMemberData(member);
                setIsPublished(!member.softDelete);
                console.log("Membre trouvé :", member); // Vérifiez ici
            } else {
                console.log("Aucun membre trouvé avec l'userId donné.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des membres", error);
        }
    };

    const isUpdateDataPage = location.pathname === "/Dashboard/updateData";
    const isPreviewPage = location.pathname === "/Dashboard/preview"; // Vérifier si nous sommes sur la page de prévisualisation

    return (
        <>
            <Header />
            <h1 className="banner">Tableau de bord</h1>

            {isUserExists ? (
                <>
                    {/* Ajouter le bouton de prévisualisation ici seulement si on n'est pas sur la page de prévisualisation */}
                    {!isPreviewPage && (
                        <button onClick={async () => { 
                            await fetchMembersData(); // Rafraîchir les données avant de naviguer
                            navigate("/Dashboard/preview"); // Naviguer vers la page de prévisualisation
                        }}>
                            Prévisualiser ta carte de membre
                        </button>
                    )}

                    {!isUpdateDataPage && (
                        <button>
                            <Link to="/Dashboard/updateData">Modifier ta carte de membre</Link>
                        </button>
                    )}

                    <div>
                        {isPublished ? (
                            <>
                                <p>Actuellement, ta carte de membre est en ligne. Souhaites-tu la dépublier ?</p>
                                <button onClick={handleTogglePublish}>Retirer ta carte</button>
                            </>
                        ) : (
                            <>
                                <p>Actuellement, ta carte de membre n'est pas en ligne. Souhaites-tu la publier ?</p>
                                <button onClick={handleTogglePublish}>Mettre en ligne</button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <button onClick={handleCreateMember}>Créer ta carte de membre</button>
            )}

            <Routes>
                <Route path="updateData" element={<UpdateData />} />
                {/* Ajouter la route pour la prévisualisation */}
                <Route path="preview" element={
                    memberData ? (
                        <>
                            <h2>Prévisualisation de ta carte</h2>
                            <CardPrev member={memberData} />
                        </>
                    ) : (
                        <p>Aucun membre trouvé.</p>
                    )
                } />
            </Routes>
        </>
    );
}

export default Dashboard;
