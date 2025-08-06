//useAuth.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../api.js';

const REFRESH_TOKEN = 'refreshToken';
const USER_ROLE = 'userRole';
const USER_EMAIL = 'userEmail';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userProfile, setUserProfile] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const role = localStorage.getItem(USER_ROLE);
    const email = localStorage.getItem(USER_EMAIL);
    const firstName = localStorage.getItem('userFirstName');
    const profile = localStorage.getItem('userProfile');
    if (accessToken && refreshToken && role && email) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUserEmail(email);
      setUserFirstName(firstName || '');
      setUserProfile(profile || '');
    } else {
      // If any token/info is missing, clear everything and redirect to login
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem(USER_ROLE);
      localStorage.removeItem(USER_EMAIL);
      setIsLoggedIn(false);
      setUserRole('');
      setUserEmail('');
    }
  }, []); // navigate is a stable function from react-router-dom, but good practice to include

  // Optional: Add login and logout functions to the hook for easier management
  const login = (accessToken, refreshToken, role, email) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    localStorage.setItem(USER_ROLE, role);
    localStorage.setItem(USER_EMAIL, email);
    localStorage.setItem('userFirstName', userFirstName || '');
    localStorage.setItem('userProfile', userProfile || '');
    localStorage.setItem('isLoggedIn', true);
    setIsLoggedIn(true);
    setUserRole(role);
    setUserEmail(email);
    // You might want to navigate to a dashboard or home page after successful login
    // navigate('/dashboard'); 
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER_ROLE);
    localStorage.removeItem(USER_EMAIL);
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUserRole('');
    setUserEmail('');
    navigate('/'); // Redirect to login page on logout
  };

  return {
    isLoggedIn,
    userRole,
    userEmail,
    userFirstName,
    userProfile,
    login,   // Provide the login function
    logout   // Provide the logout function
  };
};

export default useAuth;