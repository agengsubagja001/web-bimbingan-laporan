import React, { useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { exportToExcel } from "../utils/exportExcel";
import { exportToPdf } from "../utils/exportPdf";

export default function RekapSiswa() {
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState([]);

  const handleCari = async () => {
    if (!keyword.trim()) {
      setRows([]);
      return;
    }

    const ref = collection(db, "bimbingan");

    const q1 = query(
      ref,
      where("nisn", "==", keyword),
      orderBy("created_at", "desc")
    );
    const q2 = query(
      ref,
      where("nama", "==", keyword),
      orderBy("created_at", "desc")
    );

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const combined = [...snap1.docs, ...snap2.docs].filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );

    const data = await Promise.all(
      combined.map(async (d) => {
        const item = d.data();
        let namaPembimbing = "-";
        try {
          if (item.kode_pembimbing) {
            const pembimbingRef = collection(db, "pembimbing");
            const qPembimbing = query(
              pembimbingRef,
              where("kode_pembimbing", "==", item.kode_pembimbing)
            );
            const pembimbingSnap = await getDocs(qPembimbing);
            if (!pembimbingSnap.empty) {
              namaPembimbing = pembimbingSnap.docs[0].data().nama;
            }
          }
        } catch (err) {
          console.error("Gagal mengambil nama pembimbing:", err);
        }
        return { id: d.id, ...item, nama_pembimbing: namaPembimbing };
      })
    );

    setRows(data);
  };

  return (
    <div
      style={{
        padding: "16px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <h2
        style={{
          textAlign: "center",
          marginBottom: "16px",
          color: "#055cb9ff",
          fontSize: "1.4rem",
        }}
      >
        📘 Rekap Bimbingan Siswa
      </h2>

      {/* Pencarian */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Masukkan NISN"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "320px",
            padding: "10px 12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleCari}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            width: "100%",
            maxWidth: "150px",
          }}
        >
          Cari
        </button>
      </div>

      {/* Tabel Responsif */}
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#007bff",
                color: "white",
                textAlign: "left",
              }}
            >
              <th style={{ padding: 10 }}>Tanggal</th>
              <th style={{ padding: 10 }}>Nama</th>
              <th style={{ padding: 10 }}>NISN</th>
              <th style={{ padding: 10 }}>Keterangan</th>
              <th style={{ padding: 10 }}>Pembimbing</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 12 }}>
                  Tidak ada data ditemukan
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 10 }}>
                    {r.tanggal ||
                      (r.created_at?.toDate
                        ? r.created_at.toDate().toLocaleDateString()
                        : "-")}
                  </td>
                  <td style={{ padding: 10 }}>{r.nama}</td>
                  <td style={{ padding: 10 }}>{r.nisn}</td>
                  <td style={{ padding: 10 }}>{r.keterangan}</td>
                  <td style={{ padding: 10 }}>{r.nama_pembimbing}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tombol Export */}
      {rows.length > 0 && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <button
            onClick={() => exportToExcel(rows, `rekap_${keyword}`)}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            📊 Download Excel
          </button>
          <button
            onClick={() => exportToPdf(rows, `rekap_${keyword}`)}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            📄 Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
