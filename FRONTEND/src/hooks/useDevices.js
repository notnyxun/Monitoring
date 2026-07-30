import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:3000/api';
const REFRESH_INTERVAL = 2000; // satuannya ms, sama dengan intervl cron (10s) <- bisa disesuaikan 

export const useDevices = (idLantai = null) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = useCallback(() => {
    const url = idLantai
      ? `${API_URL}/devices?id_lantai=${idLantai}`
      : `${API_URL}/devices`;

    return fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setDevices(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [idLantai]);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  return { devices, loading };
};