import { useState, useEffect } from 'react';

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
  const [floors, setFloors] = useState([]);
  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    fetch(`${API_URL}/lantai`)
      .then((res) => res.json())
      .then((json) => { if (json.success) setFloors(json.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Topologi Sistem</h2>
        <p className="text-sm text-gray-500 mt-1">Pilih lantai untuk memantau status Access Point.</p>
      </div>

      <div className="flex overflow-x-auto pb-8 space-x-6 snap-x">
        {floors.map((floor) => (
          <div
            key={floor.id_lantai}
            onClick={() => onSelectFloor(floor.id_lantai)}
            className="snap-center min-w-[250px] h-[350px] bg-[#1a233a] rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#253250] transition-colors border-2 border-transparent hover:border-blue-400"
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-white">{floor.nama_lantai.toUpperCase()}</h3>
            <p className="text-sm text-blue-200 mt-2">{floor.total} Access Points</p>
            <p className="text-xs mt-1">
              <span className="text-green-400">{floor.online} online</span>
              {' · '}
              <span className="text-red-400">{floor.offline} offline</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- KOMPONEN: LOGS PAGE ---
const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    fetch(`${API_URL}/logs`)
      .then((res) => res.json())
      .then((json) => { if (json.success) setLogs(json.data); })
      .finally(() => setLoading(false));
  }, []);

  const total = logs.length;
  const kembaliOnline = logs.filter((l) => l.status === 'online').length;
  const offline = logs.filter((l) => l.status === 'offline').length;

  if (loading) return <div className="p-8 text-gray-500">Memuat log...</div>;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Logs</h2>
        <p className="text-sm text-gray-500 mt-1">Monitoring perubahan status tiap Access Point.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg border">
          <span className="text-xs font-bold text-gray-500">TOTAL LOG</span>
          <span className="block text-3xl font-bold mt-2">{total}</span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-green-400">
          <span className="text-xs font-bold text-gray-500">ACCESS POINT KEMBALI ONLINE</span>
          <span className="block text-3xl font-bold text-green-500 mt-2">{kembaliOnline}</span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-red-400">
          <span className="text-xs font-bold text-gray-500">ACCESS POINT OFFLINE</span>
          <span className="block text-3xl font-bold text-red-500 mt-2">{offline}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1565c0] text-white text-xs uppercase">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Device Name</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {logs.map((log) => (
              <tr key={log.id_log}>
                <td className="p-4 text-gray-500">{new Date(log.waktu_ping).toLocaleString('id-ID')}</td>
                <td className="p-4 font-bold">{log.access_point?.nama || '-'}</td>
                <td className="p-4">{log.access_point?.ip_address || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] rounded font-bold border ${log.status === 'online' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}`}>
                    {log.status === 'online' ? 'KEMBALI ONLINE' : 'OFFLINE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- KOMPONEN: CONFIGURATION PAGE ---
const ConfigPage = () => {
  const [devices, setDevices] = useState([]);
  const [lantaiList, setLantaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({ nama: '', ip_address: '', lokasi: '', id_lantai: '' });
  const [formError, setFormError] = useState(null);

  const API_URL = 'http://localhost:3000/api';

  const fetchDevices = () => {
    fetch(`${API_URL}/devices`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setDevices(json.data);
        else setError('Gagal memuat data');
      })
      .catch(() => setError('Tidak bisa terhubung ke server'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDevices();
    fetch(`${API_URL}/lantai`)
      .then((res) => res.json())
      .then((json) => { if (json.success) setLantaiList(json.data); })
      .catch(() => {});
  }, []);

  const openAddModal = () => {
    setEditingDevice(null);
    setFormData({ nama: '', ip_address: '', lokasi: '', id_lantai: '' });
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (device) => {
    setEditingDevice(device);
    setFormData({
      nama: device.nama,
      ip_address: device.ip_address,
      lokasi: device.lokasi || '',
      id_lantai: device.id_lantai || '',
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setFormError(null);
    const isEdit = Boolean(editingDevice);
    const url = isEdit ? `${API_URL}/devices/${editingDevice.id_ap}` : `${API_URL}/devices`;
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      id_lantai: formData.id_lantai ? Number(formData.id_lantai) : undefined,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) {
        setFormError(json.error?.message || 'Gagal menyimpan data');
        return;
      }
      setShowModal(false);
      fetchDevices();
    } catch {
      setFormError('Tidak bisa terhubung ke server');
    }
  };

  const handleDelete = async (device) => {
    const confirmed = window.confirm(`Yakin mau hapus "${device.nama}" (${device.ip_address})?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/devices/${device.id_ap}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) fetchDevices();
      else alert(json.error?.message || 'Gagal menghapus');
    } catch {
      alert('Tidak bisa terhubung ke server');
    }
  };

  return (
  <div className="p-8">
    <div className="flex justify-between items-center border-b pb-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
        Manajemen Access Point
        </h2>
        <p className="text-sm text-gray-500 mt-1">
        Konfigurasikan Access Point, baik itu menambah, edit, dan menghapus.
        </p>
      </div>
        <button 
        onClick={openAddModal} 
        className="bg-[#1565c0] hover:bg-[#0d47a1] text-white px-4 py-2 rounded text-sm font-bold transition-colors"
      >
        + Tambah Perangkat
        </button>
    </div>
  

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Memuat data...</p>}

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1565c0] text-white text-xs uppercase">
            <tr>
              <th className="p-4">Nama Perangkat</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">Lantai</th>
              <th className="p-4">Lokasi</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {devices.map((d) => (
              <tr key={d.id_ap} className="hover:bg-gray-50">
                <td className="p-4 font-bold">{d.nama}</td>
                <td className="p-4 text-gray-500">{d.ip_address}</td>
                <td className="p-4">{d.lantai?.nama_lantai || '-'}</td>
                <td className="p-4">{d.lokasi || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] rounded border ${d.status_terakhir === 'online' ? 'border-green-500 text-green-500' : d.status_terakhir === 'offline' ? 'border-red-500 text-red-500' : 'border-gray-400 text-gray-400'}`}>
                    {d.status_terakhir.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-center text-sm">
                  <button onClick={() => openEditModal(d)} className="text-blue-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(d)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-4">{editingDevice ? 'Edit Perangkat' : 'Tambah Perangkat'}</h3>

            {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nama Perangkat</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">IP Address</label>
                <input
                  type="text"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  placeholder="192.168.1.10"
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Lantai</label>
                <select
                  value={formData.id_lantai}
                  onChange={(e) => setFormData({ ...formData, id_lantai: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm bg-white"
                >
                  <option value="">-- Pilih Lantai --</option>
                  {lantaiList.map((l) => (
                    <option key={l.id_lantai} value={l.id_lantai}>{l.nama_lantai}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Lokasi (contoh: Ruang Komisi B)</label>
                <input
                  type="text"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-md border">Batal</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm rounded-md bg-[#1565c0] text-white font-bold">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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



// --- KOMPONEN: DETAIL LANTAI ---
const FloorDetail = ({ idLantai }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    fetch(`${API_URL}/devices?id_lantai=${idLantai}`)
      .then((res) => res.json())
      .then((json) => { if (json.success) setDevices(json.data); })
      .finally(() => setLoading(false));
  }, [idLantai]);

  const total = devices.length;
  const online = devices.filter((d) => d.status_terakhir === 'online').length;
  const offline = devices.filter((d) => d.status_terakhir === 'offline').length;

  if (loading) return <div className="p-8 text-gray-500">Memuat data lantai...</div>;

  return (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg border"><span className="text-xs font-bold text-gray-500">TOTAL AP</span><span className="block text-3xl font-bold mt-2">{total}</span></div>
        <div className="bg-white p-5 rounded-lg border border-green-400"><span className="text-xs font-bold text-gray-500">ONLINE</span><span className="block text-3xl font-bold text-green-500 mt-2">{online}</span></div>
        <div className="bg-white p-5 rounded-lg border border-red-400"><span className="text-xs font-bold text-gray-500">OFFLINE</span><span className="block text-3xl font-bold text-red-500 mt-2">{offline}</span></div>
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1565c0] text-white text-xs uppercase">
            <tr><th className="p-4">NAMA</th><th className="p-4">IP</th><th className="p-4">LOKASI</th><th className="p-4">STATUS</th></tr>
          </thead>
          <tbody className="divide-y text-sm">
            {devices.map((d) => (
              <tr key={d.id_ap}>
                <td className="p-4 font-bold">{d.nama}</td>
                <td className="p-4">{d.ip_address}</td>
                <td className="p-4">{d.lokasi || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 rounded font-bold text-[10px] border ${d.status_terakhir === 'online' ? 'text-green-500 border-green-500' : d.status_terakhir === 'offline' ? 'text-red-500 border-red-500' : 'text-gray-400 border-gray-400'}`}>
                    {d.status_terakhir.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard'); // dashboard, floor, logs, config, profile
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifikasiList, setNotifikasiList] = useState([]);
  const API_URL = 'http://localhost:3000/api';

useEffect(() => {
  fetch(`${API_URL}/notifikasi`)
    .then((res) => res.json())
    .then((json) => { if (json.success) setNotifikasiList(json.data); })
    .catch(() => {});
}, []);

  // Jika belum login, tampilkan halaman login
  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  // Handler Navigasi Sidebar
  const navigateTo = (page) => {
    setActivePage(page);
    setShowNotif(false);
  };

  // Ini untuk ubah kalimat di Header
  const pageTitles = {
  dashboard: 'Overview',
  floor: `LANTAI ${selectedFloor}`,
  logs: 'Manajemen Logs',
  config: 'Konfigurasi Perangkat',
  profile: 'Profil Saya',
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
                {pageTitles[activePage] || activePage}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <input type="text" placeholder="Cari Infrastruktur..." className="px-4 py-1.5 border border-gray-300 rounded-md text-sm w-64 bg-gray-50" />
            
            {/* Icon Bell & Notification Dropdown */}
            <div className="relative">
  <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 text-gray-500 hover:text-gray-700">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
    {notifikasiList.length > 0 && (
      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
    )}
  </button>

  {/* Dropdown Notifikasi (cuma 2 teratas) */}
  {showNotif && (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b font-bold text-sm">Notifikasi Terbaru</div>

      {notifikasiList.length === 0 ? (
        <div className="p-4 text-sm text-gray-400 text-center">Belum ada notifikasi</div>
      ) : (
        notifikasiList.slice(0, 2).map((n) => {
          const isOffline = n.pesan.includes('OFFLINE');
          return (
            <div key={n.id_notif} className={`p-4 text-sm border-b ${isOffline ? 'hover:bg-red-50' : 'hover:bg-green-50'}`}>
              <span className={`font-bold ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
                {n.access_point?.nama || 'Perangkat'}
              </span>
              <p className="text-gray-500 text-xs mt-1">{n.pesan}</p>
              <p className="text-gray-400 text-[10px] mt-1">{new Date(n.waktu).toLocaleString('id-ID')}</p>
            </div>
          );
        })
      )}

      {notifikasiList.length > 0 && (
        <button
          onClick={() => { setShowNotif(false); setShowNotifModal(true); }}
          className="w-full flex flex-col items-center justify-center py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
          <span className="text-[10px] mt-0.5">Lihat semua</span>
        </button>
      )}
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
          
          {/* Detail */}
          {activePage === 'floor' && <FloorDetail idLantai={selectedFloor} />}

          {activePage === 'logs' && <LogsPage />}
          {activePage === 'config' && <ConfigPage />}
          {activePage === 'profile' && <ProfilePage />}
        </div>
      </main>
       {/* Modal Popup Semua Notifikasi */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center px-5 py-4 border-b shrink-0">
              <h3 className="font-bold text-lg">Semua Notifikasi</h3>
              <button onClick={() => setShowNotifModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="overflow-y-auto divide-y">
              {notifikasiList.length === 0 ? (
                <div className="p-6 text-sm text-gray-400 text-center">Belum ada notifikasi</div>
              ) : (
                notifikasiList.map((n) => {
                  const isOffline = n.pesan.includes('OFFLINE');
                  return (
                    <div key={n.id_notif} className={`p-4 text-sm ${isOffline ? 'hover:bg-red-50' : 'hover:bg-green-50'}`}>
                      <span className={`font-bold ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
                        {n.access_point?.nama || 'Perangkat'}
                      </span>
                      <p className="text-gray-500 text-xs mt-1">{n.pesan}</p>
                      <p className="text-gray-400 text-[10px] mt-1">{new Date(n.waktu).toLocaleString('id-ID')}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
