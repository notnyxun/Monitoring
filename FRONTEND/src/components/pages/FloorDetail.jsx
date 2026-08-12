import { useDevices } from '../../hooks/useDevices';

export const FloorDetail = ({ idLantai }) => {
  const { devices, loading } = useDevices(idLantai);

  const total = devices.length;
  const online = devices.filter((d) => d.status_terakhir === 'online').length;
  const offline = devices.filter((d) => d.status_terakhir === 'offline').length;

  if (loading) return <div className="p-8 text-gray-500">Memuat data lantai...</div>;

  return (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg border"><span className="text-xs font-bold text-gray-500">TOTAL ACCESS POINT</span><span className="block text-3xl font-bold mt-2">{total}</span></div>
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
