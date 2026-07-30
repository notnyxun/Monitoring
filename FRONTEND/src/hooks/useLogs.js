import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

export const useLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/logs`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setLogs(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { logs, loading };
};