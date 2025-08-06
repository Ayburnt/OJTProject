import React from "react";
import { FaHome, FaSignOutAlt, FaUser, FaCalendarAlt, FaCog } from "react-icons/fa";
import AdminNav from "../components/AdminNav";
import { CgProfile } from 'react-icons/cg';

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-alice-blue flex flex-col md:flex-row font-outfit">
      {/* Sidebar */}
      <AdminNav />
      {/* Main Content */}
   <main className="p-1 md:w-full md:w-4/5 md:mx-5 mt-10 md:mt-0 ml-8 mr-8 md:ml-0 md:mr-0">

        <div className="flex justify-end mb-1 mt-10">
         <CgProfile className="hidden md:flex text-[2.5rem] text-gray-300 mr-10" />
          </div>

        <div className="mb-8 text-center md:text-center lg:pl-35">
          <h2 className="text-xl font-medium text-gray-700">
            Good Morning, <span className="text-teal-600 font-bold">Lester James</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your events today.
          </p>
        </div>

        <div className="flex flex-col-reverse md:flex-row md:space-x-6 md:ml-70">
          {/* Left side - Recent Events */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex flex-wrap space-x-4 mb-6 text-sm justify-center md:justify-start">
              <div className="text-teal-600 font-semibold cursor-pointer">
                All Events
                <span className="bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full ml-1">6</span>
              </div>
              <div className="text-gray-500 cursor-pointer">
                Ongoing
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-1">3</span>
              </div>
              <div className="text-gray-500 cursor-pointer">
                Upcoming
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-1">3</span>
              </div>
              <div className="text-gray-500 cursor-pointer">
                Canceled
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-1">3</span>
              </div>
            </div>

<div className="bg-white p-4 mb-6 w-full md:max-w-2xl pb-30">
  <h3 className="text-md font-semibold mb-4">Recent Events</h3>
  <div className="p-1 rounded bg-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-semibold text-gray-800">Tuli ni Josh: Kids Party</h4>
        <p className="text-sm text-gray-600">2000 Attendees</p>
        <p className="text-sm text-gray-600">Sep 12, 2025</p>
        <p className="text-sm text-gray-600">SMX Convention Center</p>
      </div>
      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Ongoing</span>
    </div>
    <p className="text-xs text-right text-gray-400 mt-2">Tech Corp.</p>
  </div>
</div>
</div>
          
          {/* Right side - Stats Cards */}
             <div className="w-full md:w-[350px] mr-5 space-y-2 mb-6 md:mb-0">
            <div className="bg-white shadow p-4 rounded">
              <div className="flex items-center justify-between">
                <FaCalendarAlt className="text-teal-600 mr-4" />
                <p className="text-sm text-gray-500 flex-1 text-center border-r border-gray-300 pr-2">Total Overall Events</p>
                <p className="text-xl font-bold text-gray-700 pl-2">2,000</p>
              </div>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <div className="flex items-center justify-between">
                <FaUser className="text-teal-600 mr-4" />
                <p className="text-sm text-gray-500 flex-1 text-center border-r border-gray-300 pr-2">Active Users</p>
                <p className="text-xl font-bold text-gray-700 pl-2">203</p>
              </div>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <div className="flex items-center justify-between">
                <FaHome className="text-teal-600 mr-4" />
                <p className="text-sm text-gray-500 flex-1 text-center border-r border-gray-300 pr-2">Total Revenue</p>
                <p className="text-xl font-bold text-gray-700 pl-2">₱2,000,000</p>
              </div>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <div className="flex items-center justify-between">
                <FaCog className="text-teal-600 mr-4" />
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
