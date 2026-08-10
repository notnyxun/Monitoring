import { useLantai } from '../../hooks/useLantai';
import { useLogs } from '../../hooks/useLogs';

export const DashboardHome = ({ onSelectFloor }) => {
  const { lantai } = useLantai();
  const { logs, loading } = useLogs();

  const totalLogs = logs.length;
  const kembaliOnline = logs.filter((log) => log.status === 'online').length;
  const sedangOffline = logs.filter((log) => log.status === 'offline').length;

  if (loading) {
    return <div className="p-8 text-gray-500">Memuat dashboard...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Topologi Sistem</h2>
        <p className="text-sm text-gray-500 mt-1">Pilih lantai untuk memantau status Access Point.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg border">
          <span className="text-xs font-bold text-gray-500">TOTAL LOG</span>
          <span className="block text-3xl font-bold mt-2">{totalLogs}</span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-green-400">
          <span className="text-xs font-bold text-gray-500">ACCESS POINT KEMBALI ONLINE</span>
          <span className="block text-3xl font-bold text-green-500 mt-2">{kembaliOnline}</span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-red-400">
          <span className="text-xs font-bold text-gray-500">ACCESS POINT SEDANG OFFLINE</span>
          <span className="block text-3xl font-bold text-red-500 mt-2">{sedangOffline}</span>
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto pr-2">
        <div className="grid grid-cols-3 gap-4">
          {lantai.map((floor) => (
            <div
              key={floor.id_lantai}
              onClick={() => onSelectFloor(floor.id_lantai)}
              className="w-[350px] h-[90px] bg-[#1a233a] rounded-xl shadow-md flex items-center justify-between px-4 cursor-pointer hover:bg-[#253250] transition-all duration-300 border border-transparent hover:border-blue-400"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{floor.nama_lantai.toUpperCase()}</h3>
                  <p className="text-[11px] text-blue-200 mt-1">{floor.total} Access Points</p>
                </div>
              </div>

              <div className="text-right shrink-0 ml-2">
                <p className="text-[10px] text-green-400">{floor.online} online</p>
                <p className="text-[10px] text-red-400 mt-1">{floor.offline} offline</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};