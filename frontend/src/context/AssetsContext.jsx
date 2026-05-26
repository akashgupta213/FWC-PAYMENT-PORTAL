import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AssetsContext = createContext({});

export function AssetsProvider({ children }) {
  const [assets, setAssets]   = useState({});
  const [loaded, setLoaded]   = useState(false);

  // Fetch once when user is logged in (token present)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    api.get('/assets')
      .then(res => { setAssets(res.data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <AssetsContext.Provider value={{ assets, loaded }}>
      {children}
    </AssetsContext.Provider>
  );
}

export const useAssets = () => useContext(AssetsContext);