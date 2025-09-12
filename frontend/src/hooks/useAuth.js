// hooks/useAuth.js
import { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../api.js';

const REFRESH_TOKEN = 'refreshToken';
const USER_ROLE = 'userRole';
const USER_EMAIL = 'userEmail';
const USER_CODE = 'userCode';
const USER_FIRST_NAME = 'userFirstName';
const USER_LAST_NAME = 'userLastName';
const USER_PROFILE = 'userProfile';
const IS_LOGGED_IN = 'isLoggedIn';
const IS_VERIFIED = 'verification_status';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCode, setUserCode] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userProfile, setUserProfile] = useState('');
  const [orgLogo, setOrgLogo] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const role = localStorage.getItem(USER_ROLE);
    const email = localStorage.getItem(USER_EMAIL);
    const code = localStorage.getItem(USER_CODE);
    const firstName = localStorage.getItem(USER_FIRST_NAME);
    const lastName = localStorage.getItem(USER_LAST_NAME);
    const profile = localStorage.getItem(USER_PROFILE);
    const verificationStatus = localStorage.getItem(IS_VERIFIED);
    const orgLogo = localStorage.getItem('orgLogo');

    if (accessToken && refreshToken && role && email) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUserEmail(email);
      setUserCode(code || '');
      setUserFirstName(firstName || '');
      setUserProfile(profile || '');
      setUserLastName(lastName || '');
      setVerificationStatus(verificationStatus || '');
      setOrgLogo(orgLogo);
    } else {
      clearAuthData();
    }
  }, []);

  const saveAuthData = (tokens, user) => {
    localStorage.setItem(ACCESS_TOKEN, tokens.access);
    localStorage.setItem(REFRESH_TOKEN, tokens.refresh);
    localStorage.setItem(USER_ROLE, user.role);
    localStorage.setItem(USER_EMAIL, user.email);
    localStorage.setItem(USER_CODE, user.user_code);
    localStorage.setItem(USER_FIRST_NAME, user.first_name || '');
    localStorage.setItem(USER_LAST_NAME, user.last_name || '');
    localStorage.setItem(USER_PROFILE, user.profile_picture || '');
    localStorage.setItem(IS_LOGGED_IN, 'true');
    localStorage.setItem(IS_VERIFIED, user.verification_status || '');
    localStorage.setItem('orgLogo', user.org_logo || '');

    setIsLoggedIn(true);
    setUserRole(user.role);
    setUserEmail(user.email);
    setUserCode(user.user_code || '');
    setUserFirstName(user.first_name || '');
    setUserLastName(user.last_name || '');
    setUserProfile(user.profile_picture || '');
    setVerificationStatus(user.verification_status || '');
    setOrgLogo(user.org_logo);
  };

  const clearAuthData = () => {
    localStorage.clear();

    setIsLoggedIn(false);
    setUserRole('');
    setUserEmail('');
    setUserCode('');
    setUserFirstName('');
    setUserLastName('');
    setUserProfile('');
    setVerificationStatus('');
    setOrgLogo('');
  };

  const login = (tokens, user) => {
    saveAuthData(tokens, user);

    if (user.role === 'organizer') {
      navigate(`/org/${user.user_code}/dashboard`);
    } else if(user.role === 'staff'){
      navigate(`/staff`);
    }
    else if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/');
    }
  };

  const logout = () => {
    clearAuthData();
    navigate('/');
  };

  return {
    isLoggedIn,
    userRole,
    userEmail,
    userCode,
    userFirstName,
    userLastName,    
    userProfile,
    verificationStatus,
    orgLogo,
    login,
    logout
  };
};

export default useAuth;
