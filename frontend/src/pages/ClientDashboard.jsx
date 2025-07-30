import React, { useEffect, useState } from 'react';
import api, { ACCESS_TOKEN } from '../api.js';
import useAuth from '../hooks/useAuth.js';

function ClientDashboard() {
    useEffect(() => {
        document.title = "Sari-Sari Events";
    }, [])

    const { userEmail, userRole, logout } = useAuth();    

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {userEmail}!</h2>
            <p className="text-lg text-gray-700 mb-4">Your role is: <span className="font-semibold capitalize">{userRole}</span></p>
            <button
                onClick={logout}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 shadow-md"
            >
                Logout
            </button>
        </div>
    );
}

export default ClientDashboard;
