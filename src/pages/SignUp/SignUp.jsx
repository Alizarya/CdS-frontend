// Import des styles
import "./SignUp.css"

import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";

import { registerUser } from "../../utils/userConnexion"

function SignUp() {
    const [userCode, setUserCode] = useState('');
    const [userMail, setUserMail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const response = await registerUser(userCode, userMail, userPassword, isAgreed);
            console.log('Réponse du serveur:', response);
            // Réinitialiser les champs du formulaire
            setUserCode('');
            setUserMail('');
            setUserPassword('');
            setIsAgreed(false);
            // Afficher le message de confirmation
            setRegistrationSuccess(true);
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            // Gérer les erreurs ici
        }
    };

    return (
        <>
            <Header/>
            <main className="main-signup">
                <div className="signup-container">
                    {registrationSuccess ? (
                        <>
                            <h2>Inscription à l'espace membre</h2>
                            <p>Votre inscription est réussie, un mail de confirmation vient de vous être envoyé.</p>
                            <Link to="/login"> <i className="fa-solid fa-right-to-bracket"></i>Vous connecter</Link>
                        </>
                    ) : (
                        <>
                            <h2>Inscription à l'espace membre</h2>
                            <p>Si vous ne possédez pas de code d'inscription, veuillez vous adresser au bureau de l'association pour l'obtenir.</p>
                            <form onSubmit={handleSignUp}>
                                <div className="form-group">
                                    <label htmlFor="code">Code d'inscription</label>
                                    <input
                                        type="code"
                                        id="code"
                                        value={userCode}
                                        onChange={(e) => setUserCode(e.target.value)}
                                        required
                                    />
                                </div>
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
                                <div className="form-group">
                                    <label htmlFor="password">Mot de passe</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={userPassword}
                                        onChange={(e) => setUserPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={isAgreed}
                                            onChange={(e) => setIsAgreed(e.target.checked)}
                                            required
                                        />
                                        <span className="checkbox-text">
                                            Je m'engage à respecter le règlement du café.
                                        </span>
                                    </label>
                                </div>
                                <Button type="submit" texte="S'inscrire"/>
                            </form>
                            <Link to="/"><i className="fa-solid fa-house"></i>Retourner à l'accueil</Link>
                        </>
                    )}
                </div>
            </main>
        </>
    );
}

export default SignUp;