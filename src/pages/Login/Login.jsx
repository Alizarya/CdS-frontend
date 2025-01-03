// Import des styles
import "./Login.css"

import React, { useState } from 'react';
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import { loginUser } from "../../utils/userConnexion";
import { Link } from "react-router-dom";

function Login() {
    const [userMail, setUserMail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); 
    
        try {
            const response = await loginUser(userMail, userPassword);
    
            // Vérification si la réponse contient le token et l'ID
            if (response && response.token) {
                // Stockage du token et de l'ID dans sessionStorage
                sessionStorage.setItem('token', response.token);
                sessionStorage.setItem('userId', response.userId);

                // Redirection conditionnelle en fonction de l'ID utilisateur
                if (response.userId === '6753330eccd6171c33b1751d') {
                    window.location.href = '/dashboardAdmin';
                } else {
                    window.location.href = '/dashboard';
                }
            } else {
                console.error("Réponse inattendue :", response);
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
        }
    };
    
  
    return (
        <>
            <Header />
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
                        <Button type="submit" texte="Se connecter" />
                    </form>
                    <Link to="/ResetPassword"><i class="fa-solid fa-key"></i>Mot de passe oublié ?</Link><br></br><br></br>
                    <Link to="/"><i class="fa-solid fa-house"></i>Retourner à l'accueil</Link>
                </div>
            </main>
        </>
    );
}

export default Login;
