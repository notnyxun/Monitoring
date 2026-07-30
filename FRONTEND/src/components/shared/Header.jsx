import { useState } from 'react';

export const Header = ({ 
  activePage, 
  selectedFloor, 
  navigateTo, 
  notifikasiList, 
  onNotifikasiClick 
}) => {
  const [showNotif, setShowNotif] = useState(false);

  const pageTitles = {
    dashboard: 'Overview',
    floor: `LANTAI ${selectedFloor}`,
    logs: 'Manajemen Logs',
    config: 'Konfigurasi Perangkat',
    profile: 'Profil Saya',
  };

  const handleNotifClick = () => {
    setShowNotif(!showNotif);
  };

  const handleShowAll = () => {
    setShowNotif(false);
    onNotifikasiClick();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 relative">
      <div className="flex items-center">
        {activePage === 'floor' && (
          <button 
            onClick={() => navigateTo('dashboard')} 
            aria-label="Kembali ke dashboard"
            className="mr-3 p-3 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="font-bold text-lg uppercase">
          {pageTitles[activePage] || activePage}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <input 
          type="text" 
          placeholder="Cari Infrastruktur..." 
          className="px-4 py-1.5 border border-gray-300 rounded-md text-sm w-64 bg-gray-50" 
        />
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={handleNotifClick} 
            className="relative p-2 text-gray-500 hover:text-gray-700"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            {notifikasiList.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotif && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b font-bold text-sm">
                Notifikasi Terbaru
              </div>

              {notifikasiList.length === 0 ? (
                <div className="p-4 text-sm text-gray-400 text-center">
                  Belum ada notifikasi
                </div>
              ) : (
                notifikasiList.slice(0, 2).map((n) => {
                  const isOffline = n.pesan.includes('OFFLINE');
                  return (
                    <div 
                      key={n.id_notif} 
                      className={`p-4 text-sm border-b ${
                        isOffline ? 'hover:bg-red-50' : 'hover:bg-green-50'
                      }`}
                    >
                      <span className={`font-bold ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
                        {n.access_point?.nama || 'Perangkat'}
                      </span>
                      <p className="text-gray-500 text-xs mt-1">{n.pesan}</p>
                      <p className="text-gray-400 text-[10px] mt-1">
                        {new Date(n.waktu).toLocaleString('id-ID')}
                      </p>
                    </div>
                  );
                })
              )}

              {notifikasiList.length > 0 && (
                <button
                  onClick={handleShowAll}
                  className="w-full flex flex-col items-center justify-center py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <svg 
                    className="w-4 h-4 animate-bounce" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span className="text-[10px] mt-0.5">Lihat semua</span>
                </button>
              )}
            </div>
          )}
        </div>

        <button 
          onClick={() => navigateTo('profile')} 
          className="w-8 h-8 rounded-full bg-blue-100 text-[#1565c0] flex items-center justify-center font-bold text-xs border border-[#1565c0]"
        >
          O1
        </button>
      </div>
    </header>
  );
};