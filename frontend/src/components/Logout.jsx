import { useNavigate } from 'react-router-dom';
import api, { ACCESS_TOKEN } from '../api.js'; // Assuming api.js is in the same directory or adjust path

/**
 * Custom hook for handling user logout.
 * Provides a reusable function to clear authentication data and redirect.
 *
 * @returns {function} handleLogout - A function to call when the user logs out.
 */
const useLogout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear all authentication-related items from localStorage
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');

        // Redirect to the home page or login page after logout
        // Adjust the path as needed, e.g., '/login' if you want to go to the login page
        navigate('/login');
    };

    return handleLogout;
};

export default useLogout;
