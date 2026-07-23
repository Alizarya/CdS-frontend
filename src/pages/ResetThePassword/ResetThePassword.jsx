import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";

import { resetPassword } from "../../utils/userConnexion";

import "../SignUp/SignUp.css";

function ResetThePassword() {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //______________________________________________
  // Validation

  const passwordScore = (pwd) => {
    let score = 0;

    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    return Math.min(score, 5);
  };

  const meetsPolicy = (pwd) =>
    pwd.length >= 8 &&
    /[a-z]/.test(pwd) &&
    /[A-Z]/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd);

  const score = passwordScore(newPassword);

  const scoreLabel =
    score <= 1
      ? "Très faible"
      : score === 2
      ? "Faible"
      : score === 3
      ? "Correct"
      : score === 4
      ? "Bon"
      : "Fort";

  //______________________________________________
  // Redirection après succès

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, navigate]);

  //______________________________________________
  // Réinitialisation

  const handleReset = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setMessage("");
    setLoading(true);

    try {
      const response = await resetPassword(
        resetToken,
        email.trim(),
        newPassword
      );

      setMessage(
        response.message ||
          "Votre mot de passe a été réinitialisé avec succès."
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.message ||
          "Erreur lors de la réinitialisation du mot de passe."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="main-signup">
        <div className="signup-container">
          <h2>Réinitialisation du mot de passe</h2>

          <form onSubmit={handleReset}>
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>

              <input
                type="email"
                id="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">
                Nouveau mot de passe
              </label>

              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                autoComplete="new-password"
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="toggle-password toggle-password--below"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"}
              </button>

              <p className="passObligation">
                Le mot de passe doit contenir au minimum 8 caractères,
                avec une majuscule, une minuscule et un caractère spécial.
              </p>

              <div className="password-meter">
                <div className={`bar ${score >= 1 ? "on" : ""}`} />
                <div className={`bar ${score >= 2 ? "on" : ""}`} />
                <div className={`bar ${score >= 3 ? "on" : ""}`} />
                <div className={`bar ${score >= 4 ? "on" : ""}`} />
                <div className={`bar ${score >= 5 ? "on" : ""}`} />

                <span className="meter-label">
                  {newPassword ? scoreLabel : ""}
                </span>
              </div>
            </div>

            {errorMessage && (
              <p className="login-error">
                {errorMessage}
              </p>
            )}

            {message && (
              <p className="success-message">
                {message}
                <br />
                Vous allez être redirigé vers la page de connexion dans quelques secondes.
              </p>
            )}

            <Button
              type="submit"
              texte={
                loading
                  ? "Réinitialisation..."
                  : "Réinitialiser"
              }
              disabled={
                loading ||
                !email.trim() ||
                !meetsPolicy(newPassword)
              }
            />
          </form>

          <div className="signup-links">
            <Link to="/login">
              <i className="fa-solid fa-right-to-bracket"></i>
              {" "}Se connecter
            </Link>

            <span className="divider">•</span>

            <Link to="/">
              <i className="fa-solid fa-house"></i>
              {" "}Retourner à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default ResetThePassword;