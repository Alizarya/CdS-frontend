// Import des styles
import "./Members.css"

// Import des composants
import Header from  "../../components/Header/Header"
import Tags from "../../components/Tags/Tags";
import React, { useState } from 'react';
import Button from "../../components/Button/Button"
import { Link } from "react-router-dom";

// Import des données 
import DataMembers from "../../data/DataMembers"

function Members() {

    // Gestion du champs de recherche et des tags
    const [searchTerm, setSearchTerm] = useState('');

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
    

    const filteredMembers = DataMembers.filter((member) => {
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
                                        placeholder="Rechercher un thème"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Tags
                                searchTerm={searchTerm}
                                onTagClick={handleTagClick} 
                            />
                        </aside>
                        
                        <article className="members-article">
                            {shuffledMembers.map((member) => (
                                <div className="members-relative" key={member.id}>
                                    <div className="member-card">
                                        <img src={member.image} alt={member.name} />
                                        <div className="member-card-info">
                                            {member.pseudo ? (
                                                <h2>{member.pseudo}</h2>
                                            ) : (
                                                <h2>{member.name}</h2>
                                            )}
                                            <Tags memberId={member.id} />
                                            <p>{member.shortdescription}</p>
                                        </div>
                                    </div>
                                    <Link to={{
                                        pathname: `/Members/${member.id}`,
                                        state: { memberData: member } 
                                    }}>
                                        <Button texte={`Découvrir ${member.pseudo || member.name}`} />
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