import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsShieldLockFill } from 'react-icons/bs';
import { IoArrowBackCircle } from "react-icons/io5";
import { HiMail } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { IoIosArrowBack } from 'react-icons/io';

const ForgotPass = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const inputRefs = useRef([]);

  const handleNext = () => {
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setStep('code');
  };

  const handleCodeSubmit = () => {
    const enteredCode = code.join('');
    // TODO: In a real app, you would send the code to your backend for verification
    if (enteredCode !== '123456') {
      setCodeError('WRONG VERIFICATION CODE!');
    } else {
      setCodeError('');
      setStep('newPassword');
    }
  };

  const handlePasswordSubmit = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMismatchError(true);
    } else {
      // TODO: In a real app, you would send the new password to your backend
      setPasswordMismatchError(false);
      setShowSuccessModal(true);
    }
  };

  // This function handles the navigation back to the login page
  const handleGoBackToLogin = () => {
    navigate('/login');
  };

  const mainColor = 'bg-[#009494]';
  const iconColor = '#007D7D';

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-100">
      {step === 'email' && (
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
          {/* UPDATED: The onClick now uses the navigate function to go to '/login' */}
          <div className="flex items-center mb-8 cursor-pointer" onClick={handleGoBackToLogin}>
            <IoArrowBackCircle className="text-secondary text-[2rem] mb-5 mt-1 ml-3" />
          </div>
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-2xl font-bold font-outfit text-gray-800">Enter your E-mail</h1>
            <HiMail className="w-20 h-20 mb-4 text-[#007D7D]" />
            <div className="text-left w-full ">
              <p className="mt-2 text-sm font-outfit font-bold text-gray-500">
                Please enter your registered email.
              </p>
              <p className="text-xs font-outfit text-gray-500 mb-4">
                We have sent a verification code to your email ID.
              </p>
            </div>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009494]"
          />
          {emailError && (
            <p className="mt-2 text-sm text-red-500 text-right">{emailError}</p>
          )}
          <button
            onClick={handleNext}
            className={`w-full mt-6 py-4 text-white font-outfit font-semibold rounded-2xl transition-transform transform ${mainColor} hover:scale-105`}
          >
            Next
          </button>
        </div>
      )}

      {step === 'code' && (
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
          {/* This back arrow correctly goes back one step in the internal form flow */}
          <div className="flex items-center mb-8 cursor-pointer" onClick={() => setStep('email')}>
            <IoArrowBackCircle className="text-secondary text-[2rem] mb-5 mt-1 ml-3" />
          </div>
          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-2xl font-bold font-outfit text-gray-800 mb-8">Password Reset Code</h1>
            {codeError ? (
              <AiFillCloseCircle className="w-20 h-20 mb-4 text-red-500" />
            ) : (
              <BsShieldLockFill className="w-20 h-20 mb-4" style={{ color: iconColor }} />
            )}
            <div className="text-left w-full ">
              <p className="mt-2 text-sm font-outfit font-bold text-gray-500">
                Please enter your reset code.
              </p>
              <p className="text-xs font-outfit text-gray-500 mb-4">
                We have sent a verification code to your email ID.
              </p>
            </div>
          </div>
          {codeError && (
            <p className="text-center font-bold text-red-500 mb-4">{codeError}</p>
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
              />
            ))}
          </div>
          <button
            onClick={handleCodeSubmit}
            className={`w-full py-4 text-white font-semibold font-outfit rounded-2xl transition-transform transform ${mainColor} hover:scale-105`}
          >
            Done
          </button>
        </div>
      )}

      {step === 'newPassword' && (
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
          {/* This back arrow also correctly goes back one step in the internal flow */}
          <div className="flex items-center mb-8 cursor-pointer" onClick={() => setStep('code')}>
            <IoArrowBackCircle className="text-secondary text-[2rem] mb-5 mt-1 ml-3" />
          </div>
          <div className="flex flex-col items-center mb-6 text-center">
            <h1 className="text-2xl font-bold font-outfit text-gray-800 mb-8">Enter New Password</h1>
            <BsShieldLockFill className="w-20 h-20 mb-4" style={{ color: iconColor }} />
            <div className="text-left w-full font-outfit font-bold ">
              <p className="mt-2 text-sm font-outfit text-gray-500">Please enter your new password below.</p>
            </div>
          </div>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009494]"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009494]"
          />
          {passwordMismatchError && (
            <p className="text-sm text-red-500 mb-4">Passwords do not match.</p>
          )}
          <button
            onClick={handlePasswordSubmit}
            className={`w-full py-4 text-white font-semibold font-outfit rounded-2xl transition-transform transform ${mainColor} hover:scale-105`}
          >
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPass;
