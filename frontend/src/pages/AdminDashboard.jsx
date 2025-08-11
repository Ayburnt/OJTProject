import { useState } from 'react';
import { FaCalendarAlt } from "react-icons/fa";
import AdminNav from "../components/AdminNav";
import { CgProfile } from 'react-icons/cg';
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { FaUserGroup } from "react-icons/fa6";
import { LuPhilippinePeso } from "react-icons/lu";
import { FaClock } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import useAuth from '../hooks/useAuth'; // ✅ Import your auth hook

function AdminDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const { isLoggedIn, userEmail } = useAuth(); // ✅ Get email from auth

  // ✅ Get only the part before @
  const displayName = userEmail ? userEmail.split('@')[0] : "Guest";

  return (
    <div className="min-h-screen bg-alice-blue flex flex-col md:flex-row font-outfit">
      {/* Sidebar */}
      <AdminNav />

      {/* Main Content */}
      <main className="p-1 md:w-full md:w-4/5 md:mx-5 mt-10 md:mt-0 ml-8 mr-8 md:ml-6 md:mr-6 font-outfit">

        <div className="flex justify-end mb-1 mt-10">
          {isLoggedIn && (
            <CgProfile className="hidden md:flex text-[2.5rem] text-gray-400 mr-10" />
          )}
        </div>

        <div className="mb-8 text-center md:text-center lg:pl-35 mb-12">
          <h2 className="text-3xl font-medium text-gray-700">
            Good Morning,{" "}
            <span className="text-teal-600 font-bold">{displayName}</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your events today.
          </p>
        </div>
        <div className="flex flex-col-reverse md:flex-row md:gap-x-10 md:ml-70">
          {/* Left side - Recent Events */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="w-full md:max-w-3xl mx-auto mb-4">
              <div className="flex flex-row gap-1.5 items-center overflow-x-auto hide-scrollbar text-[16px]">
                <button
                  onClick={() => setSelectedCategory('All Events')}
                  className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit cursor-pointer flex items-center gap-1.5"
                >
                  All Events
                  <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white group-active:bg-secondary group-active:text-white group-focus:bg-secondary group-focus:text-white font-semibold px-2 py-0.5 rounded-full text-[13px] transition-colors">
                    6
                  </span>
                </button>
                <button
                  onClick={() => setSelectedCategory('Ongoing')}
                  className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit cursor-pointer flex items-center gap-1.5"
                >
                  Ongoing
                  <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white group-active:bg-secondary group-active:text-white group-focus:bg-secondary group-focus:text-white font-semibold px-2 py-0.5 rounded-full text-[13px] transition-colors">
                    3
                  </span>
                </button>
                <button
                  onClick={() => setSelectedCategory('Upcoming')}
                  className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit cursor-pointer flex items-center gap-1.5"
                >
                  Upcoming
                  <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white group-active:bg-secondary group-active:text-white group-focus:bg-secondary group-focus:text-white font-semibold px-2 py-0.5 rounded-full text-[13px] transition-colors">
                    3
                  </span>
                </button>
                <button
                  onClick={() => setSelectedCategory('Canceled')}
                  className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit cursor-pointer flex items-center gap-1.5"
                >
                  Canceled
                  <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white group-active:bg-secondary group-active:text-white group-focus:bg-secondary group-focus:text-white font-semibold px-2 py-0.5 rounded-full text-[13px] transition-colors">
                    3
                  </span>
                </button>
              </div>
            </div>



            <div className="bg-white p-6 mb-6 w-full md:max-w-3xl rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Events</h3>
              {/* Event Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 shadow-sm">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4 mt-3">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <h4 className="text-lg font-semibold text-gray-800">Tuli ni Josh: Kids Party</h4>
                    <span className="hidden md:inline-block text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full w-max">
                      Pending
                    </span>
                  </div>

                  {/* this is website view Buttons hidden in the mobile view*/}
                  <div className="hidden md:flex flex-col sm:flex-row gap-2 md:w-auto">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 text-sm rounded-md flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer">
                      <FaCheck /> Approve
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded-md flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer">
                      <RxCross2 /> Reject
                    </button>
                  </div>
                </div>


                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 text-[10px] sm:text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-secondary text-[12px] sm:text-base" />
                    <span>Sep 12, 2025, 10:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <IoLocationOutline className="text-secondary text-[12px] sm:text-base" />
                      <span>SMX Convention Center</span>
                    </div>
                  </div>


                  <div className="flex items-center justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <FaUserGroup className="text-secondary text-[12px] sm:text-base" />
                      <span>2000 Attendees</span>
                    </div>
                  </div>
                </div>


                {/* Organizer Info */}
                <div className="flex flex-col sm:flex-row sm:justify-between mt-5 sm:items-center gap-3 text-[7px] sm:text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-start justify-between w-full gap-2">
                    <div className="flex items-start gap-2">
                      <CgProfile className="text-xl sm:text-2xl text-gray-500" />
                      <div>
                        <p>
                          Organized by: <span className="font-medium text-gray-700">Tech Corp.</span>
                        </p>
                        <p>Submitted June 18, 2025, 12:30 PM</p>
                      </div>
                    </div>

                    {/* View button placed beside organizer text on mobile */}
                    <button className="flex items-center gap-1 text-[10px] sm:text-sm text-teal-600 font-medium self-start cursor-pointer">
                      View <IoEyeSharp className="text-lg sm:text-base md:text-xl mr-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Stats Cards */}
          <div className="w-full md:w-[350px] mr-10 space-y-2 mb-6 md:mb-0 space-y-4">
            <div className="bg-white shadow p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <FaCalendarAlt className="text-teal-600 mr-4 text-xl" />
                <p className="text-sm text-gray-500 flex-1 text-center border-r border-gray-300 pr-2">Total Overall Events</p>
                <p className="text-xl font-bold text-gray-700 pl-2">2,00000</p>
              </div>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <div className="flex items-center justify-between">
                <FaUserGroup className="text-teal-600 mr-4 text-xl" />
                <p className="text-sm text-gray-500 flex-1 text-center border-r border-gray-300 pr-2">Active Users</p>
                <p className="text-xl font-bold text-gray-700 pl-2">203</p>
              </div>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <div className="flex items-center justify-between">
                <LuPhilippinePeso className="text-teal-600 mr-4 text-xl" />
                <p className="text-sm text-gray-500 flex-1 text-center border-r border-gray-300 pr-2">Total Revenue</p>
                <p className="text-xl font-bold text-gray-700 pl-2">₱2,000,000</p>
              </div>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <div className="flex items-center justify-between">
                <FaClock className="text-teal-600 mr-4 text-xl" />
                <p className="text-sm text-gray-500 flex-1 text-center border-r border-gray-300 pr-2">Pending Approvals</p>
                <p className="text-xl font-bold text-gray-700 pl-2">2</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



export default AdminDashboard;
