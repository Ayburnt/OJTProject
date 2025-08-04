import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
const SariSariLogo = "/sariLogo.png";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import useAuth from '../hooks/useAuth';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, userRole, userEmail, userFirstName, userProfile, logout } = useAuth();
  

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={SariSariLogo}
            alt="SariSari Logo"
            className="h-10 md:h-12 object-contain rounded-md"
          />
        </div>

        {/* Search Bar (centralized and sleek) */}
        <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-md mx-4 md:mx-8">
          <CiSearch className="text-gray-500 text-secondary text-xl mr-2" />
          <input
            type="text"
            placeholder="Search for events..."
            className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500 text-base"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link to="/find-my-ticket" className="text-gray-700 hover:text-teal-600 transition-colors text-base font-medium">
            Find my Tickets
          </Link>
          <Link to="#" className="text-gray-700 hover:text-teal-600 transition-colors text-base font-medium">
            Create Event
          </Link>
          {isLoggedIn ? (
            <>
              <button className="text-gray-700 hover:text-teal-600 transition-colors text-base font-medium cursor-pointer" onClick={logout}>Log out</button>
              {userProfile && <img src={userProfile} alt="User Profile" className="h-8 w-8 rounded-full object-cover" />}
              <p className="text-gray-700 transition-colors text-base font-medium">{userFirstName}</p>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-teal-600 transition-colors text-base font-medium">
                Login
              </Link>

            </>
          )}
        </nav>

        {/* Mobile menu icon */}
        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-700 focus:outline-none p-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Content (conditionally rendered) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white py-2 shadow-md">
          <nav className="flex flex-col items-center space-y-3">
            <Link to="#" className="font-outfit block text-gray-700 hover:text-teal-600 transition-colors text-base font-medium py-1">
              Find my Tickets
            </Link>
            <Link to="#" className="font-outfit block text-gray-700 hover:text-teal-600 transition-colors text-base font-medium py-1">
              Create Event
            </Link>

            {isLoggedIn ? (
              <>
              <button className="font-outfit block text-gray-700 hover:text-teal-600 transition-colors text-base font-medium py-1" onClick={logout}>Log out</button>
              {userProfile && <img src={userProfile} alt="User Profile" className="h-8 w-8 rounded-full object-cover" />}
              <p className='font-outfit block text-gray-700 hover:text-teal-600 transition-colors text-base font-medium py-1'>{userFirstName}</p>
              </>
            ) : (
              <>
              <Link to="/login" className="block text-gray-700 hover:text-teal-600 transition-colors text-base font-medium py-1">
              Login
            </Link>

              </>
            )}      
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
