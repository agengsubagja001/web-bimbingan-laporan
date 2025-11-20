# PKL Bimbingan - SMK TARUNA BHAKTI - RPL
Template React + Firebase (Firestore + Auth) untuk mencatat bimbingan laporan PKL.
Termasuk fitur:
- Form bimbingan siswa (validasi kode pembimbing)
- Rekap per NISN (download Excel / PDF)
- Dashboard guru (multi-guru + admin) dan tambah guru
- Toggle tema gelap/terang

## Cara pakai (singkat)
1. Install:
   ```
   npm install
   npm run dev
   ```
2. Buat project Firebase: aktifkan Firestore & Authentication.
3. Ganti `src/firebase/config.js` dengan config Firebase Anda.
4. Untuk deploy ke Firebase Hosting:
   - `npm run build`
   - `firebase init` (pilih hosting)
   - `firebase deploy`

## Catatan
- Password default saat membuat akun guru lewat fitur 'Tambah Guru' adalah `kode_pembimbing` (opsional).
- Periksa dan sesuaikan security rules Firestore sebelum produksi.
