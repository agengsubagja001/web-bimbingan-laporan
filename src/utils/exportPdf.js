import jsPDF from "jspdf";
import "jspdf-autotable";

export function exportToPdf(rows, filename = "report") {
  const doc = new jsPDF("p", "mm", "a4"); // portrait, milimeter, A4

  // Header laporan
  doc.setFontSize(14);
  doc.text("Rekap Bimbingan - SMK TARUNA BHAKTI - RPL", 10, 10);

  // Data untuk tabel
  const table = rows.map((r) => [
    r.nisn,
    r.nama,
    r.tanggal ||
      (r.created_at?.toDate ? r.created_at.toDate().toLocaleDateString() : ""),
    r.keterangan,
    r.nama_pembimbing || "-",
    "", // kolom paraf (kosong)
  ]);

  // Buat tabel
  doc.autoTable({
    head: [
      [
        "NISN",
        "Nama Siswa",
        "Tanggal Bimbingan",
        "Keterangan",
        "Nama Pembimbing",
        "Paraf",
      ],
    ],
    body: table,
    startY: 20,
    styles: {
      fontSize: 10,
      cellPadding: 4, // jarak antar teks dan border
      valign: "middle",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 25 }, // NISN
      1: { cellWidth: 35 }, // Nama
      2: { cellWidth: 28 }, // Tanggal
      3: { cellWidth: 45 }, // Keterangan
      4: { cellWidth: 35 }, // Nama Pembimbing
      5: { cellWidth: 25 }, // Paraf (lebih lebar)
    },
    margin: { left: 10, right: 10 },
  });

  // Simpan PDF
  doc.save(filename + ".pdf");
}
