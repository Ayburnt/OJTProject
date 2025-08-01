import React from 'react';
import OrganizerNav from '../components/OrganizerNav';

const OrganizerEvent = () => {
  // Mock data for the event list
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
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <OrganizerNav />
      {/* Sidebar - A simple placeholder to match the image */}
      <div className="w-16 bg-gray-100 flex flex-col justify-between items-center py-6">
        {/* Placeholder for other sidebar items */}
      </div>
      {/* Main content area */}
      <div className="flex-1 p-8 md:p-12 lg:p-16">
        {/* Header section */}
        <div className="flex justify-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light font-outfit text-gray-800">
            My Event
          </h1>
        </div>

        {/* Controls and Actions section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
          {/* Search bar */}
          <div className="relative flex-1 font-outfit md:mr-50 w-50 md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
            />
            {/* Search icon (using a simple SVG) */}
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

          {/* Buttons */}
          <div className="flex space-x-8 w-full md:w-auto">
            <button className="flex-1 font-outfit md:flex-none px-10 py-2 mr-30 bg-secondary text-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              All Events
            </button>
            <button className="flex-1 font-outfit md:flex-none px-6 py-2 mr-30 bg-secondary text-white rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-md">
              Create Event
            </button>
          </div>
        </div>

        {/* Event List Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 p-4 text-sm font-semibold font-outfit text-gray-700 bg-gray-50 border-b border-gray-200">
            <div className="col-span-2">Event Name</div>
            <div>Date</div>
            <div className="col-span-1">Location</div>
            <div>Attendees</div>
            <div>Price</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          {events.map((event, index) => (
            <div
              key={index}
              className={`grid grid-cols-7 gap-4 p-4 text-sm text-gray-600 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } border-b border-gray-200 last:border-b-0`}
            >
              <div className="col-span-2 font-medium">{event.name}</div>
              <div>{event.date}</div>
              <div className="col-span-1">{event.location}</div>
              <div>{event.attendees}</div>
              <div>{event.price}</div>
              <div>{event.status}</div>
              <div className="flex space-x-4">
                <a href="#" className="text-teal-500 font-outfit hover:text-teal-700 font-medium">
                  Edit
                </a>
                <a href="#" className="text-red-500 hover:text-red-700 font-outfit font-medium">
                  Delete
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizerEvent;
