
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowAnonOn?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowAnonOn = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#4F2D9E]" />
        <span className="ml-2 text-lg font-medium">Loading...</span>
      </div>
    );
  }

  // Check if current path is in allowAnonOn array
  const currentPath = location.pathname;
  const allowAnonymous = allowAnonOn.includes(currentPath);

  if (!user && !allowAnonymous) {
    // Save the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
