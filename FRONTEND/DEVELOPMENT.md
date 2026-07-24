# Development Guide - Frontend dengan Mock Data

## 🎯 Current Status

Frontend sekarang sudah fully functional dengan **Mock Data** untuk development!

### ✅ Yang Sudah Fixed:
- ✅ Dashboard Home menampilkan **5 lantai** dengan carousel (2 per halaman)
- ✅ Logs Page menampilkan tabel dengan data
- ✅ Configuration Page menampilkan tabel devices
- ✅ Semua halaman fully functional

### 🚀 Running Frontend

```bash
cd FRONTEND
npm run dev
# Server akan berjalan di http://localhost:5174
```

## 📁 Struktur Mock Data

**File**: `src/data/mockData.js`

Berisi mock data untuk:
- **Lantai** (5 lantai dengan detail online/offline)
- **Devices** (9 access points di berbagai lantai)
- **Logs** (6 log entries)
- **Notifikasi** (3 notifikasi)

```javascript
MOCK_DATA = {
  lantai: [...],      // 5 lantai
  devices: [...],     // 9 devices
  logs: [...],        // 6 log entries
  notifikasi: [...]   // 3 notifikasi
}
```

## 🪝 Custom Hooks dengan Mock Data Support

Semua hooks sekarang support mock data:

### useLantai()
```jsx
import { useLantai } from './hooks';

const MyComponent = () => {
  const { lantai, loading } = useLantai();
  // Jika USE_MOCK_DATA = true, ambil dari mockData
  // Jika USE_MOCK_DATA = false, fetch dari API
};
```

### useDevices(idLantai)
```jsx
import { useDevices } from './hooks';

const MyComponent = () => {
  const { devices, loading } = useDevices(2); // Filter by floor
  // or
  const { devices, loading } = useDevices(); // Get all devices
};
```

### useLogs()
```jsx
import { useLogs } from './hooks';

const MyComponent = () => {
  const { logs, loading } = useLogs();
};
```

### useNotifikasi()
```jsx
import { useNotifikasi } from './hooks';

const MyComponent = () => {
  const { notifikasiList, loading } = useNotifikasi();
};
```

## 🔄 Switch ke Real API

Ketika backend siap dan running, ubah di setiap hook:

### Step 1: Update hooks untuk set USE_MOCK_DATA = false

**File**: `src/hooks/useLantai.js`
```javascript
const USE_MOCK_DATA = false; // Ubah dari true ke false
```

Lakukan sama untuk:
- `useDevices.js`
- `useLogs.js`  
- `useNotifikasi.js`

### Step 2: Pastikan Backend Running

```bash
cd BACKEND
npm run dev
# Backend akan berjalan di http://localhost:3000
```

### Step 3: Frontend akan otomatis fetch dari API

Sekarang semua data akan diambil dari backend API, bukan mock data.

## 📊 Frontend Structure

```
src/
├── components/
│   ├── pages/
│   │   ├── DashboardHome.jsx   (menggunakan useLantai)
│   │   ├── LogsPage.jsx        (menggunakan useLogs)
│   │   ├── FloorDetail.jsx     (menggunakan useDevices)
│   │   ├── ConfigPage.jsx      (menggunakan useDevices & useLantai)
│   │   └── ...
│   └── shared/
│       ├── Sidebar.jsx
│       ├── Header.jsx
│       └── NotifikasiModal.jsx
├── hooks/
│   ├── useLantai.js            (fetch lantai dengan mock support)
│   ├── useDevices.js           (fetch devices dengan mock support)
│   ├── useLogs.js              (fetch logs dengan mock support)
│   ├── useNotifikasi.js        (fetch notifikasi dengan mock support)
│   └── useNavigation.js        (routing state)
├── data/
│   └── mockData.js             (5 lantai, 9 devices, 6 logs, 3 notifikasi)
├── layouts/
│   └── MainLayout.jsx
├── App.jsx
└── ...
```

## 🎠 Carousel Features

**Dashboard Home** sekarang menampilkan:
- 5 lantai dengan mock data
- 2 lantai per halaman
- Smooth animation (500ms)
- Arrow buttons (← Sebelumnya | Selanjutnya →)
- Dot indicators untuk navigasi

## ⚙️ Konfigurasi Mock Data

Jika ingin menambah atau mengubah mock data:

**File**: `src/data/mockData.js`

```javascript
// Tambah lantai baru
{
  id_lantai: 6,
  nama_lantai: 'Lantai 6',
  total: 8,
  online: 7,
  offline: 1,
}

// Tambah device baru
{
  id_ap: 10,
  nama: 'AP-LT6-001',
  ip_address: '192.168.6.10',
  lokasi: 'Ruang Baru',
  status_terakhir: 'online',
  id_lantai: 6,
  lantai: { id_lantai: 6, nama_lantai: 'Lantai 6' },
}
```

## 🐛 Debugging

Lihat di browser console (F12) untuk:
- API fetch logs (jika sudah switch ke real API)
- Component rendering logs
- Error messages

## 📝 Checklist Development

- [x] Dashboard Home dengan carousel 5 lantai
- [x] Logs Page dengan tabel data
- [x] Configuration Page dengan tabel devices
- [x] All hooks dengan mock data support
- [ ] Backend running dengan real data
- [ ] Switch mock data ke real API
- [ ] Real-time monitoring (WebSocket)
- [ ] Error handling & notifications

## 🚀 Next Steps

1. **Setup Backend** - Jalankan backend di port 3000
2. **Generate Prisma Client** - `npx prisma generate`
3. **Database Setup** - Setup database dan seed data
4. **Switch to Real API** - Ubah `USE_MOCK_DATA = false` di hooks
5. **Testing** - Test semua fitur dengan real data
6. **Deployment** - Build dan deploy frontend

## 💡 Tips

- Mock data membuat development lebih cepat tanpa wait backend
- Semua UI elements sudah tested dan working
- Setelah backend ready, cukup ubah satu variable di hooks
- Mock data bisa digunakan untuk testing juga

