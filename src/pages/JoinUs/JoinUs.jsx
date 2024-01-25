// Import des styles
import "./JoinUs.css"

import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button"

import { useState } from "react";

function JoinUs() {

    // Afficher le formulaire intéractif
    const [isFormVisible, setIsFormVisible] = useState(false);
    const handleButtonClick = () => {
        setIsFormVisible(!isFormVisible);
    };

    // Gérer les réponses aux questions du formulaire
    const [isCreator, setIsCreator] = useState(null);
    const [isSixMonthsCreator, setIsSixMonthsCreator] = useState(null);


    // Question 1
    const handleIsCreatorChange = (value) => {
        setIsCreator(value);
        if (value === 'non') {
          setIsFormVisible(false);
        }
      };

    // Question 2

    return (
        <>
            <Header/>
            <main className="main-joinus">
            <h1 className="banner">Comment nous rejoindre ?</h1>

            <div className="joinus">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <h2>Par candidature</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>            
                <Button texte="Vérifier si vous êtes éligible" onClick={handleButtonClick}></Button>

                <div>
                {isFormVisible ? (
                    <form className={`joinus-form ${isFormVisible ? 'visible' : 'hidden'}`}>
                    <div className="joinus-form-question question1">
                        <p>Vous êtes créateur ou créatrice de contenus et vous souhaitez que le Café des Sciences partage votre travail ?</p>
                        <div className="joinus-form-question-labels">
                        <label>
                            <input
                            type="radio"
                            value="oui"
                            checked={isCreator === 'oui'}
                            onChange={() => handleIsCreatorChange('oui')}
                            />
                            Oui
                        </label>

                        <label>
                            <input
                            type="radio"
                            value="non"
                            checked={isCreator === 'non'}
                            onChange={() => handleIsCreatorChange('non')}
                            />
                            Non
                        </label>
                        </div>
                    </div>

                    {isCreator === 'oui' && (
                        <div className="joinus-form-question question2">
                        <p>Vous créez du contenu depuis plus de six mois ?</p>
                        <div className="joinus-form-question-labels">
                            <label>
                            <input
                                type="radio"
                                value="ouiSixMois"
                                checked={isSixMonthsCreator === 'ouiSixMois'}
                                onChange={() => setIsSixMonthsCreator('ouiSixMois')}
                            />
                            Oui
                            </label>

                            <label>
                            <input
                                type="radio"
                                value="nonSixMois"
                                checked={isSixMonthsCreator === 'nonSixMois'}
                                onChange={() => setIsSixMonthsCreator('nonSixMois')}
                            />
                            Non
                            </label>
                        </div>
                        </div>
                    )}
                    </form>
                ) : (
                    <div>
                    {console.log("isCreator:", isCreator, "isSixMonthsCreator:", isSixMonthsCreator)}
                    
                    {isCreator === 'oui' && isSixMonthsCreator === 'nonSixMois' && (
                        <p>Malheureusement vous ne créez pas de contenus depuis assez de temps pour pouvoir candidater. Revenez vers nous dans quelques mois.</p>
                    )}
                    {isCreator === 'non' && <p>Nous vous invitons alors à proposer votre aide via une demande de recommandation, voir ci-dessous.</p>}
                    </div>
                )}
                </div>



                <h2>Par marrainage ou parrainage</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        </main>
        <Footer/>
        </>
    )
}

// Export de la fonction composant
export default JoinUs;