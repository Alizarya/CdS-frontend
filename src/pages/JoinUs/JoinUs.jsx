import React, { useState } from 'react';

// Import des styles
import "./JoinUs.css"

import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button"
import ContactCandidacy from '../../components/ContactCandidacy/ContactCandidacy';

function JoinUs() {
    // Afficher le formulaire interactif
    const [isFormVisible, setIsFormVisible] = useState(false);
    const handleButtonClick = () => {
        setIsFormVisible(!isFormVisible);
    };

  

    return (
        <>
            <Header />
            <main className="main-joinus">
                <h1 className="banner">Comment nous rejoindre ?</h1>

                <div className="joinus">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <h2>Par candidature</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <Button texte="Vérifier si vous êtes éligible" onClick={handleButtonClick}></Button>

                    {isFormVisible && (
                        <div>
                            <form className={`joinus-form ${isFormVisible ? 'visible' : 'hidden'}`}>
                                <ContactCandidacy/>

                                
                            </form>
                        </div>
                    )}

                    <h2>Par marrainage ou parrainage</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default JoinUs;
