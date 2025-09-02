import React, { useEffect, useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import { AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";
import api from '../api.js';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';


// Back Button Component
const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/`)}
      className="flex items-center cursor-pointer font-outfit text-teal-600 hover:text-teal-800 mb-4 font-medium"
    >
      <span className="mr-1">&lt;</span> Back
    </button>
  );
};


// Organizer Profile Card
const ProfileCard = ({ profileData, eventData, totalAttendees }) => {
  if (!profileData || profileData.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 flex items-center justify-center">
        Loading profile...
      </div>
    );
  }



  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 flex flex-col items-center md:flex-row md:space-x-6">
      <div className="rounded-full overflow-hidden bg-slate-200 w-24 h-24 flex items-center justify-center mb-4 md:mb-0">
        <img src={profileData.profile_picture} alt="" className='w-full object-contain' />
      </div>
      <div className="flex flex-col flex-1 min-w-0 text-center md:text-left">
        <h1 className="text-xl font-bold font-outfit mb-1 flex items-center justify-center md:justify-start text-gray-900">
          {profileData.first_name} {profileData.last_name}
          {profileData.verification_status === 'verified' && (
            <AiOutlineCheckCircle className="w-5 h-5 ml-2 text-green-500" />
          )}
        </h1>
        <p className="text-gray-500 font-outfit text-sm">{profileData.company_name}</p>
      </div>
      <div className="flex justify-around w-full md:w-auto md:space-x-8 mt-4 md:mt-0">
        <div className="text-center">
          <span className="text-xl font-bold font-outfit text-gray-900">{eventData.length || 0}</span>
          <span className="text-gray-500 text-sm font-outfit block">Events</span>
        </div>
        <div className="text-center">
          <span className="text-xl font-bold font-outfit text-gray-900">{totalAttendees.toLocaleString()}</span>
          <span className="text-gray-500 font-outfit text-sm block">Attendees</span>
        </div>
      </div>
    </div>
  );
};

// Navigation Tabs
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

// Helper: compute event category from date/time
const getEventCategory = (event) => {
  const now = new Date();
  const start = new Date(`${event.start_date}T${event.start_time}`);
  const end = new Date(`${event.end_date}T${event.end_time}`);

  // Completed events are always past
  if (event.status === "completed") return "past";

  // Published events: decide between upcoming / ongoing
  if (event.status === "published") {
    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    if (now > end) return "past"; // edge case if not marked completed yet
  }

  return null; // cancelled or pending (shouldn’t be fetched anyway)
};

// Event Card
const EventCard = ({ event }) => {
  const category = getEventCategory(event);

  const getStatusColor = (category) => {
    switch (category) {
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

  const statusColorClass = getStatusColor(category);

  function formatEventDateTime(startDate, startTime, endDate, endTime) {
    if (!startDate || !startTime) return "TBA";

    const start = new Date(`${startDate}T${startTime}`);
    const end = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;

    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };

    if (!end || start.toDateString() === end.toDateString()) {
      // Single-day event
      return `${start.toLocaleDateString("en-US", optionsDate)} at ${start.toLocaleTimeString("en-US", optionsTime)}${end ? ` - ${end.toLocaleTimeString("en-US", optionsTime)}` : ""}`;
    } else {
      // Multi-day event
      return `${start.toLocaleDateString("en-US", optionsDate)}, ${start.toLocaleTimeString("en-US", optionsTime)} - ${end.toLocaleDateString("en-US", optionsDate)}, ${end.toLocaleTimeString("en-US", optionsTime)}`;
    }
  }

  function formatToGoogleDate(dateStr, timeStr) {
    const dt = new Date(`${dateStr}T${timeStr}`); // local time
    return dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  const googleCalendarLink = (event) => {
    const start = formatToGoogleDate(event.start_date, event.start_time);
    const end = formatToGoogleDate(event.end_date, event.end_time);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.venue_name)}&sf=true&output=xml`;
  };


  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.01] duration-200 ease-in-out text-left"
    // onClick={() => onCardClick(event)}

    >
      <img
        src={event.event_poster}
        alt={`${event.title} Event`}
        className="w-full h-full object-cover"
      />

      <div className="p-4 sm:p-6 bg-teal-500 text-white flex flex-col flex-grow justify-between">
          <div>
         <div className="flex items-start justify-between mb-2">
          <a className="text-xl font-bold cursor-pointer hover:underline" href={`/events/${event.event_code}`}>{event.title}</a>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold font-outfit text-white ${statusColorClass}`}>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : "Unknown"}
          </span>
        </div>
           </div>

          {/* Bottom Section (always grouped & aligned) */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center text-sm">
            <FiCalendar className="mr-2" />
            <p>
              {formatEventDateTime(event.start_date, event.start_time, event.end_date, event.end_time)}
            </p>
          </div>
          <div className="flex items-center text-sm">
            <FiMapPin className="mr-2" />
            <p>{event.venue_specific !== null || event.venue_specific !== '' ? event.venue_specific + ', ' : ''}{event.venue_name}</p>
          </div>
       <div className="flex items-center text-sm">
          <FiUsers className="mr-2" />
          <p>{event.attendees} attendees</p>
        </div>
        </div>

        <a href={googleCalendarLink(event)} target="_blank" rel="noopener noreferrer">
          <button className="border mt-2 font-outfit border-white p-2 text-sm z-200 rounded-lg cursor-pointer hover:bg-secondary/70">
            Add to Google Calendar
          </button>
        </a>
      </div>
    </div>
  );
};

// Event Modal
const EventModal = ({ event, onClose }) => {

  if (!event) return null;

  function formatDateTime(dateStr, timeStr) {
    const dt = new Date(`${dateStr}T${timeStr}`);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(dt);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
        >
          <AiOutlineClose className="w-8 h-8" />
        </button>

        <div className="bg-teal-500 relative overflow-hidden">
          <img
            src={event.event_poster}
            alt="Event Image"
            className="w-full h-40 object-cover"
          />
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-2">
            {event.title}
          </h2>
          <div className="grid grid-rows-3 space-x-4 mb-4 text-gray-600">
            <p className="text-sm">
              {event.start_date === event.end_date
                ? `${formatDateTime(event.start_date, event.start_time)} - ${event.end_time}`
                : `${formatDateTime(event.start_date, event.start_time)} - ${formatDateTime(event.end_date, event.end_time)}`}
            </p>
            <p className="text-sm">{event.venue_name}</p>
            <p className="text-sm">{event.attendees} attendees</p>
          </div>
          <button className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-teal-600 transition-colors duration-200">
            View Event
          </button>
        </div>
      </div>
    </div>
  );
};

// Main TimeLine
const TimeLine = () => {
  const { userCode } = useParams();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [profileData, setProfileData] = useState([]);
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    document.title = "Timeline | Sari-Sari Events";
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/${userCode}/`);
      const organizer = res.data.organizer;
      const events = res.data.events.map(ev => {
        // sum of all ticket types
        const attendees = ev.ticket_types?.reduce((sum, t) => {
          return sum + (t.quantity_total - t.quantity_available);
        }, 0) || 0;

        return { ...ev, attendees };
      });
      setProfileData(organizer);
      setEventData(events);
      console.log(res.data)
    } catch (err) {
      console.error("Error fetching event:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const filteredEvents = eventData.filter(event => {
    if (activeTab === "all") return true;
    return getEventCategory(event) === activeTab;
  });

  const openModal = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  return (
    <div className="min-h-screen bg-gray-100 antialiased text-gray-800 flex flex-col items-center">
      <main className="w-full max-w-screen-lg mx-auto p-4 sm:p-6 md:p-8">

        <BackButton />
        <ProfileCard profileData={profileData} eventData={eventData}
          totalAttendees={eventData.reduce((sum, ev) => sum + (ev.attendees || 0), 0)}
        />
        <EventTabs activeTab={activeTab} onTabClick={setActiveTab} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onCardClick={() => openModal(event)} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No events found for this category.
            </div>
          )}
        </div>
      </main>

      <EventModal event={selectedEvent} onClose={closeModal} />
    </div>
  );
};

export default TimeLine;
