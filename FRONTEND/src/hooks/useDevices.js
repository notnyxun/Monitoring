import { useState, useEffect } from 'react';
import { MOCK_DATA } from '../data/mockData';

const API_URL = 'http://localhost:3000/api';
const USE_MOCK_DATA = true; // Set ke true untuk dev mode dengan mock data

export const useDevices = (idLantai = null) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      if (idLantai) {
        setDevices(MOCK_DATA.devices.filter(d => d.id_lantai === idLantai));
      } else {
        setDevices(MOCK_DATA.devices);
      }
      setLoading(false);
      return;
    }

    const url = idLantai 
      ? `${API_URL}/devices?id_lantai=${idLantai}`
      : `${API_URL}/devices`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setDevices(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [idLantai]);

  return { devices, loading };
};
