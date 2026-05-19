import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner className="py-32" size="lg" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Spinner className="py-32" size="lg" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner className="py-32" size="lg" />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
