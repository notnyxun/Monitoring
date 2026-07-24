import { useState, useEffect } from 'react';
import { MOCK_DATA } from '../data/mockData';

const API_URL = 'http://localhost:3000/api';
const USE_MOCK_DATA = true; // Set ke true untuk dev mode dengan mock data

export const useLantai = () => {
  const [lantai, setLantai] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      setLantai(MOCK_DATA.lantai);
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/lantai`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setLantai(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { lantai, loading };
};
