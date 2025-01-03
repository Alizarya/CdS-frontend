// Import des styles
import "./Members.css";

// Import des composants
import Header from "../../components/Header/Header";
import Tags from "../../components/Tags/Tags";
import React, { useState, useEffect } from 'react';
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";

// Import des données 
import { getMembers } from '../../utils/axiosMembers'; // Importer la fonction getMembers
import dataTags from '../../data/DataTags'; // Importer les tags

function Members() {
    // Gestion du champ de recherche et des tags
    const [searchTerm, setSearchTerm] = useState('');
    const [members, setMembers] = useState([]); // État pour stocker les membres
    const [loading, setLoading] = useState(true); // État pour le chargement
    const [error, setError] = useState(null); // État pour les erreurs

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await getMembers(); 
                // Filtrer les membres avec softDelete: false
                const activeMembers = data.filter(member => !member.softDelete);
                setMembers(activeMembers); 
            } catch (err) {
                setError("Erreur lors de la récupération des membres.");
            } finally {
                setLoading(false); 
            }
        };

        fetchMembers();
    }, []); 

    // Gestion des erreurs et affichage de l'état de chargement
    if (loading) return <div>Chargement des membres...</div>;
    if (error) return <div>{error}</div>;

    // Gestion des tags
    const handleTagClick = (tag) => {
        setSearchTerm((prevSearchTerm) => {
            const lowerCaseTag = tag.toLowerCase();
            const searchWords = prevSearchTerm.toLowerCase().split(' ').filter(word => word.trim() !== '');

            // Vérifier si le tag existe déjà
            const tagIndex = searchWords.indexOf(lowerCaseTag);

            // Si le tag existe déjà, le supprimer, sinon l'ajouter
            if (tagIndex !== -1) {
                searchWords.splice(tagIndex, 1);
            } else {
                searchWords.push(lowerCaseTag);
            }

            const newSearchTerm = searchWords.join(' ').trim();
            return newSearchTerm;
        });
    };

    // Filtrage des membres
    const filteredMembers = members.filter((member) => {
        const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.trim() !== '');
        return searchWords.every((word) => {
            const memberData = Object.values(member).join(' ').toLowerCase();
            return memberData.includes(word);
        });
    });

    // Mélanger le map
    const shuffledMembers = [...filteredMembers].sort(() => Math.random() - 0.5);

    return (
        <>
            <Header />
            <main className="members-container">
                <section className="members-section">
                    <aside className="members-aside">
                        <div className="search-box">
                            <div className="input-container">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input
                                    type="text"
                                    placeholder="Rechercher un thème, un nom, un sujet..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        {/* Afficher tous les tags de dataTags ici */}
                        <div className="tags-display">
                            <Tags
                                tags={dataTags} // Passer tous les tags ici
                                searchTerm={searchTerm}
                                onTagClick={handleTagClick}
                            />
                        </div>
                    </aside>
                    
                    <article className="members-article">
  {shuffledMembers.map((member) => (
    <div className="members-relative" key={member._id}>
      <Link
        to={{
          pathname: `/Members/${member._id}`,
        }}
        state={{ memberData: member }} // Passer directement l'objet membre
        className="member-card-link" // Classe optionnelle pour stylisation
      >
        <div className="member-card">
          <img src={member.image} alt={member.name} />
          <div className="member-card-info">
            {member.pseudo ? (
              <h2>{member.pseudo}</h2>
            ) : (
              <h2>{member.name}</h2>
            )}
            {member.tags ? (
              <Tags
                tags={member.tags}
                searchTerm={searchTerm}
                onTagClick={handleTagClick}
              />
            ) : (
              <p>Aucun tag disponible</p>
            )}
            <p>{member.shortdescription}</p>
          </div>
          {/* Bouton à l'intérieur */}
          <Button
            texte={`Découvrir ${member.pseudo || member.name}`}
            onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic au Link
          />
        </div>
      </Link>
    </div>
  ))}
</article>


                </section>
            </main>
        </>
    );
}

export default Members;
