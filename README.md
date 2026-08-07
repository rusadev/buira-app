# Buira App - Modular Multi-Tenant SaaS POS System ☕🍗

**Buira App** adalah sistem Kasir (Point of Sale / POS) F&B modern berbasis web yang dirancang dengan arsitektur **Modular Multi-Tenant / Multi-Entity**. Aplikasi ini memungkinkan pelaku usaha mengelola berbagai entitas bisnis F&B (seperti **Coffee Shop** & **Ayam Geprek / Restoran**) dalam satu platform terpusat yang fleksibel untuk dikembangkan menjadi **SaaS Platform**.

---

## 🌟 Fitur Utama

- 🏢 **Multi-Business Entity Switcher**: Pemisahan katalog, varian produk, stok bahan baku, denah meja, KDS, dan laporan keuangan per entitas usaha.
- 🛒 **POS Kasir Interaktif (Light Mode & Flat Design)**:
  - Pencarian cepat & filter kategori menu.
  - Custom Modifier / Varian (Sugar Level, Suhu, Oat Milk, Level Pedas 0-10, Jenis Sambal, Potongan Ayam).
  - Tipe order: Dine-In, Takeaway, Online Delivery.
  - Multi-Payment: Tunai (dengan hitung kembalian instan), QRIS (SVG QR Code), Debit/Credit, E-Wallet.
  - Struk Belanja Thermal 58mm/80mm siap cetak.
- 📦 **Katalog Produk Ala Majoo**: Manajemen HPP (Harga Modal), Harga Jual, kalkulasi otomatis Margin Keuntungan (Rp & %), SKU, Barcode, & Pengaturan Varian.
- 🍳 **Kitchen Display System (KDS)**: Layar pemantauan antrean real-time untuk Barista & Dapur.
- 🪑 **Visual Floor Table Layout**: Denah meja interaktif status mejamu.
- 📊 **Inventaris & Mutasi Stok**: Kelola persediaan bahan baku & catatan Stok Masuk / Keluar.
- 📈 **Laporan Omset & Analytics**: Grafik omset, breakdown metode bayar, dan Top 5 Produk Terlaris.
- ⏰ **Shift Kasir & Rekonsiliasi**: Fitur Open/Close Shift dengan deteksi selisih kas.

---

## 🚀 Cara Menjalankan Project

```bash
# Clone repository
git clone https://github.com/rusadev/buira-app.git

# Masuk ke direktori
cd buira-app

# Install dependencies
npm install

# Jalankan server development
npm run dev
```

Server lokal akan berjalan di `http://localhost:5173`.

---

## 🏗️ Arsitektur SaaS Modular (Roadmap)

Aplikasi dibangun dengan struktur modul terpisah (`/cashier`, `/catalog`, `/kds`, `/tables`, `/inventory`, `/reports`, `/shift`, `/settings`) sehingga di masa depan dapat dengan mudah dihubungkan dengan **Subscription Plan / Feature Toggling** (misal: Plan Starter hanya Kasir + Katalog, Plan Professional + KDS & Table Floor Plan, Plan Enterprise + Inventory & Multi-Branch Analytics).
