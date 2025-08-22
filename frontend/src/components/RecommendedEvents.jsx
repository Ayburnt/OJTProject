import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import EventCard from './EventCard'; 
import api from '../api.js';

function RecommendedEvents() {
  const [events, setEvents] = useState([]);

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

  // Limit to 8 events for display
  const limitedEvents = Array.isArray(events) ? events.slice(0, 8) : [];

  return (
    <section id="recommended-events" className="py-16 md:py-20 bg-white shadow-inner-lg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-teal-800 mb-4 tracking-tight">
            WHAT'S HAPPENING NOW?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover the hottest and most popular events happening around you. Don't miss out on the action!
          </p>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 md:gap-9 w-full">
          {limitedEvents.length > 0 ? (
            limitedEvents.map((event, i) => (
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
            ))
          ) : (
            <div className='w-full col-span-4 item-center'>
           <p className="text-gray-300 text-3xl font-outfit italic text-center"> No events available😭😭</p>
          </div>
          )}
        </div>

        {/* Show "View All Events" only if 8 or more events exist */}
        {events.length >= 8 && (
          <div className="text-center mt-16">
            <Link
              to="/Events"
              className="inline-block bg-teal-600 text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-teal-700 transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-teal-600 hover:border-teal-800"
            >
              View All Events
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default RecommendedEvents;
