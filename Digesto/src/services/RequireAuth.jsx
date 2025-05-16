import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/useAuth';

const RequireAuth = () => {
  const { auth } = useAuth();

  if (auth.loading) return <div>Cargando sesión...</div>;

  if (!auth.user) {
    return (
      <>
        {auth.sessionExpired && <p style={{ color: 'red' }}>Tu sesión ha expirado. Inicia sesión nuevamente.</p>}
        <Navigate to="/login" replace />
      </>
    );
  }

  return <Outlet />;
};

export default RequireAuth;
