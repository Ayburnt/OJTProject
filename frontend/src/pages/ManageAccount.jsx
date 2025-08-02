import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import OrganizerNav from '../components/OrganizerNav';

// A simple modal component to replace the browser's alert() function.
// It displays a message and can be closed by clicking the close button.
const MessageModal = ({ message, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <OrganizerNav />
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center animate-fade-in">
        <h4 className="text-xl font-semibold font-outfit mb-4 text-gray-800">Action</h4>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

// This is a placeholder for the OrganizerNav component since it was an external import.
// It provides a basic sidebar navigation to make the app runnable.

const ManageAccount = () => {
  // State for managing edit mode and the profile data
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Lester',
    lastName: 'James',
    email: 'lester.james@company.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    role: 'Event Manager',
    bio: 'Experienced event manager with 5+ years in corporate event planning and team coordination.'
  });

  // State for managing notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: false
  });

  // State for managing the custom message modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Handle saving changes
  const handleSave = () => {
    setIsEditing(false);
    // In a real application, you would make an API call to save the data here.
    console.log('Profile saved:', profileData);
  };

  // Function to show the modal with a specific message
  const handleShowModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-outfit">
      <style>
        {`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        `}
      </style>

      {/* Sidebar component */}
      <OrganizerNav />

      {/* Main content area */}
      <div className="flex-1 p-4 lg:p-8 align-right justify-end">
        <div className="w-[75%] mx-auto mr-12">
          <h2 className="text-xl lg:text-2xl font-semibold font-outfit text-gray-800 mb-6 lg:mb-8">Account Settings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Sidebar content - now on the right side */}
            <div className="space-y-6">
              
              {/* Profile Picture */}
              <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 text-center">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-lg lg:text-2xl font-outfit font-bold">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </span>
                </div>
                <h4 className="font-semibold font-outfit text-gray-800">{profileData.firstName} {profileData.lastName}</h4>
                <p className="text-sm text-gray-500">{profileData.role}</p>
                <button
                  onClick={() => handleShowModal('Photo upload functionality would go here!')}
                  className="mt-3 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-full sm:w-auto"
                >
                  Upload Photo
                </button>
              </div>
              
              {/* Account Actions */}
              <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
                <h3 className="text-lg font-semibold font-outfit text-gray-800 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleShowModal('Change password functionality would go here!')}
                    className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => handleShowModal('Delete account functionality would go here!')}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
            
            {/* Profile and Notification Sections - now on the left */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Section */}
              <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="text-lg font-semibold font-outfit text-gray-800">Profile Information</h3>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`px-4 py-2 rounded-lg transition-colors w-full sm:w-auto ${
                      isEditing
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg text-base ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                    />
                  </div>
                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg text-base ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                    />
                  </div>
                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg text-base ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                    />
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg text-base ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                    />
                  </div>
                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg text-base ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                    />
                  </div>
                  {/* Role */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={profileData.role}
                      onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg text-base ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                    />
                  </div>
                </div>
                
                {/* Bio */}
                <div className="mt-4">
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg resize-none text-base ${
                      isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                    } focus:outline-none`}
                  />
                </div>
              </div>
              
              {/* Notification Settings */}
              <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
                <h3 className="text-lg font-semibold font-outfit text-gray-800 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 pr-4">
                      <p className="font-medium font-outfit text-gray-700">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive event updates via email</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, email: !notifications.email})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        notifications.email ? 'bg-teal-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 pr-4">
                      <p className="font-medium font-outfit text-gray-700">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive urgent updates via SMS</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        notifications.sms ? 'bg-teal-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  {/* Marketing Updates */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 pr-4">
                      <p className="font-medium font-outfit text-gray-700">Marketing Updates</p>
                      <p className="text-sm text-gray-500">Product updates and promotions</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, marketing: !notifications.marketing})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
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
          </div>
        </div>
      </div>
      
      {/* Conditionally render the modal */}
      {showModal && <MessageModal message={modalMessage} onClose={() => setShowModal(false)} />}
    </div>
  );
};



export default ManageAccount;
