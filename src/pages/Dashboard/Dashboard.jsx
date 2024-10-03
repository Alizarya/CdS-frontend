import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Header from "../../components/Header/Header";
import AddData from "./AddData";
import UpdateData from "./UpdateData";
import { getMembers } from "../../utils/axiosMembers";
import { createMember } from "../../utils/axiosMember";

function Dashboard() {
    const [isPublished, setIsPublished] = useState("non");
    const [userId, setUserId] = useState(null);
    const [isUserExists, setIsUserExists] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            // Rediriger ou gérer le cas où l'utilisateur n'est pas connecté
            return;
        }

        const storedUserId = sessionStorage.getItem('userId'); // Récupérer userId
        setUserId(storedUserId); // Mettre à jour l'état avec userId

        // Récupérer les données des membres
        const fetchMembersData = async () => {
            try {
                const data = await getMembers();
                console.log("Données des membres:", data); // Affichez les données des membres
                data.forEach(member => console.log("Membre:", member)); // Affichez chaque membre pour vérifier leur structure
        
                // Récupérer l'userId depuis le sessionStorage
                const storedUserId = sessionStorage.getItem('userId');
                console.log("UserId du sessionStorage:", storedUserId); // Affichez le userId du sessionStorage
        
                // Vérifier si un membre avec cet userId existe
                const exists = data.some(member => member.userId && member.userId === storedUserId); // Assurez-vous d'utiliser le bon champ
                setIsUserExists(exists); // Met à jour l'état selon l'existence de l'utilisateur
                console.log("L'utilisateur existe-t-il?", exists); // Affichez le résultat final
            } catch (error) {
                console.error("Erreur lors de la récupération des membres", error);
            }
        };
        
        

        fetchMembersData();
    }, []);

    const handlePublishChange = (event) => {
        setIsPublished(event.target.value);
    };

    const handleCreateMember = async () => {
        const memberData = {
            userId: sessionStorage.getItem('userId'), // Assurez-vous que cette valeur est correcte
            pseudo: '', 
            nom: '', 
            image: '', 
            tags: '', 
            shortdescription: '', 
            description: '', 
            links: {}, // Assurez-vous que cela correspond au format attendu
            content_format: '',
            content: [
                { image: '', link: '', title: '', description: '' },
                { image: '', link: '', title: '', description: '' },
                { image: '', link: '', title: '', description: '' },
            ],
            softDelete: true,
        };
    
        try {
            await createMember(memberData);
            alert("Félicitations, ta carte de membre a été créée ! Tu n'as plus qu'à la remplir !");
            setIsUserExists(true); // Mettre à jour l'état pour indiquer que le membre existe maintenant
        } catch (error) {
            console.error("Erreur lors de la création du membre", error);
        }
    };

    return (
        <>
            <Header />
            <h1 className="banner">Tableau de bord</h1>

            {isUserExists ? (
                <>
                    <button>
                        <Link to="/Dashboard/updateData">Modifier ta carte de membre</Link>
                    </button>
                    <div>
                        <p>Publier ta carte de membre ?</p>
                        <label>
                            <input
                                type="radio"
                                value="oui"
                                checked={isPublished === "oui"}
                                onChange={handlePublishChange}
                            />
                            Oui
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="non"
                                checked={isPublished === "non"}
                                onChange={handlePublishChange}
                            />
                            Non
                        </label>
                    </div>
                </>
            ) : (
                <button onClick={handleCreateMember}>Créer ta carte de membre</button>
            )}

            <Routes>
                <Route path="addData" element={<AddData />} />
                <Route path="updateData" element={<UpdateData />} />
            </Routes>
        </>
    );
}

export default Dashboard;
