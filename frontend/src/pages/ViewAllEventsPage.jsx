// src/pages/ViewAllEventsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from "../components/EventCard";
import api from '../api.js';

function ViewAllEventsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const initialEventsToShow = 8;
  const eventsIncrement = 4;

  const [events, setEvents] = useState([]);
  const [eventsToShow, setEventsToShow] = useState(initialEventsToShow);
  const [activeCategory, setActiveCategory] = useState('All');

  // Fetch events from API
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const res = await api.get(`/event-public-view/`);
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllEvents();
  }, []);

  const filteredEvents =
    activeCategory === 'All'
      ? events
      : events.filter((event) => event.category === activeCategory);

  useEffect(() => {
    setEventsToShow(initialEventsToShow);
  }, [activeCategory]);

  const handleSeeMore = () => {
    setEventsToShow((prevCount) =>
      Math.min(prevCount + eventsIncrement, filteredEvents.length)
    );
  };

  const displayedEvents = filteredEvents.slice(0, eventsToShow);
  const hasMore = eventsToShow < filteredEvents.length;

  const categories = ['All', 'Corporate', 'Social', 'Cultural', 'Sports & Recreational', 'Political & Government', 'Educational', 'Fundraising'];

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-10">
          All Events
        </h1>



   {/* Category Filter Buttons */}
        {/* Mobile Dropdown */} 
        <div className="mb-10 lg:hidden flex justify-center w-full cursor-pointer">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="px-2 py-2 rounded-lg bg-white text-gray-700 min-w-[170px] max-w-fit md:min-w-[350px] md:w-full"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

{/* desktop */}
<div className="hidden lg:flex flex-wrap justify-center gap-4 mb-10 ">
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => setActiveCategory(category)}
      className={`px-4 py-2 rounded-full text-lg font-semibold transition-colors duration-200 cursor-pointer 
        ${
          activeCategory === category
            ? 'bg-teal-600 text-white shadow-md'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        }`}
    >
      {category}
    </button>
  ))}
</div>




        {/* Event Grid */}
        {filteredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayedEvents.map((event, i) => (
                <Link key={i} to={`/events/${event.event_code}`} className="block">
                  <EventCard
                    eventPoster={event.event_poster}
                    eventTitle={event.title}
                    eventDate={
                      event.start_date === event.end_date
                        ? event.start_date
                        : `${event.start_date} - ${event.end_date}`
                    }
                    eventLocation={event.venue_place}
                    eventCreator={`${event.created_by.first_name} ${event.created_by.last_name}`}
                  />
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-16">
                <button
                  onClick={handleSeeMore}
                  className="bg-teal-600 text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-teal-700 transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-teal-600 hover:border-teal-800"
                >
                  See More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No events available in this category. Please try another!
          </p>
        )}
      </div>
    </div>
  );
}

export default ViewAllEventsPage;
