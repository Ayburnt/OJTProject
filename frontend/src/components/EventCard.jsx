import React from 'react';

function EventCard({ eventPoster, eventTitle, eventDate, eventLocation, eventCreator }) {
  // ✅ Date formatter
  function formatDate(dateStr) {
    if (!dateStr) return "TBA";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer group">
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
        <h3
          title={eventTitle} // Tooltip for full text
          className="text-lg sm:text-xl font-bold mb-2 group-hover:underline group-hover:text-orange-300 transition-colors truncate block max-w-full"
        >
          {eventTitle}
        </h3>

        {/* Date */}
        <div className="flex items-center text-sm text-teal-100 mb-1">
          <span className="truncate">{formatDate(eventDate)}</span>
        </div>

        {/* Creator */}
        <div className="text-sm text-teal-100 italic">
          By {eventCreator || "Unknown Organizer"}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
