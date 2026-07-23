// Import des styles
import "../SignUp/SignUp.css";

import React, { useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import { mailToResetPassword } from "../../utils/userConnexion";

function ResetPassword() {
  const [userMail, setUserMail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //___________________________________________________
  // Envoi du mail de réinitialisation
  const handleReset = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      await mailToResetPassword(userMail.trim());

      setResetSuccess(true);
    } catch (error) {
      console.error("Erreur lors de la réinitialisation :", error);

      setErrorMessage(
        error.message ||
          "Impossible d'envoyer le mail de réinitialisation. Veuillez réessayer."
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
          {!resetSuccess ? (
            <>
              <h2>Mot de passe perdu ou oublié ?</h2>

              <p>
                Pas de panique. Saisissez l'adresse e-mail associée à votre
                compte et nous vous enverrons un lien permettant de choisir un
                nouveau mot de passe.
              </p>

              <form onSubmit={handleReset}>
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

                {errorMessage && (
                  <p className="login-error">{errorMessage}</p>
                )}

                <Button
                  type="submit"
                  texte={loading ? "Envoi..." : "Réinitialiser"}
                  disabled={loading}
                />
              </form>

              <div className="signup-links">
                <Link to="/">
                  <i className="fa-solid fa-house"></i> Retourner à l'accueil
                </Link>

                <span className="divider">•</span>

                <Link to="/login">
                  <i className="fa-solid fa-right-to-bracket"></i> Se connecter
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2>Demande envoyée</h2>

              <p>
                Si un compte est associé à cette adresse e-mail, un message
                contenant un lien de réinitialisation vient d'être envoyé.
              </p>

              <p>
                Pense également à vérifier ton dossier « Courrier indésirable »
                si tu ne reçois rien dans les prochaines minutes.
              </p>

              <div className="signup-links">
                <Link to="/login">
                  <i className="fa-solid fa-right-to-bracket"></i> Se connecter
                </Link>

                <span className="divider">•</span>

                <Link to="/">
                  <i className="fa-solid fa-house"></i> Retourner à l'accueil
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default ResetPassword;