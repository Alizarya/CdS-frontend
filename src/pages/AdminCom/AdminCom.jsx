
import { useState } from "react";
import axios from "axios";

import Header from "../../components/Header/Header";
import AdminContent from "../../components/AdminContent/AdminContent";
import AdminRss from "../../components/AdminRss/AdminRss";

import "./adminCom.css";

const API_URL = "https://api.cafe-sciences.org";

function AdminCom() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(
    () => sessionStorage.getItem("communicationToken") || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [contentOpen, setContentOpen] = useState(false);
  const [rssOpen, setRssOpen] = useState(false);

  // Connexion
  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/communication/login`,
        { password }
      );

      const receivedToken = response.data.token;

      if (!receivedToken) {
        throw new Error("Aucun token reçu par le serveur.");
      }

      sessionStorage.setItem("communicationToken", receivedToken);
      setToken(receivedToken);
      setPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Connexion impossible. Vérifiez le mot de passe."
      );
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const handleLogout = () => {
    sessionStorage.removeItem("communicationToken");
    setToken("");
    setPassword("");
    setError("");
    setContentOpen(false);
    setRssOpen(false);
  };

  // Page de connexion
  if (!token) {
    return (
      <>
        <Header />

        <main className="admin-com-login">
          <form
            className="admin-com-login-form"
            onSubmit={handleLogin}
          >
            <h1>Administration communication</h1>

            <label htmlFor="communication-password">
              Mot de passe
            </label>

            <input
              id="communication-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />

            {error && (
              <p className="admin-com-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </main>
      </>
    );
  }

  // Interface d'administration
  return (
    <>
      <Header />

      <main className="admin-com">
        <header className="admin-com-header">
          <h1>Administration communication</h1>

          <button
            type="button"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </header>

        {/* Gestion des contenus */}
        <section className="admin-com-panel">
          <button
            type="button"
            className="admin-com-panel-toggle"
            onClick={() => setContentOpen((prev) => !prev)}
            aria-expanded={contentOpen}
            aria-controls="admin-content-panel"
          >
            <span>Gestion des contenus</span>

            <span
              className={`admin-com-chevron ${
                contentOpen ? "is-open" : ""
              }`}
              aria-hidden="true"
            >
              ⌄
            </span>
          </button>

          {contentOpen && (
            <div
              id="admin-content-panel"
              className="admin-com-panel-content"
            >
              <AdminContent token={token} />
            </div>
          )}
        </section>

        {/* Gestion des flux RSS */}
        <section className="admin-com-panel">
          <button
            type="button"
            className="admin-com-panel-toggle"
            onClick={() => setRssOpen((prev) => !prev)}
            aria-expanded={rssOpen}
            aria-controls="admin-rss-panel"
          >
            <span>Gestion des flux RSS</span>

            <span
              className={`admin-com-chevron ${
                rssOpen ? "is-open" : ""
              }`}
              aria-hidden="true"
            >
              ⌄
            </span>
          </button>

          {rssOpen && (
            <div
              id="admin-rss-panel"
              className="admin-com-panel-content"
            >
              <AdminRss token={token} />
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default AdminCom;