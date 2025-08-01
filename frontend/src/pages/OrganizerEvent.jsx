import React from 'react';
import OrganizerNav from '../components/OrganizerNav';
import EventCard from '../components/OrganizerEventCard';

const OrganizerEvent = () => {
  const events = [
    {
      name: 'Tech Conference 2023',
      img: 'https://www.eventbookings.com/wp-content/uploads/2023/06/Multicolor-Abstract-Sunset-Party-Poster-724x1024.jpg',
      date: '2026-12-40 at 5:69 PM',
      location: 'SMX Pasay Manila',
      attendees: '100000 Attendees',
      price: 'Price',
      status: 'Status',
    },
    {
      name: 'Meow',
      img: 'https://www.eventbookings.com/wp-content/uploads/2023/06/Purple-Black-Tropical-Party-Club-Poster-724x1024.jpg',
      date: '2026-12-40 at 5:69 PM',
      location: 'SMX Pasay Manila',
      attendees: '100000 Attendees',
      price: 'Price',
      status: 'Status',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <OrganizerNav />

      {/* Content Container */}
      <div className="pt-20 md:ml-64 p-4 md:p-8 lg:p-12 flex flex-col items-center">
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

        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 xl:gap-5 mt-8 w-[95%] lg:w-full'>
          {events.map((event, i) => (
            <EventCard
              key={i}
              eventPoster={event.img}
              eventStatus={event.status}
              eventName={event.name}
              eventDate={event.date}
              eventLocation={event.location}
              eventAttendees={event.attendees}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizerEvent;
