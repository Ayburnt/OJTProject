import React from 'react';
import OrganizerNav from '../components/OrganizerNav';

const OrganizerEvent = () => {
  const events = [
    {
      name: 'Event Name',
      date: 'Date',
      location: 'Location',
      attendees: 'Attendees',
      price: 'Price',
      status: 'Status',
    },
    {
      name: 'Event Name',
      date: 'Date',
      location: 'Location',
      attendees: 'Attendees',
      price: 'Price',
      status: 'Status',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <OrganizerNav />

      {/* Content Container */}
      <div className="pt-20 md:ml-64 p-4 md:p-8 lg:p-12">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light font-outfit text-gray-800">
            My Events
          </h1>
        </div>

        {/* Search & Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Search bar */}
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row gap-55 w-full md:w-auto">
           <button className="px-6 py-2 bg-secondary text-white rounded-full hover:bg-secondary/80 font-outfit shadow">
                All Events
                </button>

            <button className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/80 font-outfit shadow">
              Create Event
            </button>
          </div>
        </div>

        {/* Event Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-8 gap-4 p-4 text-sm font-semibold font-outfit text-gray-700 bg-gray-50 border-b">
              <div className="col-span-2">Event Name</div>
              <div>Date</div>
              <div>Location</div>
              <div>Attendees</div>
              <div>Price</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {/* Rows */}
            {events.map((event, i) => (
              <div
                key={i}
                className={`grid grid-cols-8 gap-4 p-4 text-sm text-gray-600 border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="col-span-2 font-medium">{event.name}</div>
                <div>{event.date}</div>
                <div>{event.location}</div>
                <div>{event.attendees}</div>
                <div>{event.price}</div>
                <div>{event.status}</div>
                <div className="flex space-x-3">
                  <a href="#" className="text-teal-500 font-medium hover:underline">Edit</a>
                  <a href="#" className="text-red-500 font-medium hover:underline">Delete</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerEvent;
