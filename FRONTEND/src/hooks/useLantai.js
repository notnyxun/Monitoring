import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:3000/api';
const REFRESH_INTERVAL = 2000; 

export const useLantai = () => {
  const [lantai, setLantai] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLantai = useCallback(() => {
    return fetch(`${API_URL}/lantai`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setLantai(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchLantai();
    const interval = setInterval(fetchLantai, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchLantai]);

  return { lantai, loading };
};