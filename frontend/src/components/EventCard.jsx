import React from 'react';

function EventCard({ eventPoster, eventTitle, eventDate, eventLocation, eventCreator }) {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer group">
      {/* Image */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden">
        <img
          src={eventPoster}
          alt={eventTitle}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 bg-teal-600 text-white">
        {/* Title */}
        <h3 className="text-xl font-bold mb-1 group-hover:underline group-hover:text-orange-300 transition-colors line-clamp-2">
          {eventTitle}
        </h3>

        {/* Date */}
        <p className="text-sm text-teal-100 mb-1">{eventDate}</p>

        {/* Location */}
        <p className="text-sm text-teal-100 truncate">{eventLocation}</p>

        {/* Creator */}
        <p className="text-sm text-teal-100">By {eventCreator}</p>
      </div>
    </div>
  );
}

export default EventCard;
