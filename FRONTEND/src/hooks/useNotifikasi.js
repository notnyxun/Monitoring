import { useState, useEffect } from 'react';
import { MOCK_DATA } from '../data/mockData';

const API_URL = 'http://localhost:3000/api';
const USE_MOCK_DATA = true; // Set ke true untuk dev mode dengan mock data

export const useNotifikasi = () => {
  const [notifikasiList, setNotifikasiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      setNotifikasiList(MOCK_DATA.notifikasi);
      setLoading(false);
      return;
    }

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
