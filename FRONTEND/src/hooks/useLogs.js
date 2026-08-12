import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:3000/api';
const REFRESH_INTERVAL = 2000;

export const useLogs = (page = 1, perPage = 25) => {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ total: 0, online: 0, offline: 0 });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(() => {
    return fetch(`${API_URL}/logs?page=${page}&perPage=${perPage}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setLogs(json.data);
          setSummary(json.summary || { total: 0, online: 0, offline: 0 });
          setPagination(
            json.pagination
              ? { total: json.pagination.total, totalPages: json.pagination.totalPages }
              : { total: 0, totalPages: 1 }
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, perPage]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  return { logs, loading, summary, pagination, refetch: fetchLogs };
};