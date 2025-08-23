import React, { useEffect, useState } from 'react';
import { FiUpload } from "react-icons/fi";
import OrganizerNav from '../components/OrganizerNav';
import { Link } from 'react-router-dom';
import api from '../api';
import useAuth from '../hooks/useAuth';

// Assuming MessageModal is a component you've defined elsewhere
const MessageModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ManageAccount = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null); // Initialize as null for loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userCode } = useAuth();

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: false
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Make sure the API call is authenticated
      const res = await api.get(`/me/`);
      setUserData(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile. Please try again.');
      // Fallback state if the API call fails
      setUserData({ verification_status: 'unverified' });
    } finally {
      setLoading(false);
    }
  };

  // This useEffect will run once when the component is mounted
  // It will automatically fetch the user's profile and verification status
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await api.patch('/me/', {
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone_number: userData.phone_number,
        company_name: userData.company_name,
        company_website: userData.company_website,
        company_address: userData.company_address,
        bio: userData.bio,
      });
      setUserData(res.data);
      setIsEditing(false);
      handleShowModal('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      handleShowModal('Failed to save changes. Please try again.');
    }
  };
  
   useEffect(() => {
          document.title = "Manage Account | Sari-Sari Events";
        }, []);

  const handleShowModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-outfit">
      <OrganizerNav />
      <main className="flex-1 p-4 lg:p-8 max-w-5xl mt-15 md:mt-0 mx-auto w-full lg:translate-x-25">

        {/* Profile Picture and Account Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-7 flex-1">
          <div className="flex flex-col lg:flex-row w-full items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center">
              {userData.qr_code_image && (
                <div className='w-2/4 md:w-1/4'>
                  <img src={userData.qr_code_image} alt="" className='aspect-square w-full' />
                </div>
              )}
              <div className='flex space-x-4 items-center'>
                <div className="relative w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                  <img src={userData.profile_picture} className='rounded-full border-2 border-gray-500' alt="" />
                  <button
                    onClick={() => handleShowModal('Photo upload functionality would go here!')}
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Upload photo"
                  >
                    <FiUpload className="text-teal-500" />
                  </button>
                </div>
                <div>
                  <h4 className="font-semibold font-outfit text-gray-800 text-3xl">{userData.first_name} {userData.last_name}</h4>
                  <p className="text-lg font-outfit text-gray-500">Event Organizer</p>
                </div>
              </div>
              </div>  

            <div className="flex flex-col space-y-2 w-full sm:w-auto">
              <Link to="/org/:userCode/change-password">
                <button
                  className="w-full sm:w-auto px-5.5 py-2 text-lg font-outfit text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  Change Password
                </button>
              </Link>
              
              {userData.verification_status === 'pending' ? (
                <button
                  disabled
                  className="w-full sm:w-auto px-9 py-2 text-lg font-outfit text-gray-500 border border-gray-500 rounded-lg cursor-not-allowed"
                >
                  Verification Pending
                </button>
              ) : userData.verification_status === 'verified' ? (
                <button
                  disabled
                  className="w-full sm:w-auto px-9 py-2 text-lg font-outfit text-green-600 border border-green-600 rounded-lg cursor-not-allowed"
                >
                  Verified
                </button>
              ) : (
                <Link to={`/org/${userCode}/verification-form`}>
                  <button
                    className="w-full sm:w-auto px-9 py-2 text-lg font-outfit text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {userData.verification_status === 'declined' ? 'Re-Verify Account' : 'Verify Account'}
                  </button>
                </Link>
              )}

              <button
                onClick={() => handleShowModal('Delete account functionality would go here!')}
                className="w-full sm:w-auto px-4 py-2 text-lg font-outfit text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="sm:col-span-2 space-y-10">

            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-10 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold font-outfit text-gray-800">Profile Information</h3>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`px-4 py-2 rounded-lg transition-colors w-full sm:w-auto cursor-pointer ${
                    isEditing
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={userData.first_name || ''}
                    onChange={(e) => setUserData({...userData, first_name: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg text-base ${
                      isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={userData.last_name || ''}
                    onChange={(e) => setUserData({...userData, last_name: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-3 py-3 border rounded-lg text-base ${
                      isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={userData.email || ''}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    disabled={true}
                    className={`w-full px-3 py-2 border rounded-lg text-base border-gray-200 bg-gray-50 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={userData.phone_number || ''}
                    onChange={(e) => setUserData({...userData, phone_number: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-base ${
                      isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={userData.company_name || ''}
                    onChange={(e) => setUserData({...userData, company_name: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-base ${
                      isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Company website</label>
                  <input
                    type="text"
                    value={userData.company_website || ''}
                    onChange={(e) => setUserData({...userData, company_website: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-base ${
                      isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
              <h3 className="text-lg font-semibold font-outfit text-gray-800 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 pr-4">
                    <p className="font-medium font-outfit text-gray-700">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive event updates via email</p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, email: !notifications.email})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer ${
                      notifications.email ? 'bg-teal-600' : 'bg-gray-200'
                      }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 pr-4">
                    <p className="font-medium font-outfit text-gray-700">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive urgent updates via SMS</p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer ${
                      notifications.sms ? 'bg-teal-600' : 'bg-gray-200'
                      }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 pr-4">
                    <p className="font-medium font-outfit text-gray-700">Marketing Updates</p>
                    <p className="text-sm text-gray-500">Product updates and promotions</p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, marketing: !notifications.marketing})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer ${
                      notifications.marketing ? 'bg-teal-600' : 'bg-gray-200'
                      }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
          </div>
        </div>
      </main>

      {showModal && <MessageModal message={modalMessage} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ManageAccount;
