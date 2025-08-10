import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import { IoIosArrowBack } from "react-icons/io";
import useAuth from "../hooks/useAuth";

function Login() {
  const { login, isLoggedIn, userRole, userCode } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Login | Sari-Sari Events";
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      if(userRole === 'organizer'){
        navigate(`/org/${userCode}`)
      }if(userRole === 'admin'){
        navigate(`/admin-dashboard`);
      }
    }
  }, [isLoggedIn, navigate, userCode, userRole]);

  const handleGoogleSignIn = async (response) => {
    setIsLoading(true);
    setMessage('');
    try {
      const backendResponse = await api.post('/auth/google/login/', { token: response.credential });
      const data = backendResponse.data;
      login(data.tokens, data.user);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const backendResponse = await api.post('/auth/login/', { email, password });
      const data = backendResponse.data;
      login(data.tokens, data.user);
    } catch (error) {
      const data = error.response?.data;
      if (data) {
        if (data.email) setMessage(`Email: ${data.email[0]}`);
        else if (data.password) setMessage(`Password: ${data.password[0]}`);
        else if (data.non_field_errors) setMessage(data.non_field_errors[0]);
        else setMessage(data.detail || 'Sign-in failed.');
      } else {
        setMessage('An error occurred during sign-in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In script loading
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-sign-in-button'),
          { theme: 'outline', size: 'large', text: 'signin_with', width: '330' }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen xl:h-auto 2xl:h-screen xl:py-10 rounded-lg bg-white md:bg-gray-100">
      <form onSubmit={handleSubmit}
        className="bg-white flex flex-col items-center rounded-xl p-5 md:py-10 md:shadow-2xl w-full max-w-lg">
        
        <div className="w-full max-w-md flex items-center mb-4 gap-1 cursor-pointer" onClick={() => navigate('/')}>
          <IoIosArrowBack className="text-secondary text-xl" />
          <span className="text-secondary text-sm font-medium">Back to home</span>
        </div>

        <div className="w-[45%] max-w-md flex items-center">
          <img src="/sariLogo.png" alt="Sari-Sari Events Logo" />
        </div>

        <h2 className="text-5xl font-bold mt-4 text-center">Welcome!</h2>
        <p className="text-center text-sm mb-5">Sign in your account</p>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm">Your E-mail </label>
          <input type="email" id="email" className="w-80 px-4 py-1 border rounded"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm">Password </label>
          <input type="password" id="password" className="w-80 px-4 py-1 border rounded"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {message && <p className="text-center text-sm text-red-500">{message}</p>}
        <button type="submit" className="w-72 bg-secondary text-white py-2 rounded-lg transition">{isLoading ? 'Logging in..' : 'Login'}</button>
        
        <p className="text-center my-2"> or </p>
        <div id="google-sign-in-button" className="flex justify-center"></div>

        <p className="mt-5 text-sm">Forgot Password? <a className="text-secondary" href="/forgot-password">Reset it here</a></p>
        <p className="mt-3 text-sm">Don't have an account? <Link className="text-secondary" to={'/signup'}>Sign up</Link></p>
      </form>
    </div>
  );
}

export default Login;
