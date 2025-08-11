import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
const SariSariLogo = "/sariLogo.png";
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import useAuth from '../hooks/useAuth';

function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, userRole, userLastName, userFirstName, userProfile, logout, userCode } = useAuth();
  

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCreateEvent = () => {
    if (isLoggedIn && userRole === 'client') {
      navigate('/create-event');
    } else if(!isLoggedIn){
      navigate('/login');
    }
  }
  
  const [ isAccDD, setIsAccDD ] = useState(false);

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2" onClick={() => navigate('/')}>
          <img
            src={SariSariLogo}
            alt="SariSari Logo"
            className="h-10 md:h-12 object-contain rounded-md cursor-pointer"
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
          <Link to="/find-my-ticket" className={`${isLoggedIn && userRole === 'client' ? 'hidden' : 'block'} text-gray-700 hover:text-teal-600 transition-colors text-base font-medium`}>
            Find my Tickets
          </Link>
          <button onClick={handleCreateEvent} className={`${isLoggedIn && userRole === "guest" ? 'hidden' : 'block'} cursor-pointer text-gray-700 hover:text-teal-600 transition-colors text-base font-medium`}>
            Create Event
          </button>
          {isLoggedIn ? (
            <>              
              {userProfile && <img src={userProfile} alt="User Profile" className="h-8 w-8 rounded-full object-cover cursor-pointer" onClick={() => {setIsAccDD(!isAccDD)}} />}
              
              <div className={`${isAccDD ? 'grid' : 'hidden'} shadow-lg text-sm bg-white absolute right-5 top-full origin-top-right grid-cols-1 place-items-center overflow-hidden border-1 border-gray-300 rounded-b-lg w-full max-w-[15%]`}>
                <p className='font-outfit block border-b-1 border-gray-300 w-full text-center bg-secondary text-white text-gray-700 transition-colors text-base py-2'>{userFirstName} {userLastName}</p>
                <button onClick={() => navigate(`/org/${userCode}/dashboard`)} className="border-b-1 border-gray-300 w-full font-outfit block text-gray-700 hover:text-teal-600 transition-colors text-base py-1 cursor-pointer">Dashboard</button>
                <button className="font-outfit block text-gray-700 hover:text-teal-600 transition-colors text-base py-1 cursor-pointer" onClick={logout}>Log out</button>  
              </div>              
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
            <Link to="#" className={`${isLoggedIn && userRole === 'client' ? 'hidden' : 'block'} font-outfit text-gray-700 hover:text-teal-600 transition-colors text-base font-medium py-1`}>
              Find my Tickets
            </Link>
            <button onClick={handleCreateEvent} className={`${isLoggedIn && userRole === "guest" ? 'hidden' : 'block'} font-outfit text-gray-700 hover:text-teal-600 transition-colors text-base font-medium py-1`}>
              Create Event
            </button>

            {isLoggedIn ? (
              <>              
              {userProfile && <img src={userProfile} alt="User Profile" className="h-8 w-8 rounded-full object-cover" onClick={() => {setIsAccDD(!isAccDD)}} />}
              <div className={`${isAccDD ? 'grid' : 'hidden'} grid-cols-1 place-items-center overflow-hidden border-1 border-gray-300 rounded-xl w-full max-w-sm`}>
                <p className='font-outfit block border-b-1 border-gray-300 w-full text-center bg-secondary text-white text-gray-700 hover:text-teal-600 transition-colors text-base py-2'>{userFirstName} {userLastName}</p>
                <button onClick={() => navigate(`/org/${userCode}/dashboard`)} className="border-b-1 border-gray-300 w-full font-outfit block text-gray-700 hover:text-teal-600 transition-colors text-base py-1 cursor-pointer">Dashboard</button>
                <button className="font-outfit block text-gray-700 hover:text-teal-600 transition-colors text-base py-1 cursor-pointer" onClick={logout}>Log out</button>  
              </div>
              
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
