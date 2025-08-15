import React, { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FiChevronLeft, FiSearch, FiUsers, FiCalendar, FiMapPin, FiCheckCircle, FiX } from 'react-icons/fi';

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-md lg:max-w-lg overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const tabs = [
    { id: 'all', label: 'All Events' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'past', label: 'Past Events' },
  ];

  const handleTabClick = (tabId) => setActiveTab(tabId);
  const handleCardClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-white flex flex-col items-center">
      <main className="w-full max-w-screen-lg mx-auto p-4 sm:p-6 md:p-8">
        
        {/* Organizer Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col items-center md:flex-row">
            {/* Profile picture */}
            <div className="rounded-full bg-gray-200 w-24 h-24 flex items-center justify-center mb-4 md:mb-0">
              <CgProfile size={64} className="text-gray-400" />
            </div>
            
            {/* Name and company info */}
            <div className="flex flex-col flex-1 min-w-0 md:ml-6 text-center md:text-left">
              <h1 className="text-xl font-bold mb-1 flex items-center justify-center md:justify-start">
                Organizer Name
                <FiCheckCircle className="w-5 h-5 ml-2 text-teal-500" />
              </h1>
              <p className="text-gray-500 text-sm mb-4 md:mb-0">Jesselle Corp.</p>
            </div>
            
            {/* Event and Attendees Stats */}
            <div className="flex justify-around w-full md:w-auto md:space-x-8">
              <div className="text-center">
                <span className="text-xl font-semibold">15</span>
                <span className="text-gray-500 text-sm block">Events</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-semibold">15</span>
                <span className="text-gray-500 text-sm block">Attendees</span>
              </div>
            </div>
          </div>
        </div>

        {/* Event Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex space-x-4 md:space-x-16 justify-center items-end">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
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

        {/* Event List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[ 
            { title: 'Event 2025', date: '20th June, 20XX', place: 'SPK Place, Manila', attendees: 150, status: 'Ongoing', statusColor: 'bg-white' },
            { title: 'Tuli si Juana 2069', date: '20th June, 20XX', place: 'Somewhere, Nowhere', attendees: 25, status: 'Ongoing', statusColor: 'bg-green-500' },
            { title: 'Another Event', date: '25th July, 20XX', place: 'City Hall', attendees: 100, status: 'Upcoming', statusColor: 'bg-blue-500' }
          ].map((event, idx) => (
            <button
              key={idx}
              onClick={handleCardClick}
              className="bg-teal-500 rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.01] duration-200 ease-in-out text-left"
            >
              <div className="bg-white w-full h-40"></div>
              
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-bold">{event.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.statusColor} text-white`}>
                    {event.status}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
                  <div className="flex items-center space-x-2 text-white text-sm mb-1 sm:mb-0">
                    <FiCalendar size={16} />
                    <p>{event.date}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-white text-sm">
                    <FiMapPin size={16} />
                    <p>{event.place}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-white text-sm">
                  <FiUsers size={16} />
                  <p>{event.attendees} attendees</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Modal */}
      <Modal show={showModal} onClose={handleCloseModal}>
        <div className="p-4 sm:p-6">
          <img
            src="https://placehold.co/400x200/00CED1/FFFFFF?text=Card+Image"
            alt="Event Card"
            className="w-full rounded-xl mb-4"
          />
          <h2 className="text-xl font-bold mb-1">Tuli si Juana 2069</h2>
          <p className="text-white text-sm mb-4">July 20, 2025</p>
          <div className="bg-teal-500 w-full py-3 rounded-xl text-white font-semibold text-center">
            Register
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;
