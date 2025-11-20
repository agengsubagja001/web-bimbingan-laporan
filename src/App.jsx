import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import FormBimbingan from "./pages/FormBimbingan";
import RekapSiswa from "./pages/RekapSiswa";
import LoginGuru from "./pages/LoginGuru";
import DashboardGuru from "./pages/DashboardGuru";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : "light"
    );
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme === "dark" ? "#1e1e1e" : "#f4f6f8",
        color: theme === "dark" ? "#f5f5f5" : "#222",
        transition: "0.3s",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          backgroundColor: theme === "dark" ? "#2c2c2c" : "white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 20,
          flexWrap: "wrap",
        }}
      >
        {/* Judul */}
        <div style={{ flex: "1 1 220px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "1.1rem",
              color: theme === "dark" ? "#fff" : "#007bff",
            }}
          >
            SMK TARUNA BHAKTI - RPL
          </h1>
          <div
            style={{
              fontSize: "0.8rem",
              color: theme === "dark" ? "#aaa" : "#555",
            }}
          >
            Sistem Bimbingan Laporan PKL
          </div>
        </div>

        {/* Tombol hamburger */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: theme === "dark" ? "#fff" : "#333",
            display: "none",
          }}
        >
          ☰
        </button>

        {/* NAVIGATION */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Form Bimbingan
          </Link>
          <Link to="/rekap" onClick={() => setMenuOpen(false)}>
            Cek Rekap
          </Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Login Guru
          </Link>
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main
        style={{
          maxWidth: "960px",
          margin: "20px auto",
          padding: "16px",
        }}
      >
        <div
          className="card"
          style={{
            backgroundColor: theme === "dark" ? "#2a2a2a" : "white",
            borderRadius: "12px",
            boxShadow:
              theme === "dark"
                ? "0 2px 8px rgba(0,0,0,0.4)"
                : "0 2px 8px rgba(0,0,0,0.08)",
            padding: "20px",
          }}
        >
          <Routes>
            <Route path="/" element={<FormBimbingan />} />
            <Route path="/rekap" element={<RekapSiswa />} />
            <Route path="/login" element={<LoginGuru />} />
            <Route path="/dashboard" element={<DashboardGuru />} />
          </Routes>
        </div>
      </main>

      {/* STYLE */}
      <style>{`
        /* NAVIGATION LINK STYLE */
        .nav-links {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .nav-links a {
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          background-color: #007bff;
          color: white;
          font-size: 0.9rem;
          transition: 0.2s;
        }
        .nav-links a:hover {
          background-color: #0056b3;
        }

        .theme-toggle {
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 14px;
          cursor: pointer;
        }
        .theme-toggle:hover {
          background-color: #5a6268;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .menu-toggle {
            display: block !important;
          }

          .nav-links {
            width: 100%;
            display: none;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            margin-top: 10px;
            background: ${theme === "dark" ? "#2c2c2c" : "#fff"};
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .nav-links.open {
            display: flex;
          }

          .nav-links a,
          .theme-toggle {
            width: 100%;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}