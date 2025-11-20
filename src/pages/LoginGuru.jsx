import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

export default function LoginGuru() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("guruUser");
    if (storedUser) nav("/dashboard");
  }, [nav]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const ref = collection(db, "pembimbing");
      const q = query(ref, where("email", "==", email));
      const snap = await getDocs(q);

      if (snap.empty) {
        setMsg("⚠️ Email tidak ditemukan!");
        setLoading(false);
        return;
      }

      const userData = snap.docs[0].data();
      if (userData.password !== password) {
        setMsg("⚠️ Password salah!");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "guruUser",
        JSON.stringify({
          email: userData.email,
          nama: userData.nama,
          kode_pembimbing: userData.kode_pembimbing,
          role: userData.role || "pembimbing",
        })
      );

      nav("/dashboard");
    } catch (err) {
      console.error(err);
      setMsg("Terjadi kesalahan saat login!");
    } finally {
      setLoading(false);
    }
  };

  const theme = document.documentElement.getAttribute("data-theme") || "light";
  const isDark = theme === "dark";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#0f172a" : "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        transition: "background 0.4s ease",
      }}
    >
      <div
        style={{
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          color: isDark ? "#f1f5f9" : "#111827",
          borderRadius: 16,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: 380,
          padding: "32px 28px",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Login Guru
        </h2>
        <p
          style={{
            color: isDark ? "#94a3b8" : "#6b7280",
            fontSize: "0.9rem",
            marginBottom: 24,
          }}
        >
          Masuk untuk mengakses dashboard pembimbing
        </p>

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px 14px",
              border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
              borderRadius: 10,
              background: isDark ? "#1e293b" : "#ffffff",
              color: isDark ? "#f1f5f9" : "#111827",
              fontSize: 15,
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />

          {/* Password + Toggle */}
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "12px 40px 12px 14px", // padding kanan 40px agar teks tidak tertutup ikon
                border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
                borderRadius: 10,
                background: isDark ? "#1e293b" : "#ffffff",
                color: isDark ? "#f1f5f9" : "#111827",
                fontSize: 15,
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: isDark ? "#cbd5e1" : "#475569",
                cursor: "pointer",
                fontSize: 16,
              }}
              aria-label={showPass ? "Sembunyikan password" : "Lihat password"}
            >
              {showPass ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: isDark ? "#3b82f6" : "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 14px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              transition: "all 0.2s ease",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

          {msg && (
            <div
              style={{
                color: isDark ? "#f87171" : "#dc2626",
                fontSize: "0.9rem",
                marginTop: 4,
              }}
            >
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
