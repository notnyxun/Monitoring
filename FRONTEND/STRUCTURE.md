# Struktur React NetMonitor - Clean Architecture

## 📁 Struktur Folder Baru

```
src/
├── App.jsx                    # Main app component (45 baris - super clean!)
├── App.css
├── index.css
├── main.jsx
│
├── layouts/
│   └── MainLayout.jsx         # Layout wrapper untuk authenticated pages
│
├── components/
│   ├── pages/                 # Halaman/Routes
│   │   ├── LoginPage.jsx
│   │   ├── DashboardHome.jsx  (dengan carousel 2 lantai)
│   │   ├── LogsPage.jsx
│   │   ├── ConfigPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── FloorDetail.jsx
│   │   └── index.js
│   │
│   └── shared/                # Komponen yang reusable
│       ├── Sidebar.jsx
│       ├── Header.jsx
│       ├── NotifikasiModal.jsx
│       └── index.js
│
└── hooks/                      # Custom React hooks
    ├── useNotifikasi.js       # Fetch notifikasi dari API
    ├── useNavigation.js       # Navigation state management
    └── index.js
```

## 🎯 Fitur-Fitur Utama

### 1. **Clean App.jsx (45 baris)**
- Hanya menghandle state login
- Menggunakan custom hooks untuk notifikasi dan navigasi
- Menggunakan MainLayout sebagai wrapper
- Render page content dengan switch statement

### 2. **Custom Hooks**
- `useNotifikasi()` - Fetch dan manage notifikasi dari API
- `useNavigation()` - Manage aktivePage dan selectedFloor

### 3. **MainLayout**
- Memisahkan layout logic dari App.jsx
- Menangani Sidebar, Header, dan NotifikasiModal
- Menerima children untuk page content

### 4. **Carousel Dashboard**
- 2 lantai per tampilan
- Smooth animation (500ms)
- Arrow navigation (← Sebelumnya | Selanjutnya →)
- Dot indicators untuk navigasi cepat

## 🏗️ Keuntungan Struktur Ini

✅ **Separation of Concerns** - Setiap file punya tanggung jawab yang jelas  
✅ **Reusability** - Hooks dan components mudah digunakan ulang  
✅ **Scalability** - Mudah menambah fitur baru  
✅ **Maintainability** - Kode lebih mudah dipahami dan dimodifikasi  
✅ **Testing** - Setiap komponen bisa ditest secara terpisah  
✅ **Type Safety** - Siap untuk TypeScript jika diperlukan  

## 📝 Cara Menambah Halaman Baru

1. **Buat komponen di `components/pages/`**:
```jsx
export const MyNewPage = () => {
  return <div>Halaman Baru</div>;
};
```

2. **Import di `App.jsx`** dan tambahkan case di switch statement:
```jsx
case 'mynewpage':
  return <MyNewPage />;
```

3. **Tambahkan button di Sidebar** untuk navigasi

## 📝 Cara Membuat Custom Hook

1. **Buat file di `hooks/`**:
```jsx
import { useState, useEffect } from 'react';

export const useMyHook = () => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Logic di sini
  }, []);
  
  return { state };
};
```

2. **Export di `hooks/index.js`**:
```jsx
export { useMyHook } from './useMyHook';
```

3. **Gunakan di komponen**:
```jsx
import { useMyHook } from '../hooks';

const MyComponent = () => {
  const { state } = useMyHook();
  // ...
};
```

## 🚀 Next Steps

1. Tambahkan error boundary untuk error handling
2. Implement context API untuk global state (jika diperlukan)
3. Tambahkan loading skeleton components
4. Setup unit tests dengan Vitest/Jest
5. Implementasi lazy loading untuk components

