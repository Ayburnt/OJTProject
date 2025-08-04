import React, { useState } from 'react';
import { IoPeopleOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import AttendeesNav from '../components/AttendeesNav';
import Attendees from './Attendees';

const AttendeesDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');

  const ticketCounts = {
    all: 23,
    confirmed: 0,
    pending: 0
  };

  return (
    <div className="min-h-screen bg-gray-100 text-sm font-outfit flex flex-col">
      <AttendeesNav />

      {/* === Main Content === */}
      <main
        className="
          flex-1 w-full pt-8 px-4 md:px-8 pb-8
          lg:pl-72  /* Push content to the right on large screens (sidebar width) */
        "
      >
        <section className="py-3 text-center">
          <p className="text-gray-500 text-2xl">
            Good Morning, <span className="text-secondary font-outfit font-semibold">Lester James</span>
          </p>
          <p className="text-xl text-gray-400">
            Here’s what’s happening on your end today.
          </p>
        </section>

        {/* Stat Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {['Total Tickets', 'Confirmed', 'Pending', 'Canceled'].map((label) => (
            <div key={label} className="bg-white rounded-lg shadow-sm p-4 text-center">
              <p className="text-lg font-outfit text-gray-500">{label}</p>
              <p className="font-semibold font-outfit text-xl mt-1">--</p>
            </div>
          ))}
        </section>

        {/* Tabs */}
        <section className="mb-2 flex flex-wrap gap-4 text-lg font-outfit font-medium">
          {['all', 'confirmed', 'pending'].map((tab) => (
            <button
              key={tab}
              className={`flex items-center ${
                activeTab === tab
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-gray-500'
              } pb-1`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-secondary text-white font-outfit ">
                {ticketCounts[tab]}
              </span>
            </button>
          ))}
        </section>

        {/* Ticket Card */}
     <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Card 1 */}
  <div className="bg-white rounded-lg shadow p-4 space-y-3">
    <div className="flex items-center gap-2">
      <span className="text-orange-500 bg-orange-100 text-[15px] font-outfit font-semibold px-2 py-0.5 rounded-full">
        Pending
      </span>
    </div>
    <h3 className="font-semibold font-outfit text-lg">
      Tuli ni Jaswa: An Entertainment Visualization
    </h3>
    <div className="text-gray-500 text-sm font-outfit">
      <p>12 Dec, 12:45PM - 4PM</p>
      <div className="flex items-center gap-1 mt-0.5">
        <FaLocationDot className="text-gray-400 text-base" />
        <span>SMX Pasay Manila</span>
      </div>
    </div>
    <div className="pt-2 text-sm font-outfit text-gray-500">
      <div className="flex items-center gap-2 pb-2">
        <IoPeopleOutline className="text-gray-400 text-base" />
        <span>100,000+ Attendees</span>
      </div>
      <div className="border-t font-outfit"></div>
      <div className="flex justify-between items-center pt-2">
        <p className="font-semibold text-gray-400">Ticket ID</p>
        <span className="text-black">7EM1NQP</span>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row justify-between items-center pt-3 gap-2">
      <div>
        <p className="text-gray-400 font-outfit text-sm">Price</p>
        <p className="font-semibold text-black text-sm">₱200.00</p>
      </div>
      <button
        className="px-4 py-1.5 text-white text-sm font-outfit rounded-md w-full sm:w-auto"
        style={{ backgroundColor: '#009494' }}
      >
        View Info
      </button>
    </div>
  </div>

  {/* Card 2 */}
  <div className="bg-white rounded-lg shadow p-4 space-y-6">
    {/* You can duplicate or customize this card */}
    <div className="flex items-center gap-2">
      <span className="text-green-500 bg-green-100 text-[15px] font-outfit font-semibold px-2 py-0.5 rounded-full">
        Confirmed
      </span>
    </div>
    <h3 className="font-semibold font-outfit text-lg">
      Another Event Title
    </h3>
    <div className="text-gray-500 font-outfit text-sm">
      <p>15 Dec, 1:00PM - 5PM</p>
      <div className="flex items-center gap-1 mt-0.5">
        <FaLocationDot className="text-gray-400 text-sm font-outfit" />
        <span>MOA Arena</span>
      </div>
    </div>
    <div className=" pt-2 text-sm font-outfit text-gray-500">
      <div className="flex items-center gap-2 pb-2">
        <IoPeopleOutline className="text-gray-400 text-base" />
        <span>20,000+ Attendees</span>
      </div>
      <div className="border-t"></div>
      <div className="flex justify-between items-center pt-2">
        <p className="font-semibold text-gray-400">Ticket ID</p>
        <span className="text-black">ABC1234</span>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row justify-between items-center pt-3 gap-2">
      <div>
        <p className="text-gray-400 font-outfit text-sm">Price</p>
        <p className="font-semibold font-outfit text-black text-sm">₱500.00</p>
      </div>
      <button
        className="px-4 py-1.5 text-white text-sm font-outfit rounded-md w-full sm:w-auto"
        style={{ backgroundColor: '#009494' }}
      >
        View Info
      </button>
    </div>
  </div>

  {/* Card 3 */}
  <div className="bg-white rounded-lg shadow p-4 space-y-3">
    {/* Customize as needed */}
    <div className="flex items-center gap-2">
      <span className="text-red-500 bg-red-100 text-[15px] font-semibold px-2 py-0.5 rounded-full">
        Cancelled
      </span>
    </div>
    <h3 className="font-semibold font-outfit text-lg">
      Another Event
    </h3>
    <div className="text-gray-500 text-sm font-outfit">
      <p>20 Dec, 10AM - 2PM</p>
      <div className="flex items-center gap-1 mt-0.5">
        <FaLocationDot className="text-gray-400 text-sm font-outfit" />
        <span>Araneta Coliseum</span>
      </div>
    </div>
    <div className="pt-2 text-sm text-gray-500">
      <div className="flex items-center gap-2 pb-2">
        <IoPeopleOutline className="text-gray-400 text-sm font-outfit" />
        <span>50,000+ Attendees</span>
      </div>
      <div className="border-t"></div>
      <div className="flex justify-between items-center pt-2">
        <p className="font-semibold font-outfit text-gray-400">Ticket ID</p>
        <span className="text-black">XYZ9876</span>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row justify-between items-center pt-3 gap-2">
      <div>
        <p className="text-gray-400 text-sm font-outfit">Price</p>
        <p className="font-semibold text-black text-sm font-outfit">₱300.00</p>
      </div>
      <button
        className="px-4 py-1.5 text-white text-sm font-outfit rounded-md w-full sm:w-auto"
        style={{ backgroundColor: '#009494' }}
      >
        View Info
      </button>
    </div>
  </div>
</section>

      </main>
    </div>
  );
};

export default AttendeesDashboard;
