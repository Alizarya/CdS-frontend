import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import UpdateData from "./UpdateData";
import PutOnline from "./PutOnline";
import Preview from "./Preview";
import { getMembers, createMember, updateMember, deleteMember } from "../../utils/axiosMembers";

function Dashboard() {
    const [isPublished, setIsPublished] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isUserExists, setIsUserExists] = useState(false);
    const [memberData, setMemberData] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Fonction pour récupérer les données du membre
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

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            return;
        }

        const storedUserId = sessionStorage.getItem('userId');
        setUserId(storedUserId);

        fetchMembersData(); // Appel à la fonction ici
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const dashboardNav = document.querySelector('.dashboard-nav');
            if (!dashboardNav) {
                return;
            }

            const scrollPosition = window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;
            const scrollTrigger = 0.05 * pageHeight;

            if (scrollPosition > scrollTrigger) {
                dashboardNav.classList.add('fixed');
            } else {
                dashboardNav.classList.remove('fixed');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleTogglePublish = async () => {
        if (!memberData) return;

        const updatedMemberData = { ...memberData, softDelete: isPublished };

        try {
            const response = await updateMember(memberData._id, updatedMemberData);
            if (response && response.member) {
                setIsPublished(!isPublished);
            }
            fetchMembersData(); // Rafraîchir les données après modification
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la publication du membre", error);
        }
    };

    const handleCreateMember = async () => {
        const newMemberData = {
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
            const newMember = await createMember(newMemberData);
            alert("Félicitations, ta carte de membre a été créée !");
            setIsUserExists(true);
            setMemberData(newMember);
            setIsPublished(false);
            fetchMembersData(); // Rafraîchir les données après création

            navigate('/dashboard/updateData');
        } catch (error) {
            console.error("Erreur lors de la création du membre", error);
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

    return (
        <>
            <Header />
            <h1 className="banner">Tableau de bord</h1>

            {isUserExists ? (
                <div className="dashboard-nav-colum">
                    <div className="dashboard-nav">
                        <button className="button-nav">
                            <Link to="/Dashboard/updateData"><i className="fa-solid fa-pen"></i>Modifier ta carte</Link>
                        </button>

                        <button className="button-nav" onClick={async () => {
                            await fetchMembersData();
                            navigate("/Dashboard/preview");
                        }}> <i className="fa-solid fa-magnifying-glass"></i>
                            Prévisualiser ta carte
                        </button>

                        <button className="button-nav">
                            <Link to="/Dashboard/putOnline"><i className="fa-solid fa-chalkboard-user"></i>Gérer la mise en ligne</Link>
                        </button>

                        <button className="button-nav" onClick={handleDeleteMember}><i className="fa-solid fa-trash-can"></i>Supprimer ta carte</button>

                    </div>
                </div>
            ) : (
                <div className="member-creation">
                    <button className="button-cta " onClick={handleCreateMember}>Créer ta carte de membre</button>
                </div>
            )}

            <Routes>
                <Route path="updateData" element={<UpdateData />} />
                <Route path="putOnline" element={<PutOnline memberData={memberData} updateMember={updateMember} fetchMembersData={fetchMembersData} />} />
                <Route path="preview" element={<Preview memberData={memberData} />} />
            </Routes>
        </>
    );
}

export default Dashboard;
