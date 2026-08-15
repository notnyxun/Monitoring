import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:3000/api';
const REFRESH_INTERVAL = 2000;

export const useNotifikasi = () => {
  const [notifikasiList, setNotifikasiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifikasi = useCallback(() => {
    return fetch(`${API_URL}/notifikasi`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setNotifikasiList(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchNotifikasi();
    const interval = setInterval(fetchNotifikasi, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNotifikasi]);

  return { notifikasiList, loading, refetch: fetchNotifikasi };
};