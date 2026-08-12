import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:3000/api';
const REFRESH_INTERVAL = 10000;

export const useSummary = () => {
  const [summary, setSummary] = useState({ total: 0, online: 0, offline: 0, unknown: 0 });
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(() => {
    return fetch(`${API_URL}/summary`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSummary(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSummary]);

  return { summary, loading };
};