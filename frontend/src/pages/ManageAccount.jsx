import React, { useState } from 'react';
import { FiUpload } from "react-icons/fi";
import OrganizerNav from '../components/OrganizerNav';
import { Link } from 'react-router-dom';
 // Import OrganizerNav component


// The main application component
const ManageAccount= () => {
  // State for managing edit mode and the profile data
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Lester',
    lastName: 'James',
    email: 'lester.james@company.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    companyEmail: 'lester.james@techcorp.com',
    companyAddress: '123 Tech Drive, Silicon Valley, CA 94043',
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-outfit">
   <OrganizerNav />

      {/* Main content area */}
      <main className="flex-1 p-4 lg:p-8 max-w-5xl mx-auto w-full lg:translate-x-25">


        
        {/* Profile Picture and Account Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-7 flex-1">
          <div className="flex flex-col lg:flex-row  items-center sm:items-start justify-between gap-6">
            {/* Left side: Profile image and name */}
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg lg:text-2xl font-outfit font-bold">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </span>
                <button
                  onClick={() => handleShowModal('Photo upload functionality would go here!')}
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Upload photo"
                >
                  <FiUpload className="text-teal-500" />
                </button>
              </div>
              <div>
                <h4 className="font-semibold font-outfit text-gray-800 text-3xl">{profileData.firstName} {profileData.lastName}</h4>
                <p className="text-lg font-outfit text-gray-500">{profileData.role}</p>
              </div>
            </div>
            {/* Right side: Account actions, now stacked vertically */}
            <div className="flex flex-col space-y-2 w-full sm:w-auto">
              <Link to="/forgot-password">
              <button
                className="w-full sm:w-auto px-4 py-2 text-lg font-outfit text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Change Password
              </button>
              </Link>
              
              <Link to="/verification-form">
              <button
                className="w-full sm:w-auto px-4 py-2 text-lg font-outfit text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Verify Account
              </button>
            </Link>
            <button
                onClick={() => handleShowModal('Delete account functionality would go here!')}
                className="w-full sm:w-auto px-4 py-2 text-lg font-outfit text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete Account
              </button>
              </div>
          </div>
        </div>
        
        <div className="lg:grid-cols-3 gap-6 lg:gap-8 ">
          
          {/* Left Column for Profile and Notifications */}
          <div className="sm:col-span-2 space-y-10 ">
            
            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-10 w-full">
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
                    className={`w-full  px-4 py-3 border rounded-lg text-base ${
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
                {/* Company Email */}
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Company Email</label>
                  <input
                    type="email"
                    value={profileData.companyEmail}
                    onChange={(e) => setProfileData({...profileData, companyEmail: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-base ${
                      isEditing ? 'border-gray-300 focus:ring-2 focus:ring-teal-500' : 'border-gray-200 bg-gray-50'
                    } focus:outline-none`}
                  />
                </div>
                {/* Company Address */}
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Company Address</label>
                  <input
                    type="text"
                    value={profileData.companyAddress}
                    onChange={(e) => setProfileData({...profileData, companyAddress: e.target.value})}
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
          
          {/* Right Column for extra content - now empty */}
          <div className="space-y-6">
          </div>
        </div>
      </main>
      
      {/* Conditionally render the modal */}
      {showModal && <MessageModal message={modalMessage} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ManageAccount;
