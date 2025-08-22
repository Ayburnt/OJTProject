import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsShieldLockFill } from 'react-icons/bs';
import { IoArrowBackCircle } from "react-icons/io5";
import { HiMail } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { IoIosArrowBack } from 'react-icons/io';

// Import your Axios-configured API client
import api, { ACCESS_TOKEN } from '../api.js';

const ForgotPass = () => {
  const navigate = useNavigate();

   useEffect(() => {
          document.title = "Forgot PAssword | Sari-Sari Events";
        }, []);

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state for API calls
  const [generalError, setGeneralError] = useState(''); // For general API errors

  const inputRefs = useRef([]);

  // Helper function for exponential backoff retry for Axios responses
  const callApiWithRetry = async (apiCallFunc, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await apiCallFunc(); // Execute the API call function (e.g., api.post(...))
        // Axios responses for success typically have status in 2xx range
        if (response.status >= 200 && response.status < 300) {
          return response; // Return the full response object for successful status
        } else {
          // This block might be hit if the server returns a non-2xx status,
          // but Axios still resolves the promise (e.g., 400 Bad Request).
          // We'll treat it as an error and retry if applicable.
          const errorData = response.data?.detail || response.data?.message || 'An unexpected error occurred.';
          console.error(`API error on attempt ${i + 1} (status: ${response.status}):`, errorData);
          setGeneralError(errorData);
          if (i < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
          } else {
            throw new Error(errorData); // Re-throw after max retries
          }
        }
      } catch (error) {
        // This block catches network errors or Axios errors (e.g., 4xx/5xx responses)
        console.error(`Network or API error on attempt ${i + 1}:`, error);
        // Extract error message from Axios error object
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Network error. Please check your internet connection.';
        setGeneralError(errorMessage);
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        } else {
          throw new Error(errorMessage); // Re-throw after max retries
        }
      }
    }
    throw new Error('Max retries exceeded.'); // Fallback, should be caught by the last re-throw
  };

  const handleNext = async () => {
    setEmailError('');
    setGeneralError(''); // Clear previous general errors

    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      // Call your API to send the OTP using api.post
      // Endpoint: '/auth/otp-send/' as seen in your signup.jsx
      const response = await callApiWithRetry(() => api.post('/auth/resetotp-password/', { email }));

      if (response.status === 200) { // Assuming 200 OK for successful OTP send
        setStep('code');
      } else {
        // This case should ideally be caught by callApiWithRetry's error handling,
        // but included for robustness if a 2xx status comes with a logical error.
        setEmailError(response.data?.detail || response.data?.message || 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      // Error message already set by callApiWithRetry, or a specific one if needed
      setEmailError(emailError || 'Failed to send OTP. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    setCodeError('');
    setGeneralError(''); // Clear previous general errors
    const enteredCode = code.join('');

    if (enteredCode.length !== 6) {
      setCodeError('Please enter the 6-digit code.');
      return;
    }

    setIsLoading(true);
    try {
      // Call your API to verify the OTP using api.post
      // Endpoint: '/auth/otp-verify/' as seen in your signup.jsx
      const response = await callApiWithRetry(() => api.post('/auth/otp-verify/', { email, otp: enteredCode }));

      if (response.status === 200) { // Assuming 200 OK for successful OTP verification
        setStep('newPassword');
      } else {
        // Fallback for unexpected 2xx status with logical error
        setCodeError(response.data?.detail || response.data?.message || 'Invalid or expired verification code.');
      }
    } catch (error) {
      // Error message already set by callApiWithRetry, or a specific one if needed
      setCodeError(codeError || 'Failed to verify code. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    setPasswordMismatchError(false);
    setGeneralError(''); // Clear previous general errors

    if (newPassword !== confirmPassword) {
      setPasswordMismatchError(true);
      return;
    }
    if (!newPassword || newPassword.length < 6) { // Basic password length validation
        setGeneralError('Password must be at least 6 characters long.');
        return;
    }

    setIsLoading(true);
    try {
      // Call your API to reset the password using api.post
      // You'll need a dedicated endpoint for password reset, e.g., '/auth/reset-password/'
      const response = await callApiWithRetry(() => api.post('/auth/reset-password/', { email, new_password: newPassword }));

      if (response.status === 200) { // Assuming 200 OK for successful password reset
        setShowSuccessModal(true);
      } else {
        // Fallback for unexpected 2xx status with logical error
        setGeneralError(response.data?.detail || response.data?.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      // Error message already set by callApiWithRetry, or a specific one if needed
      setGeneralError(generalError || 'Failed to reset password. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBackToLogin = () => {
    navigate('/login');
  };

  const mainColor = 'bg-[#009494]';
  const iconColor = '#007D7D';

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-100 font-inter">
      {step === 'email' && (
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center mb-8 cursor-pointer" onClick={handleGoBackToLogin}>
            <IoArrowBackCircle className="text-[#007D7D] text-[2rem] mb-5 mt-1 ml-3" />
          </div>
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Enter your E-mail</h1>
            <HiMail className="w-20 h-20 mb-4 text-[#007D7D]" />
            <div className="text-left w-full ">
              <p className="mt-2 text-sm font-bold text-gray-500">
                Please enter your registered email.
              </p>
              <p className="text-xs text-gray-500 mb-4">
                We will send a verification code to your email ID.
              </p>
            </div>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009494]"
            disabled={isLoading}
          />
          {emailError && (
            <p className="mt-2 text-sm text-red-500 text-right">{emailError}</p>
          )}
          {generalError && (
            <p className="mt-2 text-sm text-red-500 text-center">{generalError}</p>
          )}
          <button
            onClick={handleNext}
            className={`w-full mt-6 py-4 text-white font-semibold rounded-2xl transition-transform transform ${mainColor} hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Next'}
          </button>
        </div>
      )}

      {step === 'code' && (
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center mb-8 cursor-pointer" onClick={() => setStep('email')}>
            <IoArrowBackCircle className="text-[#007D7D] text-[2rem] mb-5 mt-1 ml-3" />
          </div>
          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Password Reset Code</h1>
            {codeError ? (
              <AiFillCloseCircle className="w-20 h-20 mb-4 text-red-500" />
            ) : (
              <BsShieldLockFill className="w-20 h-20 mb-4" style={{ color: iconColor }} />
            )}
            <div className="text-left w-full ">
              <p className="mt-2 text-sm font-bold text-gray-500">
                Please enter your reset code.
              </p>
              <p className="text-xs text-gray-500 mb-4">
                We have sent a verification code to your email ID.
              </p>
            </div>
          </div>
          {codeError && (
            <p className="text-center font-bold text-red-500 mb-4">{codeError}</p>
          )}
          {generalError && (
            <p className="mt-2 text-sm text-red-500 text-center">{generalError}</p>
          )}
          <div className="flex justify-between space-x-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!/^[0-9]?$/.test(val)) return;
                  const newCode = [...code];
                  newCode[index] = val;
                  setCode(newCode);
                  if (val && index < code.length - 1) {
                    inputRefs.current[index + 1]?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !code[index] && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                ref={(el) => (inputRefs.current[index] = el)}
                className={`w-12 h-16 text-center text-xl font-bold rounded-xl border-2 ${
                  codeError ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:border-[#009494] focus:ring-2 focus:ring-[#009494]`}
                disabled={isLoading}
              />
            ))}
          </div>
          <button
            onClick={handleCodeSubmit}
            className={`w-full py-4 text-white font-semibold rounded-2xl transition-transform transform ${mainColor} hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Done'}
          </button>
        </div>
      )}

      {step === 'newPassword' && (
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center mb-8 cursor-pointer" onClick={() => setStep('code')}>
            <IoArrowBackCircle className="text-[#007D7D] text-[2rem] mb-5 mt-1 ml-3" />
          </div>
          <div className="flex flex-col items-center mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Enter New Password</h1>
            <BsShieldLockFill className="w-20 h-20 mb-4" style={{ color: iconColor }} />
            <div className="text-left w-full font-bold ">
              <p className="mt-2 text-sm text-gray-500">Please enter your new password below.</p>
            </div>
          </div>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009494]"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009494]"
            disabled={isLoading}
          />
          {passwordMismatchError && (
            <p className="text-sm text-red-500 mb-4">Passwords do not match.</p>
          )}
          {generalError && (
            <p className="mt-2 text-sm text-red-500 text-center">{generalError}</p>
          )}
          <button
            onClick={handlePasswordSubmit}
            className={`w-full py-4 text-white font-semibold rounded-2xl transition-transform transform ${mainColor} hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold text-[#009494] mb-4">Success!</h2>
            <p className="text-gray-700 mb-6">Your password has been successfully reset.</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                handleGoBackToLogin();
              }}
              className={`w-full py-3 text-white font-semibold rounded-xl transition-transform transform ${mainColor} hover:scale-105`}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPass;
