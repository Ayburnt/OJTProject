import React, { useState, useEffect } from 'react';
import { CgProfile } from "react-icons/cg";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import { AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";
import api from '../events.js';

/* ---------- Back Button ---------- */
const BackButton = () => {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center font-outfit text-teal-600 hover:text-teal-800 mb-4 font-medium"
    >
      <span className="mr-1">&lt;</span> Back
    </button>
  );
};

/* ---------- Organizer Profile ---------- */
const ProfileCard = ({ organizer }) => (
  <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 flex flex-col items-center md:flex-row md:space-x-6">
    <div className="rounded-full bg-slate-200 w-24 h-24 flex items-center justify-center mb-4 md:mb-0">
      <CgProfile className="text-gray-400 w-16 h-16" />
    </div>
    <div className="flex flex-col flex-1 min-w-0 text-center md:text-left">
      <h1 className="text-xl font-bold font-outfit mb-1 flex items-center justify-center md:justify-start text-gray-900">
        {organizer?.name || "Organizer Name"}
        <AiOutlineCheckCircle className="w-5 h-5 ml-2 text-green-500" />
      </h1>
      <p className="text-gray-500 font-outfit text-sm">{organizer?.company || "Company Name"}</p>
    </div>
    <div className="flex justify-around w-full md:w-auto md:space-x-8 mt-4 md:mt-0">
      <div className="text-center">
        <span className="text-xl font-bold font-outfit text-gray-900">{organizer?.eventsCount || 0}</span>
        <span className="text-gray-500 text-sm font-outfit block">Events</span>
      </div>
      <div className="text-center">
        <span className="text-xl font-bold font-outfit text-gray-900">{organizer?.attendeesCount || 0}</span>
        <span className="text-gray-500 font-outfit text-sm block">Attendees</span>
      </div>
    </div>
  </div>
);

/* ---------- Tabs ---------- */
const EventTabs = ({ activeTab, onTabClick }) => {
  const tabs = [
    { id: 'all', label: 'All Events' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'past', label: 'Past Events' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex space-x-2 md:space-x-6 justify-center items-end">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={`pb-1 text-sm font-semibold transition-colors duration-200 ease-in-out
            ${activeTab === tab.id
              ? 'border-b-2 border-teal-500 text-teal-500'
              : 'border-b-2 border-transparent text-gray-600 hover:text-gray-800'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

/* ---------- Event Card ---------- */
const EventCard = ({ event, onCardClick }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'past':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.01] duration-200 ease-in-out text-left cursor-pointer"
      onClick={() => onCardClick(event)}
    >
      <img
        src={event.event_poster || `https://placehold.co/600x400/FFFFFF/000000?text=${event.title?.replace(' ', '+')}`}
        alt={`${event.title} Event`}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 sm:p-6 bg-teal-500 text-white">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold">{event.title}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold font-outfit text-white ${getStatusColor(event.status)}`}>
            {event.status}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
          <div className="flex items-center font-outfit space-x-2 text-sm mb-1 sm:mb-0">
            <FiCalendar className="w-4 h-4" />
            <p>{event.start_date}</p>
          </div>
          <div className="flex items-center font-outfit space-x-2 text-sm">
            <FiMapPin className="w-4 h-4" />
            <p>{event.venue_name}</p>
          </div>
        </div>
        <div className="flex items-center font-outfit space-x-2 text-sm">
          <FiUsers className="w-4 h-4" />
          <p>{event.attendees || 0} attendees</p>
        </div>
      </div>
    </div>
  );
};

/* ---------- Event Modal ---------- */
const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 z-10"
        >
          <AiOutlineClose className="w-8 h-8" />
        </button>
        <div className="bg-teal-500 relative overflow-hidden">
          <img
            src={event.event_poster || "https://placehold.co/600x400/FFFFFF/000000?text=Event"}
            alt={event.title}
            className="w-full h-40 object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-2">{event.title}</h2>
          <div className="flex flex-col gap-2 mb-4 text-gray-600 text-sm">
            <p>{event.start_date}</p>
            <p>{event.venue_name}</p>
            <p>{event.attendees || 0} attendees</p>
          </div>
          <button className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-teal-600 transition-colors duration-200">
            View Event
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main TimeLine ---------- */
const TimeLine = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/event-public/`);
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    return event.status?.toLowerCase() === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-100 antialiased text-gray-800 flex flex-col items-center">
      <main className="w-full max-w-screen-lg mx-auto p-4 sm:p-6 md:p-8">
        <BackButton />
        <ProfileCard organizer={{ name: "Organizer Name", company: "Jesselle Corp.", eventsCount: events.length, attendeesCount: 2500 }} />
        <EventTabs activeTab={activeTab} onTabClick={setActiveTab} />

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onCardClick={setSelectedEvent} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No events found for this category.
              </div>
            )}
          </div>
        )}
      </main>
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default TimeLine;
