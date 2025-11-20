import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import TambahGuru from "../components/TambahGuru";
import { exportToExcel } from "../utils/exportExcel";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function DashboardGuru() {
  const [user, setUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("guruUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchRows = async () => {
      if (!user) return;
      const q = query(
        collection(db, "bimbingan"),
        where("kode_pembimbing", "==", user.kode_pembimbing)
      );
      const snap = await getDocs(q);
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchRows();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("guruUser");
    window.location.href = "/login";
  };

  // 🔹 Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Bimbingan", 14, 15);
    doc.text(`Pembimbing: ${user.nama} (${user.kode_pembimbing})`, 14, 23);

    const tableData = filteredRows.map((r, i) => [
      i + 1,
      r.nisn,
      r.nama,
      r.tanggal ||
        (r.created_at?.toDate
          ? r.created_at.toDate().toLocaleDateString()
          : "-"),
      r.keterangan,
      user.nama,
    ]);

    doc.autoTable({
      startY: 30,
      head: [
        ["No", "NISN", "Nama Siswa", "Tanggal", "Keterangan", "Pembimbing"],
      ],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [56, 189, 248] },
    });

    doc.save(`bimbingan_${user.kode_pembimbing}.pdf`);
  };

  // 🔎 Filter & Search Logic
  const filteredRows = rows.filter((r) => {
    const matchNama =
      r.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchTanggal = filterDate
      ? (
          r.tanggal ||
          (r.created_at?.toDate
            ? r.created_at.toDate().toISOString().split("T")[0]
            : "")
        ).includes(filterDate)
      : true;
    return matchNama && matchTanggal;
  });

  const theme = document.documentElement.getAttribute("data-theme") || "light";
  const isDark = theme === "dark";

  if (!user)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
          color: isDark ? "#f8fafc" : "#1e293b",
        }}
      >
        <p>Silakan login terlebih dahulu.</p>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#0f172a" : "#f9fafb",
        color: isDark ? "#f1f5f9" : "#111827",
        padding: "20px 16px 60px",
        transition: "background 0.4s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          borderRadius: 12,
          padding: "16px 20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Dashboard Guru</h2>
          <p
            style={{ margin: "4px 0 0", color: isDark ? "#94a3b8" : "#64748b" }}
          >
            {user.nama} — {user.kode_pembimbing}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() =>
              exportToExcel(
                filteredRows.map((r) => ({ ...r, pembimbing: user.nama })),
                `bimbingan_${user.kode_pembimbing || "all"}`
              )
            }
            disabled={filteredRows.length === 0}
            style={{
              backgroundColor: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              fontWeight: 600,
              cursor: filteredRows.length > 0 ? "pointer" : "not-allowed",
              opacity: filteredRows.length > 0 ? 1 : 0.6,
            }}
          >
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            disabled={filteredRows.length === 0}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              fontWeight: 600,
              cursor: filteredRows.length > 0 ? "pointer" : "not-allowed",
              opacity: filteredRows.length > 0 ? 1 : 0.6,
            }}
          >
            Export PDF
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Admin Section */}
      {user.role === "admin" && (
        <div
          style={{
            marginBottom: 20,
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderRadius: 12,
            padding: "16px 20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Manajemen Guru Pembimbing</h3>
          <TambahGuru />
        </div>
      )}

      {/* Filter Section */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Cari nama siswa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${isDark ? "#334155" : "#d1d5db"}`,
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            color: isDark ? "#f1f5f9" : "#111827",
            fontSize: 14,
          }}
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${isDark ? "#334155" : "#d1d5db"}`,
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            color: isDark ? "#f1f5f9" : "#111827",
            fontSize: 14,
          }}
        />
        {(searchTerm || filterDate) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterDate("");
            }}
            style={{
              padding: "8px 12px",
              backgroundColor: "#e11d48",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Tabel Data */}
      <div
        style={{
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          borderRadius: 12,
          padding: "16px 20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Daftar Bimbingan</h3>

        {filteredRows.length === 0 ? (
          <p style={{ color: isDark ? "#94a3b8" : "#6b7280" }}>
            Tidak ada data sesuai filter.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem",
              minWidth: 700,
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: isDark ? "#334155" : "#e2e8f0",
                  color: isDark ? "#f8fafc" : "#1e293b",
                }}
              >
                <th style={{ padding: 10, textAlign: "left" }}>NISN</th>
                <th style={{ padding: 10, textAlign: "left" }}>Nama Siswa</th>
                <th style={{ padding: 10, textAlign: "left" }}>Tanggal</th>
                <th style={{ padding: 10, textAlign: "left" }}>Keterangan</th>
                <th style={{ padding: 10, textAlign: "left" }}>Pembimbing</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr
                  key={r.id}
                  style={{
                    borderBottom: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
                  }}
                >
                  <td style={{ padding: 10 }}>{r.nisn}</td>
                  <td style={{ padding: 10 }}>{r.nama}</td>
                  <td style={{ padding: 10 }}>
                    {r.tanggal ||
                      (r.created_at?.toDate
                        ? r.created_at.toDate().toLocaleDateString()
                        : "-")}
                  </td>
                  <td style={{ padding: 10 }}>{r.keterangan}</td>
                  <td style={{ padding: 10 }}>{user.nama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
