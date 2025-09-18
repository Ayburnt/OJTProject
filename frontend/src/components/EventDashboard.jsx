import React, { useState } from "react";

export default function OrganizerEventDashboard({ event, attendees, transactions }) {
  const [isPosterOpen, setIsPosterOpen] = useState(false);

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

  return (

    <>
      {isPosterOpen && (
        <div
          className="fixed inset-0 z-50 flex py-4 items-center justify-center bg-black/70 cursor-pointer"
          onClick={() => setIsPosterOpen(false)}
        >
          <div className="w-[90%] h-full">
            <img
              src={event.event_poster}
              className="rounded-2xl w-full h-full object-contain"
              alt=""
            />
          </div>
        </div>
      )}

      <div className="py-6 space-y-6 w-full">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full h-full flex items-start justify-center rounded-xl overflow-hidden bg-black/60">
            <img
              src={event.event_poster_url}
              alt={event.title}
              className="object-contain w-full max-h-80 shadow cursor-pointer"
              onClick={() => setIsPosterOpen(true)}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="text-gray-600 mt-1">{event.description}</p>
            <p className="mt-2 font-medium">
              {formatEventDateTime(event.start_date, event.start_time, event.end_date, event.end_time)}
            </p>
            <p className="text-gray-700">{event.venue_specific || ''} {event.venue_address}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded">
              {event.status}
            </span>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Attendees</p>
            <p className="text-2xl font-bold text-teal-700">{attendees.length}</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Check-ins</p>
            <p className="text-2xl font-bold text-teal-700">
              {
                attendees.filter(a => a.attendance !== null && a.attendance !== undefined).length
              }
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-2xl font-bold text-teal-700">
              ₱
              {transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-2xl font-bold capitalize text-teal-700">{event.status}</p>
          </div>
        </div>
      </div>
    </>
  );
}
