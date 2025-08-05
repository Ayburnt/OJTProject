import React, { useState } from 'react';
import OrganizerNav from '../components/OrganizerNav';
import { FaChevronDown } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import { CgProfile } from 'react-icons/cg';

const mockEvents = ['All Events', 'Entertainment', 'Business', 'Sports', 'Lifestyle'];

const mockAttendees = [
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    event: 'Tech Conference',
    regDate: '2025-07-01',
    ticketType: 'VIP',
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john@example.com',
    event: 'Music Fest',
    regDate: '2025-07-10',
    ticketType: 'General',
  },
];

const Attendees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('All Events');

  const filteredAttendees = mockAttendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent =
      selectedEvent === 'All Events' || attendee.event === selectedEvent;
    return matchesSearch && matchesEvent;
  });

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
    <>
      <OrganizerNav />
           <div className="min-h-screen bg-gray-100 px-6 py-12 mt-16 md:mt-0 md:pl-64 mx-4 font-outfit">
                  <div className="flex justify-end mb-2">
              <CgProfile className="hidden md:flex text-[2.5rem] text-gray-300 mr-10" />
                </div>
        <div className="w-[95%] max-w-6xl mx-auto p-10 border border-gray-300 rounded-xl shadow bg-white mt-15">
          <h1 className="text-2xl font-semibold text-gray-800 mb-10">
            Manage Event Attendees
          </h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 w-full">
            {/* Search */}
            <div className="relative w-full md:max-w-sm">
              <CiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                size={18}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[90%] pl-10 border-b border-gray-400 focus:border-teal-500 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Filter and Download Button */}
            <div className="flex flex-col gap-3 w-full md:flex-row md:items-end md:w-auto">
              {/* Event Filter */}
              <div className="flex flex-col w-full md:w-48 lg:w-[95%]">
                <label className="text-sm text-gray-600 font-medium mb-1">Filter by Event:</label>
                <div className="relative">
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="appearance-none w-full pl-4 pr-8 py-2 rounded-full border border-teal-500 focus:border-teal-600 text-gray-700 bg-white" >
                    {mockEvents.map((event) => (
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
            <div className="flex w-full justify-end sm:justify-center md:mx-20 lg:mx-4">
          <button
            onClick={downloadCsv}
            className="min-w-[200px] whitespace-nowrap py-2 px-4 text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all flex justify-center items-center text-center"
          >
            Download Attendees CSV
          </button>
        </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-t border-black text-center">
              <thead>
                <tr className="text-gray-600 text-sm border-b border-black">
                  <th className="py-3 px-4 font-medium border-l border-r border-black">NAME</th>
                  <th className="py-3 px-4 font-medium border-l border-r border-black">EMAIL</th>
                  <th className="py-3 px-4 font-medium border-l border-r border-black">EVENT</th>
                  <th className="py-3 px-4 font-medium border-l border-r border-black">REG. DATE</th>
                  <th className="py-3 px-4 font-medium border-l border-r border-black">TICKET TYPE</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.length > 0 ? (
                  filteredAttendees.map((a, idx) => (
                    <tr
                      key={a.id}
                      className={`text-sm ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="py-3 px-4 border-l border-r border-t border-b border-black">{a.name}</td>
                      <td className="py-3 px-4 border-l border-r border-t border-b border-black">{a.email}</td>
                      <td className="py-3 px-4 border-l border-r border-t border-b border-black">{a.event}</td>
                      <td className="py-3 px-4 border-l border-r border-t border-b border-black">{a.regDate}</td>
                      <td className="py-3 px-4 border-l border-r border-t border-b border-black">{a.ticketType}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-500 italic">
                      No attendees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendees;
