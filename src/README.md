# Roomio - Platform Kos & Kontrakan Jember

Platform marketplace hyperlocal untuk kos dan kontrakan di Jember yang menghubungkan pemilik properti dengan pencari tempat tinggal (mahasiswa, pekerja, korporat).

## 🚀 Cara Menjalankan

### Opsi 1: Langsung Buka File HTML
1. Download atau clone repository ini
2. Buka file `index.html` di browser Anda
3. Aplikasi siap digunakan!

### Opsi 2: Menggunakan Web Server Lokal
Untuk pengalaman yang lebih baik, gunakan web server lokal:

#### Menggunakan Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Menggunakan Node.js (http-server):
```bash
npm install -g http-server
http-server -p 8000
```

#### Menggunakan PHP:
```bash
php -S localhost:8000
```

Setelah server berjalan, buka browser dan akses:
```
http://localhost:8000
```

## 📁 Struktur File

```
roomio/
├── index.html              # Halaman utama (HomePage)
├── search.html             # Halaman pencarian listing
├── listing-detail.html     # Detail properti
├── auth.html              # Login & registrasi
├── create-listing.html    # Form tambah listing (Host)
├── user-dashboard.html    # Dashboard user
├── host-dashboard.html    # Dashboard pemilik properti
├── inbox.html            # Chat/pesan
├── profile.html          # Halaman profil user
├── js/
│   ├── auth.js           # Manajemen autentikasi
│   └── listings.js       # Data dan fungsi listing
└── README.md             # Dokumentasi ini
```

## ✨ Fitur Utama

### Untuk Pencari Kos/Kontrakan:
- 🔍 **Pencarian Advanced** - Filter berdasarkan kategori, lokasi, harga, fasilitas
- ⭐ **Favorit** - Simpan properti favorit
- 📅 **Booking** - Sistem booking langsung
- 💬 **Chat** - Komunikasi dengan pemilik properti
- 📱 **Responsive** - Mobile-friendly design

### Untuk Pemilik Properti (Host):
- ➕ **Tambah Listing** - Form multi-step yang mudah
- 📊 **Dashboard** - Kelola semua listing Anda
- 📈 **Statistik** - Lihat performa listing
- 💬 **Inbox** - Terima dan balas pertanyaan calon penyewa

### Fitur Umum:
- 🔐 **Autentikasi** - Login/Register dengan role (User/Host/Both)
- 👤 **Profil** - Kelola informasi pribadi
- 📍 **Lokasi** - Fokus hyperlocal area Jember
- ✅ **Verifikasi** - Badge untuk listing terverifikasi

## 🎨 Teknologi yang Digunakan

- **HTML5** - Struktur halaman
- **Bootstrap 5.3** - Framework CSS untuk styling dan komponen
- **Bootstrap Icons** - Icon library
- **JavaScript (Vanilla)** - Interaktivitas
- **LocalStorage** - Penyimpanan data sementara di browser

## 📖 Panduan Penggunaan

### Untuk Pencari Kos:

1. **Mencari Properti:**
   - Buka halaman utama
   - Gunakan search bar atau pilih kategori
   - Filter hasil pencarian sesuai kebutuhan
   - Klik listing untuk melihat detail

2. **Booking Properti:**
   - Login/daftar terlebih dahulu
   - Buka detail listing
   - Pilih tanggal masuk dan durasi
   - Klik "Booking Sekarang"
   - Lihat booking Anda di User Dashboard

3. **Menyimpan Favorit:**
   - Klik icon hati pada listing
   - Akses semua favorit di User Dashboard

### Untuk Pemilik Properti:

1. **Daftar sebagai Host:**
   - Klik "Masuk / Daftar"
   - Pilih role "Pemilik Properti" atau "Keduanya"
   - Lengkapi data registrasi

2. **Menambah Listing:**
   - Login sebagai Host
   - Klik "Tambah Listing" di sidebar
   - Isi form 4 langkah:
     - Info Dasar (judul, kategori, harga, lokasi)
     - Detail Properti (deskripsi, fasilitas, peraturan)
     - Upload Foto (minimal 4 foto)
     - Review & Publikasi
   - Klik "Publikasikan"

3. **Mengelola Listing:**
   - Buka Host Dashboard
   - Lihat semua listing Anda
   - Edit atau hapus listing
   - Pantau statistik

## 🔐 Demo Akun

Untuk testing, Anda bisa login dengan data apapun. Sistem akan otomatis membuat akun demo.

**Contoh:**
- Email: `demo@roomio.com`
- Password: `password123`
- Role: Pilih sesuai kebutuhan

## 🌟 Fitur Mock/Demo

Aplikasi ini menggunakan data mock untuk demonstrasi:

- **Autentikasi:** Menggunakan LocalStorage (tidak ada backend real)
- **Listings:** Data contoh properti disimpan di `js/listings.js`
- **Booking:** Disimpan di LocalStorage
- **Chat:** Percakapan simulasi
- **Upload Foto:** Preview lokal (tidak di-upload ke server)

## 💾 Data Storage

Semua data disimpan di **Browser LocalStorage**:
- `currentUser` - Data user yang sedang login
- `favorites` - Daftar listing favorit
- `bookings` - Daftar booking user
- `hostListings` - Listing yang dibuat host

**Note:** Data akan hilang jika LocalStorage di-clear atau browser di-reset.

## 🎯 Roadmap & Pengembangan Lebih Lanjut

Untuk mengubah ini menjadi aplikasi production-ready:

1. **Backend Integration:**
   - Setup REST API (Node.js/PHP/Python)
   - Database (MySQL/PostgreSQL/MongoDB)
   - Autentikasi real dengan JWT/Session

2. **Payment Gateway:**
   - Integrasi Midtrans/Xendit untuk pembayaran

3. **Google Maps API:**
   - Peta interaktif real
   - Geolocation dan routing

4. **Upload File:**
   - Storage untuk foto (AWS S3, Cloudinary, dll)

5. **Real-time Chat:**
   - WebSocket atau Firebase untuk chat real-time

6. **Email Notifications:**
   - Konfirmasi booking, reminder, dll

7. **Admin Panel:**
   - Dashboard untuk admin
   - Moderasi listing

## 📱 Browser Support

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## 🐛 Known Issues

- Upload foto hanya preview, tidak tersimpan permanen
- Data akan hilang jika LocalStorage di-clear
- Google Maps belum terintegrasi (placeholder)
- Payment gateway belum diimplementasi

## 📄 License

Project ini dibuat untuk keperluan portfolio dan pembelajaran.

## 👨‍💻 Developer

Dikembangkan dengan ❤️ menggunakan Bootstrap 5

---

## 🆘 Troubleshooting

### Website tidak bisa dibuka
- Pastikan semua file dalam satu folder
- Coba gunakan web server lokal

### Data hilang setelah refresh
- Normal, karena menggunakan LocalStorage
- Data akan hilang jika clear browser data

### Gambar tidak muncul
- Pastikan koneksi internet aktif (gambar dari Unsplash)
- Cek console browser untuk error

### Fitur tidak berfungsi
- Pastikan JavaScript enabled di browser
- Cek console browser untuk error
- Refresh halaman

---

**Selamat mencoba! 🎉**

Untuk pertanyaan atau bantuan, silakan buka GitHub Issues.
