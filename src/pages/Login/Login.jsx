// Import des styles
import "./Login.css"

import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";

function Login() {
    const [userMail, setUserMail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const handleLogin = () => {
        // En attente du back
        console.log('Adresse e-mail:', userMail);
        console.log('Mot de passe:', userPassword);
    };

    return (
        <>
            <Header/>
            <main>
                <div className="login-container">
                    <h2>Connexion à l'espace membre</h2>
                    <p>Si vous ne possédez pas de compte membre, veuillez vous adresser au bureau de l'association pour obtenir de l'aide.</p>
                    <form onSubmit={handleLogin}>
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
                        <Button type="submit" texte="Se connecter"/>
                    </form>
                    <Link to="/"><i class="fa-solid fa-house"></i>Retourner à l'accueil</Link>
                </div>
            </main>
        </>
    );
}

export default Login;