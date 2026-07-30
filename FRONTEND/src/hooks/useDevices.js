import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

export const useDevices = (idLantai = null) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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