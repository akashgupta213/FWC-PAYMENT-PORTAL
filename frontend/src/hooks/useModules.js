import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function useModules() {
  const [modules, setModules]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  useEffect(() => {
    api.get('/modules')
      .then(res => setModules(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load modules'))
      .finally(() => setLoading(false));
  }, []);

  return { modules, loading, error };
}