import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

export const useNotifikasi = () => {
  const [notifikasiList, setNotifikasiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/notifikasi`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setNotifikasiList(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { notifikasiList, loading };
};