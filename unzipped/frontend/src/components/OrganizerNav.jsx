import React, { useState } from "react";
import { IoExitOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import useAuth from '../hooks/useAuth';

function OrganizerNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { isLoggedIn, userRole, userEmail, userFirstName, userProfile, logout } = useAuth();

  let title;

  switch (currentPath) {
    case "/organizer-dashboard":
      document.title = 'Dashboard | Sari-Sari Events';
      title = 'Dashboard Overview';
      break;
    case "/my-event":
      document.title = 'My Events | Sari-Sari Events';
      title = 'Event Overview';
      break;
    default:
      document.title = 'Sari-Sari Events';
      title = <h1>404 - Page Not Found</h1>;
  }


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

          <p className="font-outfit text-lg">{title}</p>
        </div>

        {isLoggedIn ? (
          <>
            {userProfile && <img src={userProfile} alt="User Profile" className="h-8 w-8 rounded-full object-cover" />}
          </>
        ) : (
          <CgProfile className="text-4xl sm:text-5xl text-gray-600" />
        )}

      </div>

      {/* Mobile Popup Navigation */}
      {isOpen && (
        <div
          className={`fixed top-0 left-0 w-[80%] h-screen bg-black bg-opacity-40 z-60 flex justify-center items-center md:hidden`}>
          <div className="bg-white w-full rounded-xl shadow-lg p-6 relative h-screen overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-xl text-gray-700 cursor-pointer"
            >
              <FiX />
            </button>

            {/* Logo */}
            <div className="mb-15 text-center mt-4">
              <img src="/sariLogo.png" alt="Sari-Sari Events Logo" className="h-10 mx-auto" />
            </div>

            {/* Navigation */}
            <div className="flex flex-col items-center justify-center">
              <ul className="w-full text-center bg-white text-gray-800 flex flex-col items-start">
                <Link to='/organizer-dashboard' className={`${title === 'Dashboard Overview' && `bg-[#009494]`} w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}>
                  <p className={`${title === 'Dashboard Overview' && `bg-[#EEEEEE]`} py-3 ml-5 pl-3 font-outfit`}>Dashboard</p>
                </Link>
                <Link to='/my-event' className={`${title === 'Event Overview' && `bg-[#5BD4D4]`} w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}>
                  <p className={`${title === 'Event Overview' && `bg-[#EEEEEE]`} py-3 ml-5 pl-3 font-outfit`}>My Event</p>
                </Link>
                <Link to='/attendees' className={`${title === 'Attendees Overview' && `bg-[#FF965D]`} w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}>
                  <p className={`${title === 'Attendees Overview' && `bg-[#EEEEEE]`} py-3 ml-5 pl-3 font-outfit`}>Attendees</p>
                </Link>
                <Link to='/my-event' className={`${title === 'Manage Account' && `bg-[#EF4B4C]`} w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}>
                  <p className={`${title === 'Manage Account' && `bg-[#EEEEEE]`} py-3 ml-5 pl-3 font-outfit`}>Manage Account</p>
                </Link>
              </ul>
            </div>

            <hr className="my-5 border-gray-300" />

            {/* Footer */}
            <div className="flex flex-col mt-10 gap-3 pl-8 w-full items-start text-secondary">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => console.log("Back to client-dashboard")}
              >
                <IoIosArrowBack className="text-xl" />
                <span className="text-sm font-medium font-outfit">Back</span>
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
      <div className="hidden md:flex md:flex-col md:justify-between md:h-screen md:w-64 md:bg-white md:p-6 md:shadow fixed top-0 left-0 z-40">
        {/* Logo */}
        <div className="mb-3 mt-2 flex justify-center">
          <img src="/sariLogo.png" alt="Sari-Sari Events Logo" className="h-10" />
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center justify-center w-full bg-gray-200">
          <ul className="w-full text-center bg-white text-gray-800 flex flex-col items-start">
            <Link
              to="/organizer-dashboard"
              className={`${title === 'Dashboard Overview' ? 'bg-[#009494]' : ''
                } w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}
            >
              <p
                className={`${title === 'Dashboard Overview' ? 'bg-[#EEEEEE]' : ''
                  } py-3 ml-5 pl-3 font-outfit`}
              >
                Dashboard
              </p>
            </Link>

            <Link
              to="/my-event"
              className={`${title === 'Event Overview' ? 'bg-[#5BD4D4]' : ''
                } w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}
            >
              <p
                className={`${title === 'Event Overview' ? 'bg-[#EEEEEE]' : ''
                  } py-3 ml-5 pl-3 font-outfit`}
              >
                My Events
              </p>
            </Link>

            <Link
              to="/attendees"
              className={`${title === 'Attendees Overview' ? 'bg-[#FF965D]' : ''
                } w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}
            >
              <p
                className={`${title === 'Attendees Overview' ? 'bg-[#EEEEEE]' : ''
                  } py-3 ml-5 pl-3 font-outfit`}
              >
                Attendees
              </p>
            </Link>

            <Link
              to="/manage-account"
              className={`${title === 'Manage Account' ? 'bg-[#EF4B4C]' : ''
                } w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}
            >
              <p
                className={`${title === 'Manage Account' ? 'bg-[#EEEEEE]' : ''
                  } py-3 ml-5 pl-3 font-outfit`}
              >
                Manage Account
              </p>
            </Link>
          </ul>
        </div>



        {/* Footer */}
        <hr className="border-gray-300" />
        <div className="flex flex-col gap-35 text-left text-secondary">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => console.log("Back to client-dashboard")}>
            <IoIosArrowBack className="text-xl" />
            <span className="text-sm font-medium font-outfit">Back</span>
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
