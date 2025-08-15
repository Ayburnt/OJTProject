    import { useState } from 'react';
import { IoArrowBackCircle } from "react-icons/io5";
import { BsShieldLockFill } from 'react-icons/bs';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const mainColor = 'bg-[#009494]';
  const iconColor = '#007D7D';

  const handlePasswordChange = async () => {
    setPasswordMismatchError(false);
    setGeneralError('');

    if (newPassword !== confirmPassword) {
      setPasswordMismatchError(true);
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setGeneralError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      // Assuming your backend endpoint is something like:
      // POST /auth/change-password/ with { current_password, new_password }
      const response = await api.post('/auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
      } else {
        setGeneralError(response.data?.detail || 'Failed to change password.');
      }
    } catch (error) {
      const errMsg = error.response?.data?.detail || 'Failed to change password.';
      setGeneralError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-100 font-inter">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center mb-8 cursor-pointer" onClick={() => navigate(-1)}>
          <IoArrowBackCircle className="text-[#007D7D] text-[2rem] mb-5 mt-1 ml-3" />
        </div>

        <div className="flex flex-col items-center mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Change Password</h1>
          <BsShieldLockFill className="w-20 h-20 mb-4" style={{ color: iconColor }} />
          <div className="text-left w-full font-bold ">
            <p className="mt-2 text-sm text-gray-500">Enter your current password and set a new one below.</p>
          </div>
        </div>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mb-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009494]"
          disabled={isLoading}
        />

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
          placeholder="Confirm New Password"
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
          onClick={handlePasswordChange}
          className={`w-full py-4 text-white font-semibold rounded-2xl transition-transform transform ${mainColor} hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold text-[#009494] mb-4">Success!</h2>
            <p className="text-gray-700 mb-6">Your password has been successfully changed.</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/'); // Or wherever you want to send user
              }}
              className={`w-full py-3 text-white font-semibold rounded-xl transition-transform transform ${mainColor} hover:scale-105`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
