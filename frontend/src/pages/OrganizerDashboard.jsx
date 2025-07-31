import React from 'react';
import Sidebar from '../components/OrganizerNav'; // Your sidebar component
import { CgProfile } from 'react-icons/cg';
import { TbMessageChatbotFilled } from "react-icons/tb";
import { IoIosAdd } from "react-icons/io";  

function OrganizerDashboard() {
  return (
    <div className="flex h-screen bg-primary font-outfit text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto font-oufit">
        {/* Header */}
        <header className="flex justify-between items-center bg-white rounded-xl p-6 mb-6 shadow">
  {/* Left Centered Content */}
  <div className="flex flex-col items-center mx-auto space-y-1">
    <span className="text-2xl text-secondary font-outfit">
      Good Morning, <span className="font-semibold">Lester James</span>
    </span>
    <p className="text-gray-500 text-sm">Here's what's happening with your events today.</p>    
  </div>

  {/* Right-Aligned Profile Icon */}
  <div className="flex items-center justify-center p-2 rounded-full text-gray-600 font-outfit">
    <CgProfile className="text-5xl" />
  </div>
</header>


        {/* Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center text-center h-32 font-outfit">
            <h3 className="text-base font-medium text-gray-700">Total Revenue</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center text-center h-32 font-outfit">
            <h3 className="text-base font-medium text-gray-700">Total Attendees</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center text-center h-32 font-outfit">
            <h3 className="text-base font-medium text-gray-700">Total Events Created</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center text-center h-32 font-outfit">
            <h3 className="text-base font-medium text-gray-700">Upcoming Events</h3>
          </div>
        </div>

        {/* Recent Events Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 font-outfit">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">All Events</h3>
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center transition">
                <IoIosAdd className="text-white text-2xl mr-2" />
              Create Event
            </button>
          </div>
          <p className="text-gray-500 ">No recent events to display.</p>
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-10 right-10 text-white p-4">
          <TbMessageChatbotFilled className="text-secondary text-5xl transform -scale-x-100" />

        </button>
      </main>
    </div>
  );
}

export default OrganizerDashboard;