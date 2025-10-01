import React from 'react';

function EventCard({ eventPoster, eventTitle, eventInfo, eventLocation, eventCreator, eventDetails }) {
  // ✅ Date formatter
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

    function timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "week", seconds: 604800 },
            { label: "day", seconds: 86400 },
            { label: "h", seconds: 3600 },
            { label: "m", seconds: 60 }
        ];

        for (const i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count >= 1) return `${count}${i.label}${count > 1 && i.label.length > 1 ? "s" : ""} ago`;
        }
        return "Just now";
    }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer group font-outfit">
      <div className='flex flex-row items-center w-full p-2 gap-2 bg-secondary'>
        <img src={eventInfo.created_by.org_logo} className='aspect-square object-cover w-8 rounded-full' alt="" />
        <div className='flex flex-col text-white'>
          <p className='w-full truncate font-semibold leading-none hover:underline' onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = `/org/${eventInfo.created_by.user_code}`;
          }}>{eventInfo.created_by.company_name}</p>
          <p className='text-xs font-normal'>{timeAgo(eventInfo.created_at)}</p>
        </div>
      </div>
      {/* Image */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden">
        <img
          src={eventPoster}
          alt={eventTitle}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 bg-teal-600 text-white leading-none">
        {/* Title */}
        <h3
          title={eventTitle} // Tooltip for full text
          className="text-lg sm:text-xl font-bold mb-2 hover:underline group-hover:text-orange-300 transition-colors truncate block max-w-full"
        >
          {eventTitle}
        </h3>

        {/* Date */}
        <div className="flex items-center text-sm text-teal-100">
          <span className="truncate">{formatEventDateTime(eventInfo.start_date, eventInfo.start_time, eventInfo.end_date, eventInfo.end_time)}</span>
        </div>

        <div className="flex items-center text-sm text-teal-100">
          <span className="truncate">{eventInfo.venue_specific ? `${eventInfo.venue_specific}, ` : ''} {eventInfo.venue_address}</span>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
