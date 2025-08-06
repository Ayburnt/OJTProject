import React, { useState } from 'react';
import { IoPeopleOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { GoDownload } from "react-icons/go";
import AttendeesNav from '../components/AttendeesNav'; 

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
<main className="flex-1 w-[95%] pt-8 px-4 md:px-6 pb-8 mx-2 lg:pl-72 lg:mx-6 mt-5 md:mt-0 flex items-center justify-center">

        <section className="w-full max-w-7xl">
          {/* Welcome Message */}
          <section className="py-3 text-center">
            <p className="text-gray-500 text-2xl">
              Good Morning, <span className="text-secondary font-outfit font-semibold">Lester James</span>
            </p>
            <p className="text-xl text-gray-400">
              Here’s what’s happening on your end today.
            </p>
          </section>

          {/* Stat Cards */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            {['Total Tickets', 'Confirmed', 'Pending', 'Canceled'].map((label) => (
              <div key={label} className="bg-white rounded-lg shadow-sm p-4 text-center">
                <p className="text-lg font-outfit text-gray-500">{label}</p>
                <p className="font-semibold font-outfit text-xl mt-1">--</p>
              </div>
            ))}
          </section>

          {/* Tabs */}
          <section className="mb-2 flex flex-wrap justify-center md:justify-start gap-4 text-lg font-outfit font-medium">

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


        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-7">
  {/* Card 1 */}
  <div className="bg-white rounded-lg shadow p-6 space-y-4">
    <div className="flex items-center gap-2">
      <span className="text-orange-500 bg-orange-100 text-sm font-outfit font-semibold px-2 py-0.5 rounded-full">
        Pending
      </span>
    </div>
    <h3 className="font-semibold font-outfit text-lg leading-snug">
      Tuli ni Jaswa: An Entertainment Visualization
    </h3>
    <div className="text-gray-500 text-sm font-outfit space-y-2">
      <p>12 Dec, 12:45PM - 4PM</p>
      <div className="flex items-center gap-1">
        <FaLocationDot className="text-gray-400 text-base" />
        <span>SMX Pasay Manila</span>
      </div>
    </div>
    <div className="text-sm font-outfit text-gray-500">
      <div className="flex items-center gap-1 pb-2">
        <IoPeopleOutline className="text-gray-400 text-base" />
        <span>100,000+ Attendees</span>
      </div>
      <div className="border-t pt-2 space-y-3">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-400">Ticket ID</p>
          <span className="text-black">7EM1NQP</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-400 font-outfit text-sm">Price</p>
          <p className="font-semibold text-black text-sm">₱200.00</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button className="px-6 py-2 text-white text-base font-outfit rounded-md flex-grow bg-secondary">
            View Info
          </button>
          <div className="w-[40px] flex justify-center items-center bg-grey rounded-md">
            <GoDownload className="text-3xl text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Card 2 */}
  <div className="bg-white rounded-lg shadow p-6 space-y-4">
    <div className="flex items-center gap-2">
      <span className="text-green-600 bg-green-100 text-sm font-outfit font-semibold px-2 py-0.5 rounded-full">
        Confirmed
      </span>
    </div>
    <h3 className="font-semibold font-outfit text-lg leading-snug">
      Tuli ni Jaswa: An Entertainment Visualization
    </h3>
    <div className="text-gray-500 text-sm font-outfit space-y-2">
      <p>15 Jan, 6PM - 10PM</p>
      <div className="flex items-center gap-1">
        <FaLocationDot className="text-gray-400 text-base" />
        <span>MOA Arena, Pasay</span>
      </div>
    </div>
    <div className="text-sm font-outfit text-gray-500">
      <div className="flex items-center gap-1 pb-2">
        <IoPeopleOutline className="text-gray-400 text-base" />
        <span>5,000+ Attendees</span>
      </div>
      <div className="border-t pt-2 space-y-3">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-400">Ticket ID</p>
          <span className="text-black">J9K3XZP</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-400 font-outfit text-sm">Price</p>
          <p className="font-semibold text-black text-sm">₱750.00</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button className="px-6 py-2 text-white text-base font-outfit rounded-md flex-grow bg-secondary">
            View Info
          </button>
          <div className="w-[40px] flex justify-center items-center bg-grey rounded-md">
            <GoDownload className="text-3xl text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Card 3 */}
  <div className="bg-white rounded-lg shadow p-6 space-y-4">
    <div className="flex items-center gap-2">
      <span className="text-blue-600 bg-blue-100 text-sm font-outfit font-semibold px-2 py-0.5 rounded-full">
        Upcoming
      </span>
    </div>
    <h3 className="font-semibold font-outfit text-lg leading-snug">
      Tuli ni Jaswa: An Entertainment Visualization
    </h3>
    <div className="text-gray-500 text-sm font-outfit space-y-2">
      <p>22 Feb, 9AM - 5PM</p>
      <div className="flex items-center gap-1">
        <FaLocationDot className="text-gray-400 text-base" />
        <span>Philippine Convention Center</span>
      </div>
    </div>
    <div className="text-sm font-outfit text-gray-500">
      <div className="flex items-center gap-1 pb-2">
        <IoPeopleOutline className="text-gray-400 text-base" />
        <span>2,000+ Attendees</span>
      </div>
      <div className="border-t pt-2 space-y-3">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-400">Ticket ID</p>
          <span className="text-black">XJ4P1LK</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-400 font-outfit text-sm">Price</p>
          <p className="font-semibold text-black text-sm">₱1,200.00</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button className="px-6 py-2 text-white text-base font-outfit rounded-md flex-grow bg-secondary">
            View Info
          </button>
          <div className="w-[40px] flex justify-center items-center bg-grey rounded-md">
            <GoDownload className="text-3xl text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

        </section>
      </main>
    </div>
  );
};

export default AttendeesDashboard;
