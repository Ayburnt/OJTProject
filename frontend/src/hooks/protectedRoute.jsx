import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../api.js';

const REFRESH_TOKEN = 'refreshToken';
const USER_ROLE = 'userRole';

const PrivateRoute = ({ children, requiredRole }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        const role = localStorage.getItem(USER_ROLE);

        if (accessToken && refreshToken && role) {
            setIsLoggedIn(true);
            setUserRole(role);
        } else {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            localStorage.removeItem(USER_ROLE);
            setIsLoggedIn(false);
            setUserRole('');
        }

        setIsLoading(false);
    }, []);

    if (isLoading) {
        return null; // or <Spinner />
    }

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    if (!requiredRole) {
        if (userRole === 'organizer') {
            return <Navigate to="/organizer-dashboard" replace />;
        } else if (userRole === 'admin') {
            return <Navigate to="/admin-dashboard" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    if (userRole.toLowerCase() !== requiredRole.toLowerCase()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
