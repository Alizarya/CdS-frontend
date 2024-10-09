import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import UpdateData from "./UpdateData";
import CardPrev from "../../components/Card/CardPrev"; 
import { getMembers, createMember, updateMember, deleteMember } from "../../utils/axiosMembers";

function Dashboard() {
    const [isPublished, setIsPublished] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isUserExists, setIsUserExists] = useState(false);
    const [memberData, setMemberData] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            return;
        }

        const storedUserId = sessionStorage.getItem('userId');
        setUserId(storedUserId);

        const fetchMembersData = async () => {
            try {
                const data = await getMembers();
                const member = data.find(member => member.userId === storedUserId);
                if (member) {
                    setIsUserExists(true);
                    setMemberData(member);
                    setIsPublished(!member.softDelete);
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

        const updatedMemberData = { ...memberData, softDelete: isPublished }; 
        
        try {
            const response = await updateMember(memberData._id, updatedMemberData);  
            if (response && response.member) {
                setIsPublished(!isPublished);
            }
    
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
            await fetchMembersData();
        } catch (error) {
            console.error("Erreur lors de la création du membre", error);
        }
    };

    const fetchMembersData = async () => {
        const storedUserId = sessionStorage.getItem('userId');

        try {
            const data = await getMembers();
            const member = data.find(member => member.userId === storedUserId);
            if (member) {
                setIsUserExists(true);
                setMemberData(member);
                setIsPublished(!member.softDelete);
            } else {
                console.log("Aucun membre trouvé avec l'userId donné.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des membres", error);
        }
    };

    const handleDeleteMember = async () => {
        if (!memberData) return;

        const confirmDelete = window.confirm("Es-tu sûr de vouloir supprimer définitivement ton profil membre ? Cela ne peut pas être annulé.");
        
        if (confirmDelete) {
            try {
                await deleteMember(memberData._id);
                alert("Ton profil membre a été supprimé définitivement !");
                setIsUserExists(false);
                setMemberData(null);
                setIsPublished(false);
                navigate("/Dashboard");
            } catch (error) {
                console.error("Erreur lors de la suppression du membre", error);
                alert("Une erreur est survenue lors de la suppression de ton profil membre. Veuillez réessayer.");
            }
        }
    };

    const isUpdateDataPage = location.pathname === "/Dashboard/updateData";
    const isPreviewPage = location.pathname === "/Dashboard/preview";

    return (
        <>
            <Header />
            <h1 className="banner">Tableau de bord</h1>

            {isUserExists ? (
                <>
                    <button onClick={async () => { 
                        await fetchMembersData();
                        navigate("/Dashboard/preview");
                    }}>
                        Prévisualiser ta carte de membre
                    </button>

                    <button>
                        <Link to="/Dashboard/updateData">Modifier ta carte de membre</Link>
                    </button>

                   
                    <button onClick={handleDeleteMember}>Supprimer définitivement ton profil membre</button>
                   

                    <div>
                        {isPublished ? (
                            <>
                                <p>Actuellement, ta carte de membre est en ligne. Souhaites-tu la dépublier ?</p>
                                <button onClick={handleTogglePublish}>Retirer la mise en ligne de ta carte</button>
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
