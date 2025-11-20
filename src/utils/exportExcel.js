import * as XLSX from "xlsx";

export function exportToExcel(rows, filename = "export") {
  const data = rows.map((r) => ({
    NISN: r.nisn,
    Nama_Siswa: r.nama,
    Tanggal_bimbingan:
      r.tanggal ||
      (r.created_at?.toDate ? r.created_at.toDate().toLocaleDateString() : ""),
    Keterangan: r.keterangan,
    Pembimbing: r.nama_pembimbing,
    Paraf: " ",
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename + ".xlsx");
}
