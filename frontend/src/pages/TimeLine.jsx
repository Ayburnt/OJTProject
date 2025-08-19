import React, { useEffect, useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import { AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";
import api from '../api.js';
import { useParams } from 'react-router-dom';

// Back Button Component
const BackButton = () => {
  return (
    <button
      onClick={() => console.log('Back button clicked')}
      className="flex items-center font-outfit text-teal-600 hover:text-teal-800 mb-4 font-medium"
    >
      <span className="mr-1">&lt;</span> Back
    </button>
  );
};

// Component for the Organizer Profile Card
// Component for the Organizer Profile Card
const ProfileCard = ({ profileData }) => {
  if (!profileData || profileData.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  const user = profileData[0];

  // Use optional chaining to safely access fields
  const firstName = user.created_by?.first_name || user.first_name || "Organizer";
  const lastName = user.created_by?.last_name || user.last_name || "";
  const pfp = user.created_by?.profile_picture || user.profile_picture || "";
  const company_name = user.created_by?.company_name || user.company_name || "";

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 flex flex-col items-center md:flex-row md:space-x-6">
      <div className="rounded-full overflow-hidden bg-slate-200 w-24 h-24 flex items-center justify-center mb-4 md:mb-0">
        <img src={pfp} alt="" className='w-full object-contain' />
      </div>
      <div className="flex flex-col flex-1 min-w-0 text-center md:text-left">
        <h1 className="text-xl font-bold font-outfit mb-1 flex items-center justify-center md:justify-start text-gray-900">
          {firstName} {lastName}
          <AiOutlineCheckCircle className="w-5 h-5 ml-2 text-green-500" />
        </h1>
        <p className="text-gray-500 font-outfit text-sm">{company_name}</p>
      </div>
      <div className="flex justify-around w-full md:w-auto md:space-x-8 mt-4 md:mt-0">
        <div className="text-center">
          <span className="text-xl font-bold font-outfit text-gray-900">{profileData.length}</span>
          <span className="text-gray-500 text-sm font-outfit block">Events</span>
        </div>
        <div className="text-center">
          <span className="text-xl font-bold font-outfit text-gray-900">2500+</span>
          <span className="text-gray-500 font-outfit text-sm block">Attendees</span>
        </div>
      </div>
    </div>
  );
};


// Component for the Navigation Tabs
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

// Component for an individual Event Card
const EventCard = ({ event, onCardClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-green-500';
      case 'Upcoming':
        return 'bg-blue-500';
      case 'Past':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const statusColorClass = getStatusColor(event.status);

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.01] duration-200 ease-in-out text-left cursor-pointer"
      onClick={() => onCardClick(event)}
    >
      {/* Placeholder for event image */}
      <img
        src={`https://placehold.co/600x400/FFFFFF/000000?text=${event.title.replace(' ', '+')}`}
        alt={`${event.title} Event`}
        className="w-full h-40 object-cover"
      />
      
      <div className="p-4 sm:p-6 bg-teal-500 text-white">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold">{event.title}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold font-outfit text-white ${statusColorClass}`}>
            {event.status}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
          <div className="flex items-center font-outfit space-x-2 text-sm mb-1 sm:mb-0">
            <FiCalendar className="w-4 h-4" />
            <p>{event.date}</p>
          </div>
          <div className="flex items-center font-outfit space-x-2 text-sm">
            <FiMapPin className="w-4 h-4" />
            <p>{event.place}</p>
          </div>
        </div>

        <div className="flex items-center font-outfit space-x-2 text-sm">
          <FiUsers className="w-4 h-4" />
          <p>{event.attendees} attendees</p>
        </div>
      </div>
    </div>
  );
};

// Component for the Modal (Popup)
const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
        >
          <AiOutlineClose className="w-8 h-8" />
        </button>

        {/* Modal content based on the design */}
        <div className="bg-teal-500 relative overflow-hidden">
          <img
            src="https://placehold.co/600x400/FFFFFF/000000?text=Studio+Ghiblix"
            alt="Event Image"
            className="w-full h-40 object-cover"
          />
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-2">
            {event.title}
          </h2>
          <div className="flex items-center space-x-4 mb-4 text-gray-600">
            <p className="text-sm">
              {event.date}
            </p>
            <p className="text-sm">
              {event.place}
            </p>
            <p className="text-sm">
              {event.attendees} attendees
            </p>
          </div>
          <button className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-teal-600 transition-colors duration-200">
            View Event
          </button>
        </div>
      </div>
    </div>
  );
};

// Main TimeLine Component
const TimeLine = () => {
  const { userCode } = useParams();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [profileData, setProfileData] = useState([]);

  const fetchProfile = async () => {
  try {
    const res = await api.get(`/profile/${userCode}/`);
    if (res.data && res.data.length > 0) {
      setProfileData(res.data);
      console.log(res.data);
    } else {
      console.log("No events found");
    }
  } catch (err) {
    console.error("Error fetching event:", err);
  }
};

useEffect(() => {
  fetchProfile();
}, []);


  const events = [
    { id: 1, title: 'Event 2025', date: '20th June, 20XX', place: 'SPK Place, Manila', attendees: 150, status: 'Ongoing' },
    { id: 2, title: 'Tuli si Juana 2069', date: '20th June, 20XX', place: 'Somewhere, Nowhere', attendees: 25, status: 'Ongoing' },
    { id: 4, title: 'Past Conference 2023', date: '10th Oct, 2023', place: 'Metro Convention Center', attendees: 300, status: 'Past' },
  ];

  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    return event.status.toLowerCase() === activeTab;
  });

  const openModal = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 antialiased text-gray-800 flex flex-col items-center">
      <main className="w-full max-w-screen-lg mx-auto p-4 sm:p-6 md:p-8">
        
        {/* Back Button */}
        <BackButton />

        {/* Organizer Profile Card */}
        <ProfileCard profileData={profileData} />

        {/* Event Navigation Tabs */}
        <EventTabs activeTab={activeTab} onTabClick={setActiveTab} />

        {/* Event List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onCardClick={openModal} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No events found for this category.
            </div>
          )}
        </div>
      </main>

      {/* The modal is rendered here if an event is selected */}
      <EventModal event={selectedEvent} onClose={closeModal} />
    </div>
  );
};

export default TimeLine;
