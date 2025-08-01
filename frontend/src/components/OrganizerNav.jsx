import React, { useState } from "react";
import { IoExitOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

function OrganizerNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navbar */}
  <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white z-50 px-4 flex items-center justify-between shadow">
  {/* Burger Menu */}
  <button
    onClick={() => setIsOpen(true)}
    className="text-2xl text-gray-700 cursor-pointer"
  >
    <FiMenu />
  </button>

  {/* Profile Icon */}
 <CgProfile className="text-4xl sm:text-5xl text-gray-600" />
</div>

      {/* Mobile Popup Navigation */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center md:hidden">
          <div className="bg-white w-11/12 max-w-sm rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-xl text-gray-700 cursor-pointer"
            >
              <FiX />
            </button>

            {/* Logo */}
            <div className="mb-6 text-center mt-4">
              <img src="/sariLogo.png" alt="Sari-Sari Events Logo" className="h-10 mx-auto" />
            </div>

            {/* Navigation */}
            <ul className="space-y-4 text-center text-gray-800">
              <li className="cursor-pointer hover:text-teal-600 transition-colors">Dashboard</li>
              <li className="cursor-pointer hover:text-teal-600 transition-colors">My Events</li>
              <li className="cursor-pointer hover:text-teal-600 transition-colors">Attendees</li>
              <li className="cursor-pointer hover:text-teal-600 transition-colors">Manage Account</li>
            </ul>

            <hr className="my-5 border-gray-300" />

            {/* Footer */}
            <div className="flex flex-col gap-3 items-center text-secondary">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => console.log("Back to client-dashboard")}
              >
                <IoIosArrowBack className="text-xl" />
                <span className="text-sm font-medium font-outfit">Back</span>
              </div>
              <button
                className="flex items-center gap-2 hover:underline font-outfit transition-colors"
                onClick={() => console.log("Logout clicked")}
              >
                <IoExitOutline className="text-xl transform -scale-x-100" />
                <span className="text-sm font-medium">Log Out</span>
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
        <ul className="space-y-5 text-left px-10 text-gray-800">
          <li className="cursor-pointer hover:text-teal-600 transition-colors">Dashboard</li>
          <li className="cursor-pointer hover:text-teal-600 transition-colors">My Events</li>
          <li className="cursor-pointer hover:text-teal-600 transition-colors">Attendees</li>
          <li className="cursor-pointer hover:text-teal-600 transition-colors">Manage Account</li>
        </ul>

        

        {/* Footer */}
        <hr className="border-gray-300" />
        <div className="flex flex-col gap-35 text-left text-secondary">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => console.log("Back to client-dashboard")}>
            <IoIosArrowBack className="text-xl" />
            <span className="text-sm font-medium font-outfit">Back</span>
          </div>
          <button
            className="flex items-center mb-10 hover:underline font-outfit transition-colors"
            onClick={() => console.log("")} >
            <IoExitOutline className="text-xl transform -scale-x-100" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default OrganizerNav;
