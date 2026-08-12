import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:3000/api';
const REFRESH_INTERVAL = 2000;

export const useDevices = (idLantai = null, page = null, perPage = null) => {
  const [devices, setDevices] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchDevices = useCallback(() => {
    const params = new URLSearchParams();
    if (idLantai) params.set('id_lantai', idLantai);
    if (page != null) params.set('page', page);
    if (perPage != null) params.set('perPage', perPage);

    const query = params.toString();
    const url = query ? `${API_URL}/devices?${query}` : `${API_URL}/devices`;

    return fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setDevices(json.data);
          if (json.pagination) {
            setPagination({ total: json.pagination.total, totalPages: json.pagination.totalPages });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [idLantai, page, perPage]);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  return { devices, loading, pagination };
};