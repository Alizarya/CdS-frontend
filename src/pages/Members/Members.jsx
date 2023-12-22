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

    // Gestion du champs de recherche
    const [searchTerm, setSearchTerm] = useState('');

    const handleTagClick = (tag) => {
        setSearchTerm(tag);
    };

    const filteredMembers = DataMembers.filter((member) => {
        const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.trim() !== '');

        return searchWords.every((word) => {
            const memberData = Object.values(member).join(' ').toLowerCase();
            return memberData.includes(word);
        });
    });

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
                                onTagClick={handleTagClick} // Ajout de la fonction de gestion des clics sur les tags
                            />
                        </aside>
                    <article className="members-article">
                        {filteredMembers.map((member) => (
                            <div className="members-relative" key={member.id}>
                                <div className="member-card">
                                    <img src={member.image} alt={member.name} />
                                    <div className="member-card-info">
                                        {member.pseudo ? (
                                            <h2>{member.pseudo}</h2>
                                        ) : (
                                            <h2>{member.name}</h2>
                                        )}
                                        {member.pseudo && <h3>{member.name}</h3>}
                                        <p>{member.shortdescription}</p>
                                        <Tags memberId={member.id} />
                                    </div>
                                </div>
                                <Link to={`/Members/${member.id}`}>
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