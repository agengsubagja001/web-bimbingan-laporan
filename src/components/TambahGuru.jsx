import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function TambahGuru() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    kode_pembimbing: "",
    password: "",
    role: "pembimbing",
  });
  const [showPass, setShowPass] = useState(false);
  const [msg, setMsg] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      await addDoc(collection(db, "pembimbing"), {
        nama: form.nama,
        email: form.email,
        kode_pembimbing: form.kode_pembimbing,
        password: form.password,
        role: form.role,
      });

      setMsg("✅ Berhasil menambahkan guru!");
      setForm({
        nama: "",
        email: "",
        kode_pembimbing: "",
        password: "",
        role: "pembimbing",
      });
    } catch (err) {
      console.error(err);
      setMsg("❌ Gagal: " + err.message);
    }
  };

  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        padding: 16,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.03)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Tambah Guru Baru</h3>
      <form
        onSubmit={handleAdd}
        style={{
          display: "grid",
          gap: 10,
          maxWidth: 400,
        }}
      >
        <input
          required
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          style={inputStyle}
        />
        <input
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
        />
        <input
          required
          placeholder="Kode Pembimbing (unik)"
          value={form.kode_pembimbing}
          onChange={(e) =>
            setForm({ ...form, kode_pembimbing: e.target.value })
          }
          style={inputStyle}
        />

        {/* Input Password + Tombol 👁️ sejajar */}
        <div style={{ position: "relative", width: "100%" }}>
          <input
            required
            placeholder="Masukkan Password"
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{
              ...inputStyle,
              width: "100%",
              paddingRight: "36px", // beri ruang kanan untuk tombol mata
            }}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={eyeButtonStyle}
            aria-label={showPass ? "Sembunyikan password" : "Lihat password"}
          >
            {showPass ? "👁️‍🗨️" : "👁️"}
          </button>
        </div>

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          style={inputStyle}
        >
          <option value="pembimbing">Pembimbing</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 14px",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Tambah Guru
        </button>

        {msg && (
          <div
            style={{
              fontSize: "0.9rem",
              color: msg.startsWith("✅") ? "#16a34a" : "#dc2626",
              marginTop: 4,
            }}
          >
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}

// 🔹 Style input & tombol mata
const inputStyle = {
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: "0.95rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const eyeButtonStyle = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  fontSize: 16,
  cursor: "pointer",
  color: "#64748b",
  padding: 0,
  lineHeight: 1,
};
