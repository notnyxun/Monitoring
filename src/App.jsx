import { useState } from 'react';

// --- KOMPONEN: LOGIN PAGE ---
const LoginPage = ({ onLogin }) => (
  <div className="flex h-screen bg-gray-100 items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-md w-96 border-t-4 border-[#1565c0]">
      <h1 className="text-2xl font-bold text-center text-[#1565c0] mb-6">NetMonitor</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" defaultValue="operator@netmonitor.com" className="mt-1 w-full p-2 border rounded-md focus:ring-[#1565c0] focus:border-[#1565c0]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" defaultValue="password123" className="mt-1 w-full p-2 border rounded-md focus:ring-[#1565c0] focus:border-[#1565c0]" />
        </div>
        <button onClick={onLogin} className="w-full bg-[#1565c0] text-white p-2 rounded-md hover:bg-blue-700 font-semibold transition">
          Login ke Dashboard
        </button>
      </div>
    </div>
  </div>
);

// --- KOMPONEN: DASHBOARD AWAL (CAROUSEL) ---
const DashboardHome = ({ onSelectFloor }) => {
  const floors = [1, 2, 3, 4, 5];
  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Topologi Sistem</h2>
        <p className="text-sm text-gray-500 mt-1">Pilih lantai untuk memantau status Access Point.</p>
      </div>
      
      {/* Scroll Carousel */}
      <div className="flex overflow-x-auto pb-8 space-x-6 snap-x">
        {floors.map(floor => (
          <div 
            key={floor} 
            onClick={() => onSelectFloor(floor)}
            className="snap-center min-w-[250px] h-[350px] bg-[#1a233a] rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#253250] transition-colors border-2 border-transparent hover:border-blue-400"
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-white">LANTAI {floor}</h3>
            <p className="text-sm text-blue-200 mt-2">35 Access Points</p>
          </div>
        ))}
      </div>
      {/* Indikator Carousel */}
      <div className="flex justify-center space-x-2 mt-2">
        <span className="w-3 h-3 rounded-full bg-[#1565c0]"></span>
        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
      </div>
    </div>
  );
};

// --- KOMPONEN: LOGS PAGE ---
const LogsPage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide border-b pb-2 mb-6">Manajemen Logs</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-5 rounded-lg border shadow-sm"><span className="text-xs font-bold text-gray-500">TOTAL LOG</span><span className="block text-3xl font-bold mt-2">35</span></div>
      <div className="bg-white p-5 rounded-lg border border-green-400 shadow-sm"><span className="text-xs font-bold text-gray-500">AP KEMBALI ONLINE</span><span className="block text-3xl font-bold text-green-500 mt-2">30</span></div>
      <div className="bg-white p-5 rounded-lg border border-red-400 shadow-sm"><span className="text-xs font-bold text-gray-500">AP OFFLINE</span><span className="block text-3xl font-bold text-red-500 mt-2">05</span></div>
    </div>
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-[#1565c0] text-white text-xs uppercase">
          <tr><th className="p-4">Timestamp</th><th className="p-4">Nama Perangkat</th><th className="p-4">IP Address</th><th className="p-4">Status</th></tr>
        </thead>
        <tbody className="divide-y text-sm">
          <tr className="hover:bg-gray-50"><td className="p-4">2026-07-18 14:02:11</td><td className="p-4 font-bold">AP01-LT01</td><td className="p-4 text-gray-500">192.168.1.10</td><td className="p-4"><span className="px-2 py-1 text-[10px] rounded border border-red-500 text-red-500">OFFLINE</span></td></tr>
          <tr className="hover:bg-gray-50"><td className="p-4">2026-07-18 13:58:45</td><td className="p-4 font-bold">AP04-LT05</td><td className="p-4 text-gray-500">192.168.5.11</td><td className="p-4"><span className="px-2 py-1 text-[10px] rounded border border-green-500 text-green-500">KEMBALI ONLINE</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

// --- KOMPONEN: CONFIGURATION PAGE ---
const ConfigPage = () => (
  <div className="p-8">
    <div className="flex justify-between items-center border-b pb-2 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Manajemen Access Point</h2>
      <button className="bg-[#1565c0] text-white px-4 py-2 rounded text-sm font-bold">+ Tambah Perangkat</button>
    </div>
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-[#1565c0] text-white text-xs uppercase">
          <tr><th className="p-4">Nama Perangkat</th><th className="p-4">IP Address</th><th className="p-4">Lokasi</th><th className="p-4">Status</th><th className="p-4 text-center">Tindakan</th></tr>
        </thead>
        <tbody className="divide-y text-sm">
          <tr className="hover:bg-gray-50"><td className="p-4 font-bold">AP01-LT01</td><td className="p-4 text-gray-500">192.168.1.10</td><td className="p-4">Lantai 1</td><td className="p-4"><span className="px-2 py-1 text-[10px] rounded border border-red-500 text-red-500">OFFLINE</span></td><td className="p-4 text-center text-blue-600 cursor-pointer">Edit | Hapus</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

// --- KOMPONEN: PROFILE PAGE ---
const ProfilePage = () => (
  <div className="p-8 max-w-2xl mx-auto">
    <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
      <div className="w-24 h-24 rounded-full bg-blue-100 text-[#1565c0] text-3xl font-bold flex items-center justify-center mx-auto mb-4 border-4 border-[#1565c0]">O1</div>
      <h2 className="text-2xl font-bold text-gray-800">Operator 01</h2>
      <p className="text-gray-500 mb-6">Administrator Jaringan</p>
      <div className="text-left space-y-4">
        <div><label className="text-xs font-bold text-gray-500">Email:</label><p className="font-medium">operator@netmonitor.com</p></div>
        <div><label className="text-xs font-bold text-gray-500">Role:</label><p className="font-medium">Super Admin</p></div>
        <button className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 w-full">Ubah Password</button>
      </div>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard'); // dashboard, floor, logs, config, profile
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [showNotif, setShowNotif] = useState(false);

  // Jika belum login, tampilkan halaman login
  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  // Handler Navigasi Sidebar
  const navigateTo = (page) => {
    setActivePage(page);
    setShowNotif(false);
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-gray-800">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1565c0] text-white flex flex-col justify-between shrink-0">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-blue-500/30">
            <span className="font-bold text-lg tracking-wider cursor-pointer" onClick={() => navigateTo('dashboard')}>NetMonitor</span>
          </div>
          <nav className="mt-6 px-4 space-y-2">
            <button onClick={() => navigateTo('dashboard')} className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activePage === 'dashboard' || activePage === 'floor' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>Dashboard</button>
            <button onClick={() => navigateTo('logs')} className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activePage === 'logs' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>Logs</button>
            <button onClick={() => navigateTo('config')} className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activePage === 'config' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>Configuration</button>
          </nav>
        </div>
        <div className="p-4 mb-4 mx-4 bg-black/10 rounded-lg flex items-center cursor-pointer hover:bg-black/20" onClick={() => navigateTo('profile')}>
          <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center text-blue-800 font-bold">O1</div>
          <div className="ml-3 text-left">
            <p className="text-sm font-semibold">Operator 01</p>
            <p className="text-xs text-blue-200">Online | Responsive</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER TOP NAV */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 relative">
          <div className="flex items-center">
            {/* Tombol Back (Hanya muncul jika sedang di dalam Detail Lantai) */}
            {activePage === 'floor' && (
              <button onClick={() => navigateTo('dashboard')} className="mr-3 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded font-bold">
                 &larr; Kembali
              </button>
            )}
            <h1 className="font-bold text-lg uppercase">
              {activePage === 'dashboard' ? 'Overview' : activePage === 'floor' ? `LANTAI ${selectedFloor}` : activePage}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <input type="text" placeholder="Cari Infrastruktur..." className="px-4 py-1.5 border border-gray-300 rounded-md text-sm w-64 bg-gray-50" />
            
            {/* Icon Bell & Notification Dropdown */}
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              {/* Dropdown Notifikasi */}
              {showNotif && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b font-bold text-sm">Notifikasi Terbaru</div>
                  <div className="p-4 text-sm border-b hover:bg-red-50 cursor-pointer">
                    <span className="font-bold text-red-600">AP01-LT01 Offline!</span>
                    <p className="text-gray-500 text-xs mt-1">Perangkat tidak merespon PING.</p>
                  </div>
                  <div className="p-4 text-sm hover:bg-green-50 cursor-pointer">
                    <span className="font-bold text-green-600">AP04-LT05 Online</span>
                    <p className="text-gray-500 text-xs mt-1">Koneksi telah pulih.</p>
                  </div>
                </div>
              )}
            </div>
            
            <button onClick={() => navigateTo('profile')} className="w-8 h-8 rounded-full bg-blue-100 text-[#1565c0] flex items-center justify-center font-bold text-xs border border-[#1565c0]">
               O1
            </button>
          </div>
        </header>

        {/* DYNAMIC CONTENT AREA (Rute Halaman) */}
        <div className="overflow-y-auto h-full">
          {activePage === 'dashboard' && <DashboardHome onSelectFloor={(floor) => { setSelectedFloor(floor); navigateTo('floor'); }} />}
          
          {/* Detail Lantai (Menggunakan kode sebelumnya, disederhanakan) */}
          {activePage === 'floor' && (
            <div className="p-8">
              <div className="grid grid-cols-3 gap-6 mb-8">
                 <div className="bg-white p-5 rounded-lg border"><span className="text-xs font-bold text-gray-500">TOTAL AP</span><span className="block text-3xl font-bold mt-2">35</span></div>
                 <div className="bg-white p-5 rounded-lg border border-green-400"><span className="text-xs font-bold text-gray-500">ONLINE</span><span className="block text-3xl font-bold text-green-500 mt-2">30</span></div>
                 <div className="bg-white p-5 rounded-lg border border-red-400"><span className="text-xs font-bold text-gray-500">OFFLINE</span><span className="block text-3xl font-bold text-red-500 mt-2">05</span></div>
              </div>
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#1565c0] text-white text-xs uppercase">
                    <tr><th className="p-4">NAMA</th><th className="p-4">IP</th><th className="p-4">LOKASI</th><th className="p-4">STATUS</th></tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    <tr><td className="p-4 font-bold">AP01-LT0{selectedFloor}</td><td className="p-4">192.168.{selectedFloor}.10</td><td className="p-4">Lantai {selectedFloor}</td><td className="p-4"><span className="text-red-500 border border-red-500 px-2 rounded font-bold text-[10px]">OFFLINE</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === 'logs' && <LogsPage />}
          {activePage === 'config' && <ConfigPage />}
          {activePage === 'profile' && <ProfilePage />}
        </div>
      </main>
    </div>
  );
}