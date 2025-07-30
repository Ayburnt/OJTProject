import React from 'react';

function EventCard({ event }) {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer group">
      {/* Image */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden">
        <img
          src={event.imageUrl || "https://via.placeholder.com/400x250/E0E0E0/A0A0A0?text=Event+Image"}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Optional: Add a subtle overlay for text if desired */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div> */}
      </div>

      {/* Content Area */}
      <div className="p-4 bg-teal-600 text-white">
        <h3 className="text-xl font-bold mb-1 group-hover:underline group-hover:text-orange-300 transition-colors">{event.title}</h3>
        <p className="text-sm text-teal-100 mb-1">{event.date}</p>
        <p className="text-sm text-teal-100">{event.location}</p>
        {/* Optional: Add a call-to-action button */}
        {/* <button className="mt-4 bg-white text-teal-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
          Details
        </button> */}
      </div>
    </div>
  );
}

export default EventCard;