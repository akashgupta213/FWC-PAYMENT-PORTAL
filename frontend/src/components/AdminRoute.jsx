// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// export default function AdminRoute({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return <div className="flex items-center justify-center h-screen text-brand-blue font-semibold">Loading…</div>;
//   if (!user) return <Navigate to="/admin-login" replace />;
//   if (user.role !== 'admin') return <Navigate to="/payment" replace />;
//   return children;
// }


import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      setDenied(true);
      const timer = setTimeout(() => {}, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-brand-blue font-semibold">
      Loading…
    </div>
  );

  if (!user) return <Navigate to="/admin-login" replace />;

  if (user.role !== 'admin') return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <p className="text-red-500 font-semibold text-lg">
        Access Denied. You do not have admin privileges.
      </p>
      <Navigate to="/payment" replace />
    </div>
  );

  return children;
}