import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useLogs } from "../../hooks/useLogs";
import { Pagination } from "../shared";

const API_URL = "http://localhost:3000/api";

export const LogsPage = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [clearing, setClearing] = useState(false);
  const { logs, loading, summary, pagination, refetch } = useLogs(
    page,
    perPage,
  );

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  const handleClearHistory = async () => {
    const confirmed = window.confirm(
      `Yakin mau hapus SELURUH riwayat log (${summary.total} baris)? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!confirmed) return;

    setClearing(true);
    try {
      const res = await fetch(`${API_URL}/logs`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setPage(1);
        await refetch();
      } else {
        alert(json.error?.message || "Gagal menghapus riwayat log");
      }
    } catch {
      alert("Tidak bisa terhubung ke server");
    } finally {
      setClearing(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Memuat log...</div>;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Logs</h2>
        <p className="text-sm text-gray-500 mt-1">
          Monitoring perubahan status tiap Access Point.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg border">
          <span className="text-xs font-bold text-gray-500">TOTAL LOG</span>
          <span className="block text-3xl font-bold mt-2">{summary.total}</span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-green-400">
          <span className="text-xs font-bold text-gray-500">
            ACCESS POINT KEMBALI ONLINE
          </span>
          <span className="block text-3xl font-bold text-green-500 mt-2">
            {summary.online}
          </span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-red-400">
          <span className="text-xs font-bold text-gray-500">
            ACCESS POINT OFFLINE
          </span>
          <span className="block text-3xl font-bold text-red-500 mt-2">
            {summary.offline}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1565c0] text-white text-xs uppercase">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Device Name</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <button
                    onClick={handleClearHistory}
                    disabled={clearing || summary.total === 0}
                    title="Hapus Riwayat"
                    className="flex items-center gap-1.5 text-white hover:bg-white/10 px-2 py-1 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} />
                    <span>{clearing ? "Menghapus..." : "Hapus Riwayat"}</span>
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {logs.map((log) => (
              <tr key={log.id_log}>
                <td className="p-4 text-gray-500">
                  {new Date(log.waktu_ping).toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                  })}
                </td>
                <td className="p-4 font-bold">
                  {log.access_point?.nama || "-"}
                </td>
                <td className="p-4">{log.access_point?.ip_address || "-"}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-[10px] rounded font-bold border ${log.status === "online" ? "text-green-500 border-green-500" : "text-red-500 border-red-500"}`}
                  >
                    {log.status === "online" ? "KEMBALI ONLINE" : "OFFLINE"}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">
                  Belum ada riwayat log.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          total={pagination.total}
          page={page}
          perPage={perPage}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          onPerPageChange={handlePerPageChange}
          label="Log"
        />
      </div>
    </div>
  );
};
