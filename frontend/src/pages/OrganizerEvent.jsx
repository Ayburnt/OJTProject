import React, { useEffect, useState } from 'react';
import OrganizerNav from '../components/OrganizerNav';
import EventCard from '../components/OrganizerEventCard';
import { Link } from "react-router-dom";
import Chatbot from '../pages/Chatbot';
import useAuth from '../hooks/useAuth';
import api from '../api.js';

const OrganizerEvent = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { userCode } = useAuth();

  const fetchEventDetails = async () => {
    try {
      const res = await api.get(`/list-create/`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  useEffect(() => {
    document.title = "Organizer Event | Sari-Sari Events";
  }, []);

  // Format date + time
  // Add this helper function inside OrganizerEvent
  function formatEventDateTime(startDate, startTime, endDate, endTime) {
    if (!startDate || !startTime) return "TBA";

    const start = new Date(`${startDate}T${startTime}`);
    const end = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;

    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };

    if (!end || start.toDateString() === end.toDateString()) {
      // Single-day event
      return `${start.toLocaleDateString("en-US", optionsDate)} at ${start.toLocaleTimeString("en-US", optionsTime)}${endTime ? ` - ${end.toLocaleTimeString("en-US", optionsTime)}` : ""}`;
    } else {
      // Multi-day event
      return `${start.toLocaleDateString("en-US", optionsDate)}, ${start.toLocaleTimeString("en-US", optionsTime)} - ${end.toLocaleDateString("en-US", optionsDate)}, ${end.toLocaleTimeString("en-US", optionsTime)}`;
    }
  }


  // Determine event status based on current date/time
  function getEventStatus(event) {
    const now = new Date();
    const start = new Date(`${event.start_date}T${event.start_time}`);
    const end = new Date(`${event.end_date}T${event.end_time}`);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Ongoing";
    if (now > end) return "Done";
    return "All Events";
  }

  // Get status color for badge
  function getStatusColor(status) {
    switch (status) {
      case "Upcoming":
        return "bg-blue-500 text-white";
      case "Ongoing":
        return "bg-green-500 text-white";
      case "Done":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-200 text-black";
    }
  }

  // Filter events based on search + category
  const filteredEvents = events.filter(event => {
    const title = event.title ? event.title.toLowerCase() : "";
    const venue = event.venue_name ? event.venue_name.toLowerCase() : "";
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || venue.includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === "All Events") return true;
    return getEventStatus(event) === selectedCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <OrganizerNav />

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
              placeholder="Search events by name or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            {["All Events", "Upcoming", "Ongoing", "Done"].map((cat) => (
              <button
                key={cat}
                className={`${selectedCategory === cat
                  ? `bg-secondary text-white`
                  : `border-1 border-secondary text-secondary`
                  } whitespace-nowrap px-4 lg:px-7 xl:px-10 py-2 rounded-full hover:bg-secondary/80 hover:text-white font-outfit shadow cursor-pointer`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <Link
            to={`/org/${userCode}/create-event`}
            className='bg-secondary text-center text-white mt-8 w-full py-3 rounded-lg font-outfit md:self-start md:w-auto md:px-5 cursor-pointer hover:bg-secondary/80 hover:text-white'
          >
            Create New Event
          </Link>
        </div>

        {/* Event Cards */}
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-8 w-[95%] lg:w-full'>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, i) => (
              <EventCard
                key={i}
                eventPoster={event.event_poster}
                eventStatus={getEventStatus(event)}
                eventStatusColor={getStatusColor(getEventStatus(event))}
                eventName={event.title}
                eventDate={formatEventDateTime(event.start_date, event.start_time, event.end_date, event.end_time)}


                eventLocation={event.venue_name}
                eventAttendees={event.attendees}
                ticketTypes={event.ticket_types}
                eventCode={event.event_code}
                setEventCode={event.event_code}
                fetchEventDetails={fetchEventDetails}
              />
            ))
          ) : (
            <p className="text-gray-500">No events match your search or category.</p>
          )}
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default OrganizerEvent;
