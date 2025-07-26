import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { ACCESS_TOKEN } from '../api.js';
import useLogout from '../components/Logout.jsx';

function ClientDashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    const handleLogout = useLogout();

    useEffect(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        const refreshToken = localStorage.getItem('refreshToken');
        const role = localStorage.getItem('userRole');
        const email = localStorage.getItem('userEmail');

        if (accessToken && refreshToken && role && email) {
            if(role === 'guest') {
                navigate('/');
                return;
            }
            setIsLoggedIn(true);
            setUserRole(role);
            setUserEmail(email);
        } else {
            navigate('/login');
        }
    }, [navigate]);
   
    if (!isLoggedIn) {
        return <p>Loading or redirecting...</p>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {userEmail}!</h2>
            <p className="text-lg text-gray-700 mb-4">Your role is: <span className="font-semibold capitalize">{userRole}</span></p>
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 shadow-md"
            >
                Logout
            </button>
        </div>
    );
}

export default ClientDashboard;
