import React, {useState} from 'react';
import OrganizerNav from '../components/OrganizerNav';
import EventCard from '../components/OrganizerEventCard';
import { Link } from "react-router-dom";


const OrganizerEvent = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Events');
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
      <div className="pt-23 md:ml-64 p-4 md:p-8 lg:p-12 flex flex-col items-center">
        {/* Header */}
        <div className="justify-center mb-5 hidden md:flex">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light font-outfit text-gray-800">
            Event Overview
          </h1>
        </div>

        {/* Search & Buttons */}
        <div className="flex flex-col w-[90%] md:w-full items-center md:items-start justify-between gap-4 mb-8">
          {/* Search bar */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
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
          <div className="flex flex-row w-full gap-3 items-center lg:w-[80%] xl:w-[70%] lg:justify-between overflow-x-auto hide-scrollbar text-sm">
            <button className={`${selectedCategory === 'All Events' ? `bg-secondary text-white` : `border-1 border-secondary text-secondary`} whitespace-nowrap px-4 lg:px-7 xl:px-10 py-2 rounded-full hover:bg-secondary/80 hover:text-white font-outfit shadow cursor-pointer`}>
              All Events
            </button>
            <button className={`${selectedCategory === 'Upcoming' ? `bg-secondary text-white` : `border-1 border-secondary text-secondary`} whitespace-nowrap px-4 lg:px-7 xl:px-10 py-2 rounded-full hover:bg-secondary/80 hover:text-white font-outfit shadow cursor-pointer`}>
              Upcoming
            </button>
            <button className={`${selectedCategory === 'Ongoing' ? `bg-secondary text-white` : `border-1 border-secondary text-secondary`} whitespace-nowrap px-4 lg:px-7 xl:px-10 py-2 rounded-full hover:bg-secondary/80 hover:text-white font-outfit shadow cursor-pointer`}>
              Ongoing
            </button>
            <button className={`${selectedCategory === 'Recent' ? `bg-secondary text-white` : `border-1 border-secondary text-secondary`} whitespace-nowrap px-4 lg:px-7 xl:px-10 py-2 rounded-full hover:bg-secondary/80 hover:text-white font-outfit shadow cursor-pointer`}>
              Recent
            </button>
          </div>

              <Link to="/create-event">
            <button className='bg-secondary text-white mt-8 w-full py-3 rounded-lg font-outfit md:self-start md:w-auto md:px-5 cursor-pointer hover:bg-secondary/80 hover:text-white'>
            Create New Event</button>
              </Link>
        </div>


        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-8 w-[95%] lg:w-full'>
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
