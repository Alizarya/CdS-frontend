// Import des styles
import "./SignUp.css"

import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";

function Login() {
    const [userCode, setUserCode] = useState('');
    const [userMail, setUserMail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const handleSignUp = () => {
        // En attente du back
        console.log(userCode)
        console.log(userMail);
        console.log(userPassword);
    };

    return (
        <>
            <Header/>
            <main>
                <div className="signup-container">
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
                        <Button type="submit" texte="S'inscrire"/>
                    </form>
                    <Link to="/">Retourner à l'accueil</Link>
                </div>
            </main>
        </>
    );
}

export default Login;