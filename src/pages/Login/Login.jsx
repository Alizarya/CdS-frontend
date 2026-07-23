// Import des styles
import "./Login.css";
import "./LoginResponsive.css";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import { loginUser } from "../../utils/userConnexion";

function Login() {
  const navigate = useNavigate();

  const [userMail, setUserMail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  //___________________________________________________
  // Connexion
  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await loginUser(userMail, userPassword);

      // Stockage de l'identifiant utilisateur
      sessionStorage.setItem("userId", response.userId);

      // Redirection suivant le type d'utilisateur
      if (response.userId === "6753330eccd6171c33b1751d") {
        navigate("/DashboardAdmin");
      } else {
        navigate("/Dashboard");
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);

      setErrorMessage(
        error.message ||
          "Impossible de se connecter. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="main-login">
        <div className="login-container">
          <h2>Connexion à l'espace membre</h2>

          <p>
            Si vous ne possédez pas de compte membre, veuillez vous adresser au
            bureau de l'association pour obtenir de l'aide.
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>

              <input
                type="email"
                id="email"
                value={userMail}
                onChange={(e) => setUserMail(e.target.value)}
                autoComplete="email"
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
                autoComplete="current-password"
                required
              />
            </div>

            {errorMessage && (
              <p className="login-error">{errorMessage}</p>
            )}

            <Button
              type="submit"
              texte={loading ? "Connexion..." : "Se connecter"}
              disabled={loading}
            />
          </form>

          <Link to="/ResetPassword">
            <i className="fa-solid fa-key"></i> Mot de passe oublié ?
          </Link>

          <br />
          <br />

          <Link to="/">
            <i className="fa-solid fa-house"></i> Retourner à l'accueil
          </Link>
        </div>
      </main>
    </>
  );
}

export default Login;