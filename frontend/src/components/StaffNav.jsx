import React, { useEffect, useState } from "react";
import { IoExitOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation, useNavigate, matchPath } from "react-router-dom";
import useAuth from '../hooks/useAuth';

function OrganizerNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, orgLogo, logout } = useAuth();

  const pathConfig = [
    {
      pattern: "/staff",
      title: "Event Overview",
      docTitle: "Staff | Sari-Sari Events",
      link: () => `/staff`,
      color: "#5BD4D4",
      exact: true // <-- ADD THIS LINE
    },
    {
      pattern: "/staff/account",
      title: "Manage Account",
      docTitle: "Manage Account | Sari-Sari Events",
      link: () => `/staff/account`,
      color: "#EF4B4C"
    }
  ];

  // Find which route matches the current path
  const currentRoute = pathConfig.find(cfg =>
    matchPath({ path: cfg.pattern, end: cfg.exact || false }, location.pathname)
  ) || { title: "404 - Page Not Found", docTitle: "Sari-Sari Events" };

  // Update document title dynamically
  useEffect(() => {
    document.title = currentRoute.docTitle;
  }, [currentRoute.docTitle]);


  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white z-50 px-4 flex flex-row items-center justify-between shadow">
        {/* Burger Menu */}
        <div className="flex flex-row gap-5 items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="text-2xl text-gray-700 cursor-pointer"
          >
            <FiMenu />
          </button>

          <p className="font-outfit text-lg">{currentRoute.title}</p>
        </div>

        {isLoggedIn ? (
          <>
            {orgLogo && <img src={orgLogo} alt="User Profile" className="h-8 w-8 rounded-full object-cover" />}
          </>
        ) : (
          <CgProfile className="text-4xl sm:text-5xl text-gray-600" />
        )}
      </div>

      {/* Mobile Popup Navigation */}
      {isOpen && (
        <div
          className={`fixed top-0 left-0 w-[70%] h-screen bg-black bg-opacity-40 z-60 flex justify-center items-center md:hidden`}>
          <div className="bg-white w-full shadow-lg py-6 relative h-screen overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-xl text-gray-700 cursor-pointer"
            >
              <FiX />
            </button>

            {/* Logo */}
            <div className="mb-15 text-center mt-4">
              <img src="/sariLogo.png" alt="Sari-Sari Events Logo" className="h-10 mx-auto  cursor-pointer" onClick={() => navigate('/')} />
            </div>

            {/* Navigation */}
            <div className="flex flex-col items-center justify-center">
              <ul className="w-full text-center bg-white text-gray-800 flex flex-col items-start">
                {pathConfig.map(cfg => (
                  <Link
                    key={cfg.pattern}
                    to={cfg.link()}
                    className={`${currentRoute === cfg ? 'bg-black/10' : ''} w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}
                    style={currentRoute === cfg ? { backgroundColor: cfg.color } : {}}
                  >
                    <p className={`${currentRoute === cfg ? 'bg-[#EEEEEE]' : ''} py-3 ml-5 pl-3 font-outfit`}>
                      {cfg.title.replace(" Overview", "")}
                    </p>
                  </Link>
                ))}
              </ul>
            </div>

            <hr className="my-5 border-gray-300" />

            {/* Footer */}
            <div className="flex flex-col mt-10 gap-3 pl-8 w-full items-start text-secondary">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <IoIosArrowBack className="text-xl" />
                <span className="text-sm font-medium font-outfit">Home</span>
              </div>
              <button
                className="flex items-center gap-2 hover:underline font-outfit transition-colors cursor-pointer"
                onClick={logout}
              >
                <IoExitOutline className="text-xl transform -scale-x-100" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:justify-between md:h-screen md:w-64 md:bg-white md:py-6 md:shadow fixed top-0 left-0 z-40">
        {/* Logo */}
        <div className="mb-3 mt-2 flex justify-center">
          <img src="/sariLogo.png" alt="Sari-Sari Events Logo" className="h-10 cursor-pointer" onClick={() => navigate('/')} />
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center justify-center w-full bg-gray-200">
          <ul className="w-full text-center bg-white text-gray-800 flex flex-col items-start">
            {pathConfig.map(cfg => (
              <Link
                key={cfg.pattern}
                to={cfg.link()}
                className={`${currentRoute === cfg ? 'bg-black/10' : ''} w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}
                style={currentRoute === cfg ? { backgroundColor: cfg.color } : {}}
              >
                <p className={`${currentRoute === cfg ? 'bg-[#EEEEEE]' : ''} py-3 ml-5 pl-3 font-outfit`}>
                  {cfg.title.replace(" Overview", "")}
                </p>
              </Link>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <hr className="border-gray-300" />
        <div className="flex flex-col gap-35 text-left text-secondary px-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <IoIosArrowBack className="text-xl" />
            <span className="text-sm font-medium font-outfit">Home</span>
          </div>
          <button
            className="flex items-center mb-10 gap-2 hover:underline font-outfit transition-colors cursor-pointer"
            onClick={logout} >
            <IoExitOutline className="text-xl transform -scale-x-100" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default OrganizerNav;