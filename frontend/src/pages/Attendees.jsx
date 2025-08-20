import React, { useState } from 'react';
import OrganizerNav from '../components/OrganizerNav';
import { FaChevronDown } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import { CgProfile } from 'react-icons/cg';

const Attendees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('All Events');

  // These will later come from the backend (currently empty)
  const events = [
    'All Events',
    'Corporate',
    'Social',
    'Cultural',
    'Sports & Recreational',
    'Political & Government',
    'Educational',
    'Fundraising',
  ];
  const attendees = [];

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent =
      selectedEvent === 'All Events' || attendee.event === selectedEvent;
    return matchesSearch && matchesEvent;
  });
const uploadCsv = () => {
  // existing download function...
};
  const downloadCsv = () => {
    const headers = ['Name', 'Email', 'Event', 'Registration Date', 'Ticket Type'];
    const rows = filteredAttendees.map(
      (a) =>
        `"${a.name}","${a.email}","${a.event}","${a.regDate}","${a.ticketType}"`
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'attendees.csv');
    link.click();
  };

  return (
    <div className="bg-gray-50 min-h-screen font-outfit">
      <OrganizerNav />

      <div className="pt-23 md:ml-64 p-4 md:p-8 lg:p-12 flex flex-col items-center">
        <div className="justify-end flex w-full mb-2">
          <CgProfile className="hidden md:flex text-[2.5rem] text-gray-300 mr-10 mb-7" />
        </div>

        <div className="w-full max-w-6xl mx-auto p-5 md:p-8 lg:p-10 border border-gray-300 rounded-xl shadow bg-white">
          <h1 className="text-2xl font-semibold text-gray-800 mb-10">
            Manage Event Attendees
          </h1>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 w-full">
            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <CiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                size={18}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 border-b border-gray-400 focus:border-teal-500 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Filter + Download */}
            <div className="flex flex-col gap-3 w-full lg:flex-row lg:items-end lg:w-auto">
              {/* Event Filter */}
              <div className="flex flex-col w-full lg:w-52">
                <label className="text-sm text-gray-600 font-medium mb-1">
                  Filter by Event:
                </label>
                <div className="relative">
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="appearance-none w-full pl-4 pr-8 py-2 rounded-full border border-teal-500 focus:border-teal-600 text-gray-700 bg-white cursor-pointer"
                  >
                    <option value="All Events">All Events</option>
                    {/* Map real events here */}
                    {events.map((event) => (
                      <option key={event} value={event}>
                        {event}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={14}
                  />
                </div>
              </div>

            {/* Download Button */}
            <div className="w-full flex flex-row gap-2 justify-center md:gap-3">
              <button
                onClick={uploadCsv}
                className="w-[48%] md:min-w-[140px] whitespace-nowrap py-2 px-3 text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all flex justify-center items-center cursor-pointer"
              >
                Upload CSV
              </button>

              <button
                onClick={downloadCsv}
                className="w-[48%] md:min-w-[140px] whitespace-nowrap py-2 px-3 text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all flex justify-center items-center cursor-pointer"
              >
                Download CSV
              </button>
            </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-t border-black text-center">
              <thead>
                <tr className="text-gray-600 text-sm border-b border-black">
                  <th className="py-3 px-4 font-medium border border-black">
                    NAME
                  </th>
                  <th className="py-3 px-4 font-medium border border-black">
                    EMAIL
                  </th>
                  <th className="py-3 px-4 font-medium border border-black">
                    EVENT
                  </th>
                  <th className="py-3 px-4 font-medium border border-black">
                    REG. DATE
                  </th>
                  <th className="py-3 px-4 font-medium border border-black">
                    TICKET TYPE
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.length > 0 ? (
                  filteredAttendees.map((a, idx) => (
                    <tr
                      key={idx}
                      className={`text-sm ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="py-3 px-4 border border-black">{a.name}</td>
                      <td className="py-3 px-4 border border-black">{a.email}</td>
                      <td className="py-3 px-4 border border-black">{a.event}</td>
                      <td className="py-3 px-4 border border-black">{a.regDate}</td>
                      <td className="py-3 px-4 border border-black">
                        {a.ticketType}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-6 text-center text-gray-500 font-outfit"
                    >
                      No attendees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendees;
