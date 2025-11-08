import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const user = authAPI.getCurrentUser();
  
  useEffect(() => {
    // Debug: Log authentication state
    console.log('ProtectedRoute check:', {
      hasToken: !!token,
      hasUser: !!user,
      token: token ? `${token.substring(0, 20)}...` : 'null',
      user: user ? user.email || user._id : 'null'
    });
  }, [token, user]);
  
  if (!token || !user) {
    console.warn('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
