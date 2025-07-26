import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { ACCESS_TOKEN } from "../api.js";


function Login({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const defaultHandleAuthSuccess = (userData, tokens) => {
            localStorage.setItem(ACCESS_TOKEN, tokens.access);
            localStorage.setItem('refreshToken', tokens.refresh);
            localStorage.setItem('userRole', userData.role);
            localStorage.setItem('userEmail', userData.email);
            
            // Conditional redirection based on user role
            if (userData.role === 'client') {
                navigate("/client-dashboard");
            } else if (userData.role === 'guest') {
                navigate("/"); // Assuming Home.jsx is at the root path '/'
            } else {
                navigate("/dashboard"); // Fallback for other roles or if role is not 'client' or 'guest'
            }
      };
  
      // Use the prop if available, otherwise use the default
      const actualOnAuthSuccess = onAuthSuccess || defaultHandleAuthSuccess;

  useEffect(() => {
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize Google Sign-In
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '1012610059915-plt61d82bht9hnk9j9p8ntnaf8ta4nu7.apps.googleusercontent.com', // <<-- REPLACE THIS WITH YOUR ACTUAL GOOGLE CLIENT ID
          callback: handleGoogleSignIn,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-sign-in-button'),
          { theme: 'outline', size: 'large', text: 'signin_with', width: '360' } // Customize button
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleSignIn = async (response) => {
    setIsLoading(true);
    setMessage('Signing in with Google...');
    try {
      // Use the imported 'api' instance for the request
      const backendResponse = await api.post('/auth/google/login/', { token: response.credential });

      // Axios automatically parses JSON, so data is directly available
      const data = backendResponse.data;

      setMessage('Google Sign-in successful!');
      actualOnAuthSuccess(data.user, data.tokens);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      // Axios errors have a 'response' object with 'data' for server errors
      setMessage(error.response?.data?.detail || error.response?.data?.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Signing in...');

    try {
      // Use the imported 'api' instance for the request
      const backendResponse = await api.post('/auth/login/', { email, password });

      // Axios automatically parses JSON, so data is directly available
      const data = backendResponse.data;

      setMessage('Sign-in successful!');
      actualOnAuthSuccess(data.user, data.tokens);
    } catch (error) {
      console.error('Error during sign-in:', error);
      // Axios errors have a 'response' object with 'data' for server errors
      const data = error.response?.data;
      if (data) {
        if (data.email) setMessage(`Email: ${data.email[0]}`);
        else if (data.password) setMessage(`Password: ${data.password[0]}`);
        else if (data.non_field_errors) setMessage(data.non_field_errors[0]);
        else setMessage(data.detail || 'Sign-in failed. Please check your credentials.');
      } else {
        setMessage('An error occurred during sign-in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen rounded-lg">
      <form onSubmit={handleSubmit}

        className="bg-white p-8 rounded w-full py-20 flex flex-col justify-center items-center" >
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome!</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">   Your E-mail </label>
          <input type="email" id="email" className="w-72 px-4 py-1 border rounded focus:ring-2 focus:ring-blue-400"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium"> Password </label>
          <input type="password" id="password" className="w-72 px-4 py-1 border rounded focus:ring-2 focus:ring-blue-400"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {message && <p className="text-center text-sm mt-4 text-gray-600">{message}</p>}
        <button type="submit" className="w-72 bg-secondary text-white py-2 rounded hover:bg-blue-600 rounded-lg transition">{isLoading ? 'Logging in..' : 'Login'}</button>
        <p className="text-center py-4"> or </p>
        <div id="google-sign-in-button" className="flex justify-center"></div>
        <p className="text-grey font-outfit mt-10">Don't have an account? <Link className="text-secondary" to={'/signup'}>Sign up</Link></p>
      </form>
    </div>
  );
}

export default Login;
