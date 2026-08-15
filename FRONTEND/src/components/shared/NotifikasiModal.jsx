import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

export const NotifikasiModal = ({ notifikasiList, isOpen, onClose, onCleared }) => {
  const [clearing, setClearing] = useState(false);

  if (!isOpen) return null;

  const handleClearHistory = async () => {
    const confirmed = window.confirm(
      `Yakin mau hapus SELURUH riwayat notifikasi (${notifikasiList.length} baris)? Tindakan ini tidak bisa dibatalkan.`
    );
    if (!confirmed) return;

    setClearing(true);
    try {
      const res = await fetch(`${API_URL}/notifikasi`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        await onCleared?.();
      } else {
        alert(json.error?.message || 'Gagal menghapus riwayat notifikasi');
      }
    } catch {
      alert('Tidak bisa terhubung ke server');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center px-5 py-4 border-b shrink-0">
          <h3 className="font-bold text-lg">Semua Notifikasi</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearHistory}
              disabled={clearing || notifikasiList.length === 0}
              title="Hapus Riwayat"
              className="text-gray-400 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              &times;
            </button>
          </div>
        </div>
        <div className="overflow-y-auto divide-y">
          {notifikasiList.length === 0 ? (
            <div className="p-6 text-sm text-gray-400 text-center">
              Belum ada notifikasi
            </div>
          ) : (
            notifikasiList.map((n) => {
              const isOffline = n.pesan.includes('OFFLINE');
              return (
                <div
                  key={n.id_notif}
                  className={`p-4 text-sm ${isOffline ? 'hover:bg-red-50' : 'hover:bg-green-50'}`}
                >
                  <span className={`font-bold ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
                    {n.access_point?.nama || 'Perangkat'}
                  </span>
                  <p className="text-gray-500 text-xs mt-1">{n.pesan}</p>
                  <p className="text-gray-400 text-[10px] mt-1">
                    {new Date(n.waktu).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};