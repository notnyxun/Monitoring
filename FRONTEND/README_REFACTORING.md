# Struktur React yang Sudah Dirapi

Dokumentasi perubahan struktur React dan fitur carousel.

## Struktur Folder Baru

```
src/
├── App.jsx (App utama yang sudah dipersihkan)
├── components/
│   ├── pages/
│   │   ├── LoginPage.jsx       (Halaman login)
│   │   ├── DashboardHome.jsx   (Dashboard dengan carousel)
│   │   ├── LogsPage.jsx        (Halaman logs)
│   │   ├── ConfigPage.jsx      (Halaman konfigurasi)
│   │   ├── ProfilePage.jsx     (Halaman profil)
│   │   ├── FloorDetail.jsx     (Detail lantai)
│   │   └── index.js            (Export all pages)
│   └── shared/
│       ├── Sidebar.jsx         (Sidebar navigasi)
│       ├── Header.jsx          (Header dengan notifikasi)
│       ├── NotifikasiModal.jsx (Modal notifikasi)
│       └── index.js            (Export all shared)
├── App.css
├── index.css
└── main.jsx
```

## Fitur Carousel Dashboard

**DashboardHome.jsx** sekarang memiliki:
- ✅ Tombol "Sebelumnya" di kiri
- ✅ Tombol "Selanjutnya" di kanan
- ✅ Animasi carousel yang smooth
- ✅ Indikator halaman di bawah
- ✅ Auto-disable tombol saat di awal/akhir
- ✅ Menampilkan 4 lantai per halaman

## Perubahan Utama

### 1. **Pemisahan Komponen**
   - Sebelumnya: Semua component dalam `App.jsx` (1 file besar)
   - Sekarang: Setiap halaman terpisah di folder `pages/`
   - Komponen shared di folder `shared/`

### 2. **Carousel di Dashboard**
   ```jsx
   // Sebelum: Hanya horizontal scroll
   <div className="flex overflow-x-auto pb-8 space-x-6 snap-x">
   
   // Sekarang: Carousel dengan tombol navigasi
   <div className="flex items-center gap-4">
     <button onClick={handlePrevious}>← Sebelumnya</button>
     <div className="flex-1 flex gap-6 overflow-hidden">
       {/* Cards di sini */}
     </div>
     <button onClick={handleNext}>Selanjutnya →</button>
   </div>
   ```

### 3. **Komponen Shared**
   - **Sidebar**: Komponen sidebar yang reusable
   - **Header**: Header dengan fitur notifikasi
   - **NotifikasiModal**: Modal notifikasi terpisah

### 4. **App.jsx yang Lebih Bersih**
   - Hanya 75+ baris (dari 600+ sebelumnya)
   - Import semua komponen dari folder terpisah
   - Lebih mudah di-maintain dan di-extend

## Cara Menggunakan Carousel

### State Management
```jsx
const [carouselIndex, setCarouselIndex] = useState(0);
const itemsPerView = 4; // Tampilkan 4 item per halaman

// Navigasi ke item sebelumnya
const handlePrevious = () => {
  setCarouselIndex((prev) => prev === 0 ? 0 : prev - 1);
};

// Navigasi ke item selanjutnya
const handleNext = () => {
  setCarouselIndex((prev) => 
    prev + itemsPerView < floors.length ? prev + 1 : prev
  );
};
```

### Tampilan Items
```jsx
const visibleFloors = floors.slice(carouselIndex, carouselIndex + itemsPerView);
```

## Keuntungan Struktur Baru

1. **Maintainability**: Mudah menemukan dan mengedit komponen
2. **Reusability**: Komponen dapat digunakan kembali dengan mudah
3. **Scalability**: Mudah menambah halaman atau fitur baru
4. **Performance**: Lazy loading lebih mudah diimplementasikan
5. **Testing**: Setiap komponen bisa ditest secara terpisah
6. **Collaborations**: Lebih mudah untuk tim development

## Next Steps (Saran)

1. Tambahkan error boundary untuk handling error
2. Implement lazy loading untuk komponen halaman
3. Tambahkan loading skeleton components
4. Implement React Context untuk global state management
5. Tambahkan unit tests untuk setiap komponen

