// Import des styles
import "./Login.css"

import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import { loginUser } from "../../utils/userConnexion";


function Login() {
    const [userMail, setUserMail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); 

        try {
            const response = await loginUser(userMail, userPassword);
            console.log('Connexion réussie:', response);

            // Redirection après la connexion réussie ici

        } catch (error) {
            console.error('Erreur de connexion:', error);
            // Gestion de l'erreur de connexion ici 
        }
    };

    return (
        <>
            <Header/>
            <main className="main-login">
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
                    <Link to="/resetPassword"><i className="fa-solid fa-key"></i>Mot de passe oublié ?</Link>
                    <br></br><br></br>
                    <Link to="/"><i className="fa-solid fa-house"></i>Retourner à l'accueil</Link>
                </div>
            </main>
        </>
    );
}

export default Login;