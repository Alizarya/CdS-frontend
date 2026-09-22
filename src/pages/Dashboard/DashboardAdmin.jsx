import { useState } from "react";

import Header from "../../components/Header/Header";
import AdminMember from "../../components/AdminMember/AdminMember";
import AdminContent from "../../components/AdminContent/AdminContent";
import AdminRss from "../../components/AdminRss/AdminRss";
import Footer from "../../components/Footer/Footer";

import "./DashboardAdmin.css";

function DashboardAdmin() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection((current) =>
      current === section ? null : section
    );
  };

  return (
    <>
      <Header />

      <main className="dashboard-admin">
        <div className="dashboard-admin-header">
          <h1>Tableau de bord administrateur</h1>

          <p>
            Gérez les membres, les contenus et les flux RSS du
            site.
          </p>
        </div>

        <div className="dashboard-admin-sections">

          {/* ==========================
              MEMBRES
              ========================== */}

          <section className="dashboard-admin-section">
            <button
              type="button"
              className={`dashboard-admin-menu ${
                openSection === "members"
                  ? "dashboard-admin-menu-open"
                  : ""
              }`}
              onClick={() => toggleSection("members")}
              aria-expanded={openSection === "members"}
            >
              <span>Gestion des membres</span>

              <span className="dashboard-admin-arrow">
                {openSection === "members" ? "▲" : "▼"}
              </span>
            </button>

            {openSection === "members" && (
              <div className="dashboard-admin-content">
                <AdminMember />
              </div>
            )}
          </section>

          {/* ==========================
              CONTENUS
              ========================== */}

          <section className="dashboard-admin-section">
            <button
              type="button"
              className={`dashboard-admin-menu ${
                openSection === "content"
                  ? "dashboard-admin-menu-open"
                  : ""
              }`}
              onClick={() => toggleSection("content")}
              aria-expanded={openSection === "content"}
            >
              <span>Gestion des contenus</span>

              <span className="dashboard-admin-arrow">
                {openSection === "content" ? "▲" : "▼"}
              </span>
            </button>

            {openSection === "content" && (
              <div className="dashboard-admin-content">
                <AdminContent />
              </div>
            )}
          </section>

          {/* ==========================
              RSS
              ========================== */}

          <section className="dashboard-admin-section">
            <button
              type="button"
              className={`dashboard-admin-menu ${
                openSection === "rss"
                  ? "dashboard-admin-menu-open"
                  : ""
              }`}
              onClick={() => toggleSection("rss")}
              aria-expanded={openSection === "rss"}
            >
              <span>Gestion du flux RSS</span>

              <span className="dashboard-admin-arrow">
                {openSection === "rss" ? "▲" : "▼"}
              </span>
            </button>

            {openSection === "rss" && (
              <div className="dashboard-admin-content">
                <AdminRss />
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default DashboardAdmin;