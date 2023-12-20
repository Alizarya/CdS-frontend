// Import des styles
import "./Members.css"

// Import des composants
import Header from  "../../components/Header/Header"
import Tags from "../../components/Tags/Tags";
import React, { useState } from 'react';
import Button from "../../components/Button/Button"

// Import des données 
import DataMembers from "../../data/DataMembers"

function Members() {
     // Gestion de la recherche
     const [searchTerm, setSearchTerm] = useState('');

    return (
        <>
            
            <Header />
            <main className="members-container">
                <section className="members-section">

                <aside className="members-aside">
                    <div className="search-box">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Rechercher un thème"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Tags searchTerm={searchTerm} />
                </aside>

                    <article className="members-article">
                        {DataMembers.map((member) => (
                            <div className="members-relative">
                                <div key={member.id} className="member-card">
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
                                <Button texte={`Découvrir ${member.pseudo || member.name}`} />
                            </div>
                        ))}
                    </article>
                </section>
            </main>
        </>
    );
}

export default Members;