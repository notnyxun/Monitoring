# NetMonitor Frontend - Setup Panduan

## 📦 Instalasi Dependencies

```bash
cd FRONTEND
npm install
npm run dev
```

Server akan berjalan di `http://localhost:5173`

## 🏗️ Arsitektur Aplikasi

```
FRONTEND/
├── src/
│   ├── App.jsx                          # Entry point aplikasi (45 lines)
│   ├── layouts/
│   │   └── MainLayout.jsx               # Layout wrapper authenticated pages
│   ├── components/
│   │   ├── pages/                       # Halaman/Routes
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardHome.jsx        # Carousel 2 lantai per halaman
│   │   │   ├── LogsPage.jsx
│   │   │   ├── ConfigPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── FloorDetail.jsx
│   │   └── shared/                      # Reusable components
│   │       ├── Sidebar.jsx
│   │       ├── Header.jsx
│   │       └── NotifikasiModal.jsx
│   └── hooks/                           # Custom React hooks
│       ├── useNotifikasi.js             # Fetch notifikasi API
│       └── useNavigation.js             # Navigation state
├── App.css
├── index.css                            # Tailwind CSS
├── main.jsx
└── public/
```

## 🎯 Flow Aplikasi

```
App.jsx (Main)
├── Check: isLoggedIn?
│   ├── NO → LoginPage
│   └── YES → MainLayout
│       ├── Sidebar (navigation)
│       ├── Header (search + notif)
│       └── PageContent (dynamic)
│           ├── DashboardHome (carousel)
│           ├── FloorDetail
│           ├── LogsPage
│           ├── ConfigPage
│           └── ProfilePage
```

## 🎠 Carousel Dashboard

**File**: `src/components/pages/DashboardHome.jsx`

### Features:
- Menampilkan 2 lantai per halaman
- Navigasi dengan arrow buttons
- Smooth animation (500ms)
- Dot indicators untuk navigasi cepat

### State:
```jsx
const [carouselIndex, setCarouselIndex] = useState(0);
const itemsPerView = 2;  // 2 lantai per halaman
```

### Transform Logic:
```jsx
style={{
  transform: `translateX(${-carouselIndex * 50}%)`
}}
```

## 🪝 Custom Hooks

### useNotifikasi()
```jsx
import { useNotifikasi } from './hooks';

const MyComponent = () => {
  const { notifikasiList, loading } = useNotifikasi();
  // ...
};
```

### useNavigation()
```jsx
import { useNavigation } from './hooks';

const MyComponent = () => {
  const { activePage, selectedFloor, navigateTo, selectFloor } = useNavigation();
  // ...
};
```

## 📝 Menambah Halaman Baru

1. **Buat komponen di `components/pages/MyNewPage.jsx`**:
```jsx
export const MyNewPage = () => {
  return (
    <div className="p-8">
      <h2>Halaman Baru</h2>
    </div>
  );
};
```

2. **Import dan tambahkan case di `App.jsx`**:
```jsx
import { MyNewPage } from './components/pages/MyNewPage';

// Dalam renderPageContent():
case 'mynewpage':
  return <MyNewPage />;
```

3. **Tambahkan button di Sidebar untuk navigasi**:
```jsx
<button onClick={() => navigateTo('mynewpage')}>
  My New Page
</button>
```

## 📝 Membuat Custom Hook

1. **Buat file `hooks/useMyLogic.js`**:
```jsx
import { useState, useEffect } from 'react';

export const useMyLogic = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Fetch data atau logic di sini
    fetch('/api/data')
      .then(r => r.json())
      .then(json => setData(json.data));
  }, []);
  
  return { data };
};
```

2. **Export di `hooks/index.js`**:
```jsx
export { useMyLogic } from './useMyLogic';
```

3. **Gunakan di komponen**:
```jsx
import { useMyLogic } from './hooks';

const MyComponent = () => {
  const { data } = useMyLogic();
  return <div>{data}</div>;
};
```

## 🔌 API Endpoints (Backend)

```
GET  /api/lantai         - Dapatkan daftar lantai
GET  /api/devices        - Dapatkan daftar devices
GET  /api/logs           - Dapatkan logs
GET  /api/notifikasi     - Dapatkan notifikasi
POST /api/devices        - Tambah device baru
PUT  /api/devices/:id    - Edit device
DELETE /api/devices/:id  - Hapus device
```

## 🎨 Styling

Menggunakan **Tailwind CSS** dengan custom color:
- Primary: `#1565c0` (blue)
- Background: `#f8f9fa` (light gray)
- Dark cards: `#1a233a`

## 📱 Responsive Design

Semua komponen sudah responsive dengan grid dan flexbox Tailwind CSS.

## 🚀 Development Tips

1. **Hot Module Replacement (HMR)** - File otomatis reload saat edit
2. **Browser DevTools** - Gunakan React DevTools extension
3. **Console Logs** - Check browser console untuk debugging
4. **Network Tab** - Monitor API calls di Network tab

## ⚠️ Common Issues

### Port sudah digunakan:
```bash
# Ganti port
npm run dev -- --port 5174
```

### Build size besar:
```bash
npm run build
# Output di folder `dist/`
```

### Notifikasi tidak muncul:
- Pastikan Backend API running di `http://localhost:3000`
- Check browser console untuk error messages

## 📚 Next Steps

- [ ] Implement error boundary
- [ ] Tambahkan loading skeleton
- [ ] Setup unit tests (Vitest)
- [ ] Add error notifications
- [ ] Implement localStorage untuk cache

