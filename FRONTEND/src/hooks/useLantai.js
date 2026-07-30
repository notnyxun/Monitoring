import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

export const useLantai = () => {
  const [lantai, setLantai] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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