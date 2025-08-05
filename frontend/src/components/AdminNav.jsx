import React, { useState } from "react";
import { IoExitOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import useAuth from '../hooks/useAuth';

function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { isLoggedIn, userFirstName, userProfile, logout } = useAuth();

  let title;

  switch (currentPath) {
    case "/admin-dashboard":
      document.title = 'Admin | Sari-Sari Events';
      title = 'Admin Dashboard';
      break;
    default:
      document.title = 'Sari-Sari Events';
      title = <h1>404 - Page Not Found</h1>;
  }

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white z-50 px-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsOpen(true)} className="text-2xl text-gray-700">
            <FiMenu />
          </button>
          <p className="font-outfit text-lg">{title}</p>
        </div>
        {isLoggedIn ? (
          userProfile ? (
            <img src={userProfile} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <CgProfile className="text-4xl text-gray-600" />
          )
        ) : (
          <CgProfile className="text-4xl text-gray-600" />
        )}
      </div>

      {/* Mobile Popup Navigation */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-[80%] h-screen bg-black bg-opacity-40 z-60 flex justify-center items-center md:hidden">
          <div className="bg-white w-full h-full rounded-xl shadow-lg p-6 relative overflow-y-auto">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-xl text-gray-700">
              <FiX />
            </button>

            <div className="mb-6 text-center mt-4">
              <img src="/sariLogo.png" alt="Logo" className="h-10 mx-auto" />
            </div>

            <div className="flex flex-col items-center justify-center">
                     <ul className="w-full text-center bg-white text-gray-800 flex flex-col items-start">
                       <Link to='/admin-dashboard' className={`${title === 'Dashboard Overview' && `bg-[#009494]`} w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}>
                         <p className={`${title === 'Dashboard Overview' && `bg-[#EEEEEE]`} py-3 ml-5 pl-3 font-outfit`}>Dashboard</p>
                       </Link>
                       <Link to='/#' className={`${title === ' Pag-iisipan pa daw' && `bg-[#5BD4D4]`} w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}>
                         <p className={`${title === ' Pag-iisipan pa daw' && `bg-[#EEEEEE]`} py-3 ml-5 pl-3 font-outfit`}>My Shedules</p>
                       </Link>
                       <Link to='/#' className={`${title === ' Pag-iisipan pa daw' && `bg-[#FF965D  ]`} w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}>
                         <p className={`${title === ' Pag-iisipan pa daw' && `bg-[#EEEEEE]`} py-3 ml-5 pl-3 font-outfit`}>My Tickets</p>
                       </Link>
                       <Link to='/#' className={`${title === 'Pag iisipan pa daw' && `bg-[#EF4B4C]`} w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}>
                         <p className={`${title === 'Pag-iisipan pa daw' && `bg-[#EEEEEE]`} py-3 ml-5 pl-3 font-outfit`}>Manage Account</p>
                       </Link>
                     </ul>
                   </div>
       
                   <hr className="my-5 border-gray-300" />

            <div className="flex flex-col mt-10 gap-3 pl-4 text-secondary">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => console.log("Back to home")}> 
                <IoIosArrowBack className="text-xl" />
                <span className="text-sm font-outfit">Back</span>
              </div>
              <button className="flex items-center gap-2 hover:underline font-outfit" onClick={logout}>
                <IoExitOutline className="text-xl transform -scale-x-100" />
                <span className="text-sm">Log out</span>
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
              <div className="flex flex-col items-center justify-center w-full bg-gray-200 text-base">
                <ul className="w-full text-center bg-white text-gray-800 font-outfit flex flex-col items-start">
                  <Link
                    to="/admin-dashboard"
                    className={`${title === 'Overview' ? 'bg-[#009494]' : ''
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
                    to="/#"
                    className={`${title === 'Pag-iisipan pa daw' ? 'bg-[#5BD4D4]' : ''
                      } w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}
                  >
                    <p
                      className={`${title === ' Pag-iisipan pa daw' ? 'bg-[#EEEEEE]' : ''
                        } py-3 ml-5 pl-3 font-outfit`}
                    >
                       Pag-iisipan pa daw
                    </p>
                  </Link>
      
                  <Link
                    to="/#"
                    className={`${title === ' Pag-iisipan pa daw' ? 'bg-[#FF965D]' : ''
                      } w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}
                  >
                    <p
                      className={`${title === ' Pag-iisipan pa daw' ? 'bg-[#EEEEEE]' : ''
                        } py-3 ml-5 pl-3 font-outfit`}
                    >
                       Pag-iisipan pa daw
                    </p>
                  </Link>
      
                  <Link
                    to="/#"
                    className={`${title === 'Pag-iisipan pa daw' ? 'bg-[#EF4B4C]' : ''
                      } w-full text-start cursor-pointer hover:text-teal-600 transition-colors`}
                  >
                    <p
                      className={`${title === 'Pag-iisipan pa daw' ? 'bg-[#EEEEEE]' : ''
                        } py-3 ml-5 pl-3 font-outfit`}
                    >
                      Pag-iisipan pa daw
                    </p>
                  </Link>
                </ul>
              </div>
              
                <hr className="my-2 border-gray-300" />

        <div className="flex flex-col gap-2 text-left text-secondary">
          <div className="flex items-center gap-2 mb-24 cursor-pointer" onClick={() => console.log("Back to home")}> 
            <IoIosArrowBack className="text-xl" />
            <span className="text-sm font-outfit">Back</span>
          </div>
          <button className="flex items-center gap-2 hover:underline font-outfit mb-7" onClick={logout}>
            <IoExitOutline className="text-xl transform -scale-x-100" />
            <span className="text-sm">Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminNav;