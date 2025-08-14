import { useState } from 'react';
import { FaCalendarAlt } from "react-icons/fa";
import AdminNav from "../components/AdminNav";
import { CgProfile } from 'react-icons/cg';
import { FaCheck, FaUserGroup, FaClock } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { LuPhilippinePeso } from "react-icons/lu";
import { IoEyeSharp, IoLocationOutline } from "react-icons/io5";
import useAuth from '../hooks/useAuth';

function AdminDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const { isLoggedIn, userEmail } = useAuth();
  const displayName = userEmail ? userEmail.split('@')[0] : "Organizer";

  return (
    <div className="h-screen bg-aliceblue font-outfit grid grid-cols-1 md:grid-cols-6 xl:grid-cols-9">
      <AdminNav />

     <main className="font-outfit overflow-y-scroll col-span-6 md:col-span-4 xl:col-span-7 flex flex-col items-center mx-4 lg:mx-8 mt-10 lg:mt-0">

        {/* Profile Icon */}
        <div className="flex justify-end w-full mt-10 mb-1 pr-10">
          {isLoggedIn && (
            <CgProfile className="hidden md:flex text-[2.5rem] text-gray-400" />
          )}
        </div>

        {/* Greeting */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-medium text-gray-700">
            Good Morning,{" "}
            <span className="text-teal-600 font-bold">{displayName}</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your events today.
          </p>
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 w-full max-w-[1400px] mx-auto px-4">
          
          {/* Left Section - Recent Events */}
          <div className="flex-1 lg:w-[70%] space-y-4">
            
            {/* Tabs */}
            <div className="w-full md:max-w-3xl mx-auto mb-4">
              <div className="flex flex-row gap-1.5 items-center overflow-x-auto hide-scrollbar text-[16px]">
                <button
                  onClick={() => setSelectedCategory('All Events')}
                  className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit cursor-pointer flex items-center gap-1.5"
                >
                  All Events
                  <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white group-active:bg-secondary group-active:text-white group-focus:bg-secondary group-focus:text-white font-semibold px-2 py-0.5 rounded-md text-[13px] transition-colors">
                    6
                  </span>
                </button>
                <button
                  onClick={() => setSelectedCategory('Ongoing')}
                  className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit cursor-pointer flex items-center gap-1.5"
                >
                  Ongoing
                  <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white group-active:bg-secondary group-active:text-white group-focus:bg-secondary group-focus:text-white font-semibold px-2 py-0.5 rounded-md text-[13px] transition-colors">
                    3
                  </span>
                </button>
                <button
                  onClick={() => setSelectedCategory('Upcoming')}
                  className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit cursor-pointer flex items-center gap-1.5"
                >
                  Upcoming
                  <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white group-active:bg-secondary group-active:text-white group-focus:bg-secondary group-focus:text-white font-semibold px-2 py-0.5 rounded-md text-[13px] transition-colors">
                    3
                  </span>
                </button>
                <button
                  onClick={() => setSelectedCategory('Canceled')}
                  className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit cursor-pointer flex items-center gap-1.5"
                >
                  Canceled
                  <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white group-active:bg-secondary group-active:text-white group-focus:bg-secondary group-focus:text-white font-semibold px-2 py-0.5 rounded-md text-[13px] transition-colors">
                    3
                  </span>
                </button>
              </div>
            </div>

            {/* Event Card */}
            <div className="bg-white p-6 rounded-xl shadow-md lg:text-sm">
              <h3 className="text-xl font-bold mb-4">Events</h3>

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4 mt-3">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <h4 className="text-lg font-semibold text-gray-800 lg:text-sm">Tuli ni Josh: Kids Party</h4>
                    <span className="hidden md:inline-block text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full w-max">
                      Pending
                    </span>
                  </div>
                  {/* Action Buttons */}
                  <div className="hidden sm:flex flex-row gap-2">
                    <button className="bg-teal-600 hover:bg-teal-700 p-2 rounded-md flex items-center justify-center">
                      <FaCheck className="text-white text-md" />
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 p-2 rounded-md flex items-center justify-center">
                      <RxCross2 className="text-white text-md" />
                    </button>
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex flex-wrap gap-2 text-[10px] sm:text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-secondary text-[12px] sm:text-base" />
                    <span>Sep 12, 2025, 10:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoLocationOutline className="text-secondary text-[12px] sm:text-base" />
                    <span>SMX Convention Center</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserGroup className="text-secondary text-[12px] sm:text-base" />
                    <span>2000 Attendees</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between mt-5 items-center text-[7px] sm:text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <CgProfile className="hidden md:flex text-[2.5rem] text-gray-400" />
                    <div>
                      <p>Organized by: <span className="font-medium text-gray-700">Tech Corp.</span></p>
                      <p>Submitted June 18, 2025, 12:30 PM</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-teal-600 font-medium">
                    View <IoEyeSharp className="text-lg sm:text-base md:text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Stats */}
          <div className="w-full lg:w-[30%] flex-shrink-0 lg:mr-10 space-y-4">
            {[
              { icon: FaCalendarAlt, label: "Total Overall Events", value: "200,000" },
              { icon: FaUserGroup, label: "Active Users", value: "203" },
              { icon: LuPhilippinePeso, label: "Total Revenue", value: "₱2,000,000" },
              { icon: FaClock, label: "Pending Approvals", value: "2" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white shadow p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <stat.icon className="text-teal-600 mr-4 text-xl" />
                  <p className="text-xs sm:text-sm text-gray-500 flex-1 text-center border-r border-gray-300 pr-2">
                    {stat.label}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-700 pl-2">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
