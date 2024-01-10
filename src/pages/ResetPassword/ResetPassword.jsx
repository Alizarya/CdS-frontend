// Import des styles
import "../SignUp/SignUp.css"

import React, { useState } from 'react';
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { mailToResetPassword } from "../../utils/userConnexion"

function ResetPassword() {
    const [userMail, setUserMail] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault(); 

        try {
            const response = await mailToResetPassword(userMail);
            console.log('Réinitialisation réussie:', response);
            setResetSuccess(true); 
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        }
    };

    return (
        <>
            <Header/>
            <main className="main-signup">
                <div className="signup-container">
                    {!resetSuccess ? (
                        <>
                            <h2>Mot de passe perdu ou oublié ?</h2>
                            <p>Pas de panique, un lien pour obtenir un nouveau mot de passe vous sera envoyé par mail !</p>
                            <form onSubmit={handleReset}>
                                <div className="form-group">
                                    <label htmlFor="email">Adresse e-mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={userMail}
                                        onChange={(e) => setUserMail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" texte="Réinitialiser"/>
                            </form>
                            <Link to="/"><i className="fa-solid fa-house"></i>Retourner à l'accueil</Link>
                        </>
                    ) : (
                        <div>
                            <p>Réinitialisation réussie ! Consultez votre boite mail pour obtenir un nouveau mot de passe.</p>
                            <Link to="/"><i className="fa-solid fa-house"></i>Retourner à l'accueil</Link>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default ResetPassword;
