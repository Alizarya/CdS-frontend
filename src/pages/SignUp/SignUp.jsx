

// Import des styles
import "./SignUp.css";

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import { registerUser } from "../../utils/userConnexion";

function SignUp() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [userCode, setUserCode] = useState("");
  const [userMail, setUserMail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [emailTaken, setEmailTaken] = useState(false); // ← cas “email déjà enregistré”

  const [showPassword, setShowPassword] = useState(false);

  const successHeadingRef = useRef(null);

  // Préremplir le code depuis l'URL: /signup?code=ABC123
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setUserCode(formatInviteCode(codeFromUrl));
    }
  }, [searchParams]);

  // Helpers validation
  const formatInviteCode = (val) =>
    val.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 24);

  const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email.trim());

  const passwordScore = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 5); // 0..5
  };

  const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const meetsPolicy = (pwd) => PASSWORD_REGEX.test(pwd);

const computeErrors = () => {
  const newErrors = {};

  if (!userCode.trim()) {
    newErrors.userCode = "Le code d'inscription est requis.";
  }

  if (!userMail.trim()) {
    newErrors.userMail = "L'adresse e-mail est requise.";
  } else if (!isValidEmail(userMail)) {
    newErrors.userMail = "Adresse e-mail invalide.";
  }

  if (!userPassword) {
    newErrors.userPassword = "Le mot de passe est requis.";
  } else if (!meetsPolicy(userPassword)) {
    newErrors.userPassword =
      "Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule, un chiffre et un caractère spécial.";
  }

  if (!isAgreed) {
    newErrors.isAgreed = "Tu dois accepter le règlement.";
  }

  return newErrors;
};

  // Focus sur le titre en cas de succès
  useEffect(() => {
    if (registrationSuccess && successHeadingRef.current) {
      successHeadingRef.current.focus();
    }
  }, [registrationSuccess]);

// Redirection automatique vers la page de connexion
  useEffect(() => {
  if (!registrationSuccess) return;

  const timer = setTimeout(() => {
    navigate("/login");
  }, 5000);

  return () => clearTimeout(timer);
}, [registrationSuccess, navigate]);

  // Clear état “email déjà pris” quand l’email change
  useEffect(() => {
    if (emailTaken) setEmailTaken(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userMail]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setApiError("");
    setEmailTaken(false);

    // Validation côté client
    const newErrors = computeErrors();
    setErrors(newErrors);
    const firstKey = Object.keys(newErrors)[0];
    if (firstKey) {
      const el = document.getElementById(firstKey);
      if (el) el.focus();
      return;
    }

    try {
      setSubmitting(true);

      await registerUser(userCode.trim(), userMail.trim(), userPassword, isAgreed);

      // OK : reset + message
      setUserCode("");
      setUserMail("");
      setUserPassword("");
      setIsAgreed(false);
      setErrors({});
      setRegistrationSuccess(true);
    } catch (error) {
      const msg =
        error.message ||
        "Une erreur est survenue lors de l'inscription.";

      // Détecte “email déjà enregistré”
      if (/déjà/i.test(msg) || /existe/i.test(msg) || /already/i.test(msg)) {
        setEmailTaken(true);
        setApiError(""); // on masque le message générique si c’est ce cas
      } else {
        setApiError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const score = passwordScore(userPassword);
  const scoreLabel =
    score <= 1 ? "Très faible" : score === 2 ? "Faible" : score === 3 ? "Correct" : score === 4 ? "Bon" : "Fort";

  return (
    <>
      <Header />
      <main className="main-signup">
        <div className="signup-container">
          {registrationSuccess ? (
            <>
              <h2 tabIndex={-1} ref={successHeadingRef}>
                Inscription à l’espace membre
              </h2>
              <p>Votre inscription est réussie, un mail de confirmation vient de vous être envoyé.</p>
              <p> Vous allez être redirigé.e automatiquement vers la page de connexion dans quelques secondes.</p>
              <Link to="/login">
                <i className="fa-solid fa-right-to-bracket" /> Vous connecter
              </Link>
            </>
          ) : (
            <>
              <h2>Inscription à l’espace membre</h2>
              <p>
                Si tu ne possèdes pas de code d’inscription, adresse toi au bureau de
                l’association pour l’obtenir.
              </p>

              {apiError && (
                <div
                  role="alert"
                  style={{
                    background: "#fdecec",
                    border: "1px solid #f5c2c2",
                    color: "#842029",
                    padding: "8px 12px",
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSignUp} noValidate>
                <div className="form-group">
                  <label htmlFor="userCode">Code d’inscription</label>
                  <input
                    type="text"
                    id="userCode"
                    name="userCode"
                    inputMode="text"
                    autoComplete="one-time-code"
                    value={userCode}
                    onChange={(e) => setUserCode(formatInviteCode(e.target.value))}
                    aria-invalid={Boolean(errors.userCode)}
                    aria-describedby={errors.userCode ? "userCode-error" : undefined}
                    required
                  />
                  {errors.userCode && (
                    <p className="field-error" id="userCode-error">
                      {errors.userCode}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="userMail">Adresse e-mail</label>
                  <input
                    type="email"
                    id="userMail"
                    name="userMail"
                    autoComplete="email"
                    value={userMail}
                    onChange={(e) => setUserMail(e.target.value)}
                    aria-invalid={Boolean(errors.userMail)}
                    aria-describedby={errors.userMail ? "userMail-error" : undefined}
                    required
                  />
                  {errors.userMail && (
                    <p className="field-error" id="userMail-error">
                      {errors.userMail}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="userPassword">Mot de passe</label>

                  <input
                    type={showPassword ? "text" : "password"}
                    id="userPassword"
                    name="userPassword"
                    autoComplete="new-password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    aria-invalid={Boolean(errors.userPassword)}
                    aria-describedby={
                      errors.userPassword
                        ? "userPassword-error userPassword-help"
                        : "userPassword-help"
                    }
                    required
                  />

                  {/* Bouton en dessous */}
                  <button
                    type="button"
                    className="toggle-password toggle-password--below"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  </button>

                  <p id="userPassword-help" className="passObligation">
                    Le mot de passe doit contenir au minimum 8 caractères, incluant au moins une
                    lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.
                  </p>

                  {/* Indicateur de force */}
                  <div className="password-meter" aria-hidden="true">
                    <div className={`bar ${score >= 1 ? "on" : ""}`} />
                    <div className={`bar ${score >= 2 ? "on" : ""}`} />
                    <div className={`bar ${score >= 3 ? "on" : ""}`} />
                    <div className={`bar ${score >= 4 ? "on" : ""}`} />
                    <div className={`bar ${score >= 5 ? "on" : ""}`} />
                    <span className="meter-label">{userPassword ? scoreLabel : ""}</span>
                  </div>

                  {errors.userPassword && (
                    <p className="field-error" id="userPassword-error">
                      {errors.userPassword}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      aria-invalid={Boolean(errors.isAgreed)}
                      aria-describedby={errors.isAgreed ? "agree-error" : undefined}
                      required
                    />
                    <span className="checkbox-text">
                      Je m’engage à respecter{" "}
                      <a
                        href="https://cafe-sciences.org/static/media/Reglement-interieur-du-Cafe-des-Sciences.48277f6d25f05c55de87.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        le règlement du café
                      </a>.
                    </span>
                  </label>
                  {errors.isAgreed && (
                    <p className="field-error" id="agree-error">
                      {errors.isAgreed}
                    </p>
                  )}
                </div>

                {/* Bouton : désactivé si invalide / en cours */}
                <Button
                  type="submit"
                  texte={submitting ? "Inscription..." : "S'inscrire"}
                  disabled={
                    submitting ||
                    !userCode.trim() ||
                    !isValidEmail(userMail) ||
                    !meetsPolicy(userPassword) ||
                    !isAgreed
                  }
                />

                {/* Message spécifique “email déjà enregistré” SOUS le bouton */}
                {emailTaken && (
                  <div
                    role="alert"
                    style={{
                      marginTop: 10,
                      background: "#fff8e1",
                      border: "1px solid #ffe08a",
                      color: "#7a5b00",
                      padding: "8px 12px",
                      borderRadius: 8,
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      Cet e-mail est déjà enregistré. Tu peux{" "}
                      <Link to="/ResetPassword">réinitialiser ton mot de passe</Link> ou{" "}
                      <Link to="/login">te connecter</Link>.
                    </p>
                  </div>
                )}
              </form>

              <div className="signup-links">
                <Link to="/">
                  <i className="fa-solid fa-house" /> Retourner à l’accueil
                </Link>
                <span className="divider">•</span>
                <Link to="/login">
                  <i className="fa-solid fa-right-to-bracket" /> Déjà inscrit ? Se connecter
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default SignUp;
