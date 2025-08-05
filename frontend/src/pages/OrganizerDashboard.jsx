import React from 'react';
import OrganizerNav from '../components/OrganizerNav';
import { CgProfile } from 'react-icons/cg';
import { TbMessageChatbotFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';

function OrganizerDashboard() {
  const {isLoggedIn, userRole, userEmail, userFirstName, userProfile, logout } = useAuth();
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-primary font-outfit text-gray-800 overflow-hidden">
      {/* Organizer Navigation - visible on all screen sizes */}
      <OrganizerNav />

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 mt-16 md:mt-0 md:ml-64 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center bg-white rounded-xl p-4 mb-6 shadow">
          <div className="w-full flex flex-col items-center text-center">
            <h2 className="text-lg sm:text-2xl text-secondary font-outfit">
              Good Morning, <span className="font-semibold">{userFirstName}</span>              
            </h2>

            <p className="text-sm text-gray-500">
              Here's what's happening with your events today.
            </p>
          </div>

          {isLoggedIn ? (
            <>
            {userProfile && <img src={userProfile} alt="User Profile" className="h-8 w-8 lg:w-10 lg:h-10 hidden md:flex aspect-square rounded-full object-cover" />}
            </>
          ) : (
            <CgProfile className='hidden md:flex text-[2rem]' />
          )}                    
        </header>

        {/* Statistic Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {["Total Revenue", "Total Attendees", "Total Events Created", "Upcoming Events"].map((label, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center text-center h-28"
            >
              <h3 className="text-base font-medium text-gray-700">{label}</h3>
            </div>
          ))}
        </div>

        {/* Recent Events */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-6 font-outfit">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h3 className="text-lg font-semibold">Recent Events</h3>
            <Link to="/create-event">
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center">
                Create
              </button>
            </Link>
          </div>
          {/* Event Placeholder */}
          <div className="flex flex-col gap-4 font-outfit">
            <div className="border p-10 rounded-lg flex justify-between items-center text-gray-400">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-teal-500 rounded-full" />
                <div>
                  <p className="font-medium">Tuli ni juswa vergara</p>
                  <p className="text-sm text-gray-500">August 5, 2025 <br/> • 250 Attendees</p>
                </div>
              </div>
            </div>

            {/* Placeholder box */}
            <div className="border p-10 rounded-lg h-20 flex items-center justify-center text-gray-400 font-outfit">
              <span>No upcoming events</span>
            </div>
          </div>
        </section>

        {/* Floating Chat Button */}
        <button
          className="fixed bottom-6 right-6 rounded-full p-3 z-50" >
          <TbMessageChatbotFilled className="text-secondary text-6xl transform -scale-x-100" />
        </button>
      </main>
    </div>
  );
}

export default OrganizerDashboard;
