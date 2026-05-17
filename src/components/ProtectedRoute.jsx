import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, fallbackUser }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    const authed = user || fallbackUser;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(var(--bg))' }}>
                <div className="animate-spin rounded-full h-8 w-8"
                    style={{ border: '2px solid rgb(var(--surface2))', borderBottomColor: 'rgb(var(--brand))' }} />
            </div>
        );
    }

    if (!authed) {
        // Store full location object so LoginPage can restore query + hash
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
