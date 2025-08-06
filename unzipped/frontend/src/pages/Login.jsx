import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { ACCESS_TOKEN } from "../api.js";
import { IoIosArrowBack } from "react-icons/io";


function Login({ onAuthSuccess }) {
  useEffect(() => {
    document.title = "Login | Sari-Sari Events";
  }, [])
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if(isLoggedIn){
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'client') {
      navigate("/organizer-dashboard");
    } else if (userRole === 'guest') {
      navigate("/")
    } else {
      navigate("/");
    }
  }
  },[])  

  const defaultHandleAuthSuccess = (userData, tokens) => {
    localStorage.setItem(ACCESS_TOKEN, tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userEmail', userData.email);

    // Conditional redirection based on user role
    if (userData.role === 'client') {
      navigate("/organizer-dashboard");
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
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // <<-- REPLACE THIS WITH YOUR ACTUAL GOOGLE CLIENT ID
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
    setMessage('');
    try {
      // Use the imported 'api' instance for the request
      const backendResponse = await api.post('/auth/google/login/', { token: response.credential });

      // Axios automatically parses JSON, so data is directly available
      const data = backendResponse.data;

      setMessage('');
      actualOnAuthSuccess(data.user, data.tokens);
      localStorage.setItem('userFirstName', data.user.first_name || '');
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('userProfile', data.user.profile_picture || '');
      
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

    try {
      // Use the imported 'api' instance for the request
      const backendResponse = await api.post('/auth/login/', { email, password });

      // Axios automatically parses JSON, so data is directly available
      const data = backendResponse.data;
      localStorage.setItem('userFirstName', data.user.first_name || '');
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('userProfile', data.user.profile_picture || '');      
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
    <div className="flex items-center justify-center h-screen rounded-lg bg-white">

      <form onSubmit={handleSubmit}

        className="bg-white p-8 rounded w-[full] py-5 flex flex-col justify-center items-center" >
        {/* Back button */}
        {/* This will navigate back to the previous page */}
        <div className="w-full max-w-md mt-15 flex items-center text-left ml-2 mt-1 mb-8 px-6 gap-1 cursor-pointer" onClick={() => navigate('/')}>
          <IoIosArrowBack className="text-secondary text-xl ml-2" />
          <span className="text-secondary text-sm font-medium font-outfit">Back to home</span>
        </div>

        <div className="w-[45%] max-w-md flex items-center mb-6 ">
          <img src="/sariLogo.png" alt="Sari-Sari Events Logo" />
        </div>

        <h2 className="text-5xl font-bold font-outfit mb-2 mt-5 text-center">Welcome!</h2>
        <hr className="w-70 mb-2 border-t border-gray-600" />
        <p className="text-center text-sm font-outfit mb-8">Sign in your account</p>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">   Your E-mail </label>
          <input type="email" id="email" className="w-80 font-outfit px-4 py-1 border rounded focus:ring-2 focus:ring-blue-400"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium"> Password </label>
          <input type="password" id="password" className="w-80 font-outfit px-4 py-1 border rounded focus:ring-2 focus:ring-blue-400"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {message && <p className="font-outfit text-center text-sm text-red-500">{message}</p>}
        <button type="submit" className="w-72 bg-secondary text-white py-2 rounded hover:bg-blue-600 rounded-lg transition">{isLoading ? 'Logging in..' : 'Login'}</button>
        <p className="text-center py-4"> or </p>
        <div id="google-sign-in-button" className="flex justify-center"></div>
       <p class="text-grey font-outfit mt-5">Forgot Password? <a class="text-secondary" href="/forgot-password">Reset it here</a></p>
        <p className="text-grey font-outfit mt-5">Don't have an account? <Link className="text-secondary" to={'/signup'}>Sign up</Link></p>
      </form>
    </div>

  );
}

export default Login;
