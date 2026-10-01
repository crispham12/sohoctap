import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-bg-dark)' }}>
        <p style={{ color: '#fff', opacity: 0.7 }}>Đang tải...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
