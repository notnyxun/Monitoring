import { useState } from 'react';
import { useDevices } from '../../hooks/useDevices';
import { useLantai } from '../../hooks/useLantai';

export const ConfigPage = () => {
  const { devices, loading: devicesLoading } = useDevices();
  const { lantai: lantaiList, loading: lantaiLoading } = useLantai();
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({ nama: '', ip_address: '', lokasi: '', id_lantai: '' });
  const [formError, setFormError] = useState(null);

  const API_URL = 'http://localhost:3000/api';

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
      // Di development mode dengan mock data, tidak perlu refresh
      setFormData({ nama: '', ip_address: '', lokasi: '', id_lantai: '' });
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
      if (json.success) {
        // Di development mode dengan mock data, tidak perlu refresh
        alert('Device berhasil dihapus');
      } else {
        alert(json.error?.message || 'Gagal menghapus');
      }
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
      {devicesLoading && <p className="text-gray-500 mb-4">Memuat data...</p>}

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
