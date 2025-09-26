import React, { useEffect, useState, useRef } from 'react';
import { FiUpload } from "react-icons/fi";
import StaffNav from '../components/StaffNav';
import OrganizerNav from '../components/OrganizerNav';
import { Link } from 'react-router-dom';
import api from '../api';
import useAuth from '../hooks/useAuth';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { FaTrashAlt } from "react-icons/fa";

// Modal for success/error messages
const MessageModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
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

const InputFields = ({ lbl, fieldType, fieldName, handleStaffDataChange, inputValue }) => {
  return (
    <div className='w-full flex flex-col items-start font-outfit'>
      <label htmlFor="" className='font-medium text-sm text-[#555555]'>{lbl}</label>
      <input onChange={handleStaffDataChange} value={inputValue} required type={fieldType} name={fieldName} className='w-full text-sm border border-[#AAAAAA] focus:bg-gray-100 transition-all duration-300 outline-none py-2 px-3 rounded-md shadow-sm' />
    </div>
  )

}

const ManageAccount = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddUser, setIsAddUser] = useState(false);
  const [isStaffLoading, setIsStaffLoading] = useState(false);
  const [isUploadLogo, setIsUploadLogo] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const { userCode, userRole, orgLogo, setOrgLogo } = useAuth();

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: false
  });

  const [staffData, setStaffData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'staff',
  });

  useEffect(() => {
    document.title = 'Manage Account | Sari-Sari Events';
  })

  const handleStaffDataChange = (e) => {
    // e.target refers to the input field that triggered the event
    const { name, value } = e.target;
    // Use the spread operator to copy the existing state and then
    // update only the field that changed ([name]: value)
    setStaffData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleRegStaff = async (e) => {
    e.preventDefault();
    setIsStaffLoading(true);

    if (staffData.password && staffData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setIsStaffLoading(false);
      return;
    }

    try {
      const payload = {
        ...staffData,      // flatten out email, password, etc.
        captcha: captchaToken
      };
      const res = await api.post(`auth/register-staff/`, payload);
      toast.success("Staff account created successfully!");
      setStaffData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'staff',
      })
      setIsAddUser(false);
      fetchStaffs();

      recaptchaRef.current.reset();
      setCaptchaToken(null);
    } catch (err) {
      console.error("Failed to add account:", err);

      if (err.response?.data) {
        Object.values(err.response.data).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(msg));
          } else {
            toast.error(messages);
          }
        });
      } else {
        toast.error("Failed to add account. Please try again.");
      }

      // ✅ Reset captcha after failed submission
      recaptchaRef.current.reset();
      setCaptchaToken(null);
    } finally {
      setIsStaffLoading(false);
    }
  }


  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef();
  const {updateVerificationStatus} = useAuth();

  const fileInputRef = useRef(null); // for profile picture
  const logoInputRef = useRef(null); // for company logo
  

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/staff-info/`);
      setUserData(res.data);      
      console.log('coorg',res.data);
      updateVerificationStatus(res.data.verification_status);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile. Please try again.');
      setUserData({ verification_status: 'unverified' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (isAddUser) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset'; // or 'auto'
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset'; // or 'auto'
    };
  }, [isAddUser]);

  const handleSave = async () => {
    try {
      const res = await api.patch('/me/', {
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone_number: userData.phone_number,
        company_name: userData.company_name,
        company_website: userData.company_website,
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


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const res = await api.patch("/me/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUserData(res.data);
      handleShowModal("Profile picture updated successfully!");
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      handleShowModal("Failed to upload profile picture. Please try again.");
    }
  };
  
  // Company logo upload
  const handleLogoUpload = () => {
    setIsUploadLogo(true);
  };

  const handleLogoFileChange = async () => {
  if (!logoFile) return; // no file selected

  const formData = new FormData();
  formData.append("org_logo", logoFile);

  try {
    const res = await api.patch("/me/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const newLogoUrl = res.data.org_logo;
    setOrgLogo(newLogoUrl);
    localStorage.setItem("orgLogo", newLogoUrl);
    setIsUploadLogo(false);
    window.location.reload();
  } catch (err) {
    console.error("Failed to upload company logo:", err);
    handleShowModal("Failed to upload company logo. Please try again.");
  }
};

  const [staffList, setStaffList] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const fetchStaffs = async () => {
    try {
      const res = await api.get(`staff-list/`);
      setStaffList(res.data);
    } catch (err) {
      console.error("Failed to fetch staff accounts:", err);
    }
  }

  useEffect(() => {
    fetchStaffs();
  }, [])

  // Active Staffs
const activeStaffs = staffList.filter((staff) => staff.is_active);
// Inactive Staffs
const inactiveStaffs = staffList.filter((staff) => !staff.is_active);

const handleDeactivate = async (id) => {
  try {
    await api.delete(`staff/${id}/delete/`);
    toast.success("Staff account deactivated!");
    fetchStaffs();
  } catch (err) {
    console.log(err)
    toast.error("Failed to deactivate staff.");
  }
};

const handleReactivate = async (id) => {
  try {
    await api.post(`staff/${id}/reactivate/`, { is_active: true });
    toast.success("Staff account reactivated!");
    fetchStaffs();
  } catch (err) {
    toast.error("Failed to reactivate staff.");
  }
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

  const generatePassword = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };


  return (
    <div className="flex min-h-screen bg-gray-100 pt-18 md:pt-0 font-outfit">
      {isStaffLoading && (
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={isStaffLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {isUploadLogo && (
        <div className="fixed inset-0 z-100 py-10 h-screen flex items-center justify-center bg-black/50 font-outfit">
          <div className="bg-white flex flex-col rounded-lg shadow-xl w-full max-w-sm xl:max-w-md text-center">
            <div className='border-b-2 border-gray-300 py-3'>
              <h1 className='font-semibold text-xl'>{userRole === 'organizer' ? 'Change Logo' : 'Change Profile'}</h1>
            </div>
            <div className='w-full px-4 md:px-7 py-5 flex flex-col items-center'>
              <p className="text-sm text-gray-500 text-left w-full">Recommended size: 1:1 ratio (JPG or PNG)</p>
              <div onClick={() => document.getElementById('logoFile').click()} className={`cursor-pointer w-full flex justify-center items-center aspect-square border-2 border-dashed rounded-xl relative overflow-hidden`}>
                {logoFile ? (
                  logoFile instanceof File ? (
                    <img
                      src={URL.createObjectURL(logoFile)}
                      alt="Event Poster Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <img
                      src={logoFile} // Use string URL directly (e.g., from backend)
                      alt="Event Poster Preview"
                      className="object-cover w-full h-full"
                    />
                  )
                ) : (
                  <span className="text-gray-500">Upload an image here</span>
                )}

                <input id="logoFile" name="logoFile" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="hidden"
                />

                {/* <button type="button" onClick={() => document.getElementById('logoFile').click()} className="absolute bottom-4 right-4 bg-teal-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-600 transition-colors duration-200 cursor-pointer">
                  Upload
                </button> */}
              </div>

              <div className='w-full mt-3 flex flex-row justify-end gap-2'>
                <button onClick={() => { setIsUploadLogo(false); setLogoFile(null) }}>Cancel</button>
                <button onClick={handleLogoFileChange} className='bg-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors duration-200 cursor-pointer'>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddUser && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 font-outfit">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm xl:max-w-lg px-6 py-10 text-center">
            <h1 className='text-2xl font-semibold text-secondary'>Add New Account</h1>
            <p className='max-w-lg text-gray-500'>This account has access to check in attendees and view their details.</p>
            <div className='grid grid-cols-1 gap-3 mt-5'>
              <InputFields inputValue={staffData.first_name} handleStaffDataChange={handleStaffDataChange} lbl='First Name' fieldType='text' fieldName='first_name' />
              <InputFields inputValue={staffData.last_name} handleStaffDataChange={handleStaffDataChange} lbl='Last Name' fieldType='text' fieldName='last_name' />
              <InputFields inputValue={staffData.email} handleStaffDataChange={handleStaffDataChange} lbl='Email' fieldType='email' fieldName='email' />
              <div className='w-full flex flex-col items-start font-outfit'>
                <label htmlFor="" className='font-medium text-[#555555] text-sm'>Password <span className='text-gray-400'>(at least 8 characters)</span></label>
                <input value={staffData.password} onChange={handleStaffDataChange} required type='password' name='password' className='w-full border border-[#AAAAAA] focus:bg-gray-100 transition-all duration-300 outline-none py-2 px-3 rounded-md shadow-sm text-sm' />
                <button onClick={() => setStaffData(prev => ({ ...prev, password: generatePassword() }))} className='text-secondary self-start text-sm cursor-pointer font-medium hover:text-secondary/90'>Generate password</button>
              </div>
            </div>

            <div className='w-full flex justify-center items-center'>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>
            <div className='mt-5 flex flex-row items-center justify-end'>
              <button onClick={() => setIsAddUser(false)} className='hover:text-secondary/90 transition-all duration-300 text-secondary font-medium mr-3 cursor-pointer'>Cancel</button>
              <button onClick={handleRegStaff} className='bg-secondary hover:bg-secondary/90 transition-all duration-300 font-medium text-white py-2 px-4 rounded-lg cursor-pointer'>Add Account</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="md:block md:w-56 lg:w-64 shrink-0">
        {userRole === 'co-organizer' ? (
          <OrganizerNav />
        ) : (<StaffNav />)}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full md:ml-5 lg:ml-0">     
        <div className="bg-white rounded-xl shadow-md p-6 mb-7 flex-1">
                  <div className="flex flex-col lg:flex-row w-full items-center sm:items-start justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center">
                      {userData.qr_code_image && (
                        <div className="w-2/4 md:w-1/4">
                          <img src={userData.qr_code_image} alt="" className="aspect-square w-full" />
                        </div>
                      )}
                      <div className="flex space-x-4 items-center">
                        <div className="relative w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                          <img
                            src={orgLogo}
                            className="rounded-full border-2 border-gray-500 w-full h-full object-cover"
                            alt="Profile"
                          />
                          <button
                            onClick={handleLogoUpload}
                            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            aria-label="Upload photo"
                          >
                            <FiUpload className="text-teal-500" />
                          </button>
                          {/* hidden input */}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold font-outfit text-gray-800 text-3xl">
                            {userData.company_name}
                          </h4>
                          <p className="text-lg font-outfit text-gray-500">{userData.first_name} {userData.last_name}</p>
                        </div>
                      </div>
                    </div>
        
                    <div className="grid grid-cols-1 gap-4 w-full sm:w-auto">
                      <Link to="/change-password">
                        <button
                          className="w-full px-5.5 py-2 text-sm font-outfit text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          Change Password
                        </button>
                      </Link>
        
                      {userRole === 'organizer' && (
                        userData.verification_status === 'pending' ? (
                          <button
                            disabled
                            className="w-full px-9 py-2 text-sm font-outfit text-gray-500 border border-gray-500 rounded-lg cursor-not-allowed"
                          >
                            Verification Pending
                          </button>
                        ) : userData.verification_status === 'verified' ? (
                          <button
                            disabled
                            className="w-full px-9 py-2 text-sm font-outfit text-green-600 border border-green-600 rounded-lg cursor-not-allowed"
                          >
                            Verified
                          </button>
                        ) : (
                          <Link to={`/org/${userCode}/verification-form`}>
                            <button
                              className="w-full px-9 py-2 text-sm font-outfit text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              {userData.verification_status === 'declined' ? 'Re-Verify Account' : 'Verify Account'}
                            </button>
                          </Link>
                        )
                      )}
        
        
                      {/* Delete Account Button */}
                      <button
                        onClick={() => handleShowModal('Delete account functionality would go here!')}
                        className="w-full px-4 py-2 text-sm font-outfit text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Delete Account
                      </button>
        
                      {/* Hidden input for logo (remains the same) */}
                      <input
                        type="file"
                        ref={logoInputRef}
                        onChange={handleLogoFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>   
        <div className="lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="sm:col-span-2 space-y-10">

            {/* Profile Info */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-10 w-full">
              <div className="flex flex-col w-full lg:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold font-outfit text-gray-800">Profile Information</h3>
                <div className='w-full md:w-auto items-center justify-center md:justify-end flex flex-row gap-5 lg:gap-2'>                  
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${isEditing
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Organization</label>
                  <input
                    type="text"
                    value={userData.added_by.company_name || ''}
                    onChange={(e) => setUserData({ ...userData, company_name: e.target.value })}
                    disabled
                    className={`w-full px-3 py-2 border rounded-lg text-base ${isEditing
                      ? 'border-gray-300 focus:ring-2 focus:ring-teal-500'
                      : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Organization Email Address</label>
                  <input
                    type="text"
                    value={userData.added_by.company_website || ''}
                    onChange={(e) => setUserData({ ...userData, company_website: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-base ${isEditing
                      ? 'border-gray-300 focus:ring-2 focus:ring-teal-500'
                      : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={userData.first_name || ''}
                    onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg text-base ${isEditing
                      ? 'border-gray-300 focus:ring-2 focus:ring-teal-500'
                      : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={userData.last_name || ''}
                    onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-3 py-3 border rounded-lg text-base ${isEditing
                      ? 'border-gray-300 focus:ring-2 focus:ring-teal-500'
                      : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={userData.email || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border rounded-lg text-base border-gray-200 bg-gray-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-outfit text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={userData.phone_number || ''}
                    onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-base ${isEditing
                      ? 'border-gray-300 focus:ring-2 focus:ring-teal-500'
                      : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                  />
                </div>                
              </div>
              <Link to="/change-password" className='w-full mt-4 flex items-end justify-end'>
                                <button
                                  className="px-5.5 py-2 text-sm font-outfit text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                                >
                                  Change Password
                                </button>
                              </Link>
            </div>
            

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
              <h3 className="text-lg font-semibold font-outfit text-gray-800 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 pr-4">
                    <p className="font-medium font-outfit text-gray-700">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive event updates via email</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer ${notifications.email ? 'bg-teal-600' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 pr-4">
                    <p className="font-medium font-outfit text-gray-700">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive urgent updates via SMS</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer ${notifications.sms ? 'bg-teal-600' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.sms ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 pr-4">
                    <p className="font-medium font-outfit text-gray-700">Marketing Updates</p>
                    <p className="text-sm text-gray-500">Product updates and promotions</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, marketing: !notifications.marketing })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer ${notifications.marketing ? 'bg-teal-600' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6"></div>
        </div>
      </main>

      {showModal && <MessageModal message={modalMessage} onClose={() => setShowModal(false)} />}
    </div>
  );
};


export default ManageAccount;