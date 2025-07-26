import React, { useEffect, useState } from 'react';
import useLogout from '../components/Logout.jsx';
import { useNavigate } from 'react-router-dom';
import api, { ACCESS_TOKEN } from '../api.js';

function Home() {
  useEffect(() => {
          document.title = "Sari-Sari Events";
      }, [])

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  // Use the custom useLogout hook
  const handleLogout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem('refreshToken');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');

    if (accessToken && refreshToken && role && email) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUserEmail(email);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">Welcome to the Home Page!</h2>
        <p className="text-lg text-gray-700">This is your main landing page.</p>

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 shadow-md"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
