import React, { useEffect, useState } from 'react';
import OrganizerNav from '../components/OrganizerNav';
import EventCard from '../components/OrganizerEventCard';
import { Link, useNavigate } from "react-router-dom";
import Chatbot from '../pages/Chatbot';
import useAuth from '../hooks/useAuth';
import api from '../api.js';
import { IoIosArrowBack } from "react-icons/io";
import EventAttendees from '../components/EventAttendees.jsx';
import EventDashboard from '../components/EventDashboard.jsx';
import EventTransactions from '../components/EventTransactions.jsx';
import { MdContentCopy } from "react-icons/md";

const OrganizerEvent = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { userCode, orgLogo } = useAuth();
  const [selectedPage, setSelectedPage] = useState('Dashboard');

  const fetchEventDetails = async () => {
    try {
      const res = await api.get(`/list-create/`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  useEffect(() => {
    document.title = "Organizer Event | Sari-Sari Events";
  }, []);

  // Format date + time
  // Add this helper function inside OrganizerEvent
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


  // Determine event status based on current date/time
  function getEventStatus(event) {
    const now = new Date();
    const start = new Date(`${event.start_date}T${event.start_time}`);
    const end = new Date(`${event.end_date}T${event.end_time}`);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Ongoing";
    if (now > end) return "Done";
    return "All Events";
  }

  // Get status color for badge
  function getStatusColor(status) {
    switch (status) {
      case "Upcoming":
        return "bg-blue-500 text-white";
      case "Ongoing":
        return "bg-green-500 text-white";
      case "Done":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-200 text-black";
    }
  }

  // Filter events based on search + category
  const filteredEvents = events.filter(event => {
    const title = event.title ? event.title.toLowerCase() : "";
    const venue = event.venue_name ? event.venue_name.toLowerCase() : "";
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || venue.includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === "All Events") return true;
    return getEventStatus(event) === selectedCategory;
  });

  const [currentEvent, setCurrentEvent] = useState(null);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransac, setLoadingTransac] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchAttendees = async (event) => {
    setCurrentEvent(event);
    setLoadingAttendees(true);
    setLoadingTransac(true);
    try {
      const res = await api.get(`/attendees/${event.event_code}/`);
      const attendeesData = Array.isArray(res.data)
        ? res.data
        : res.data.attendees || [];
      console.log(res.data)
      setAttendees(attendeesData);
    } catch (err) {
      console.error("Error fetching attendees:", err);
      setAttendees([]);
    } finally {
      setLoadingAttendees(false);
    }

    try {
      const res1 = await api.get(`transactions/list/${event.event_code}/`);
      setTransactions(res1.data);
      console.log(res1.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoadingTransac(false);
    }
  };


  const [searchAttendees, setSearchAttendees] = useState("");
  const filteredAttendees = attendees.filter(
    (a) =>
      a.fullName?.toLowerCase().includes(searchAttendees.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchAttendees.toLowerCase())
  );

  const [searchTransactions, setSearchTransactions] = useState("");
  const filteredTransactions = transactions.filter(
    (a) =>
      a.event_id?.toLowerCase().includes(searchTransactions.toLowerCase()) ||
      a.payment_ref?.toLowerCase().includes(searchTransactions.toLowerCase()) ||
      a.status?.toLowerCase().includes(searchTransactions.toLowerCase()) ||
      a.transaction_type?.toLowerCase().includes(searchTransactions.toLowerCase()) ||
      a.payment?.toLowerCase().includes(searchTransactions.toLowerCase())
  );

  // Helper function to group tickets
  // Helper function to group tickets with price and subtotal
  function groupTickets(attendees) {
    if (!attendees) return [];
    const grouped = {};

    attendees.forEach((att) => {
      const ticketName = att.ticket_read?.ticket_name || "Unknown Ticket";
      const price = parseFloat(att.price_at_purchase || 0);

      if (!grouped[ticketName]) {
        grouped[ticketName] = { count: 0, price: price, subtotal: 0 };
      }

      grouped[ticketName].count += 1;
      grouped[ticketName].subtotal += price;
    });

    return Object.entries(grouped); // [[ticketName, {count, price, subtotal}], ...]
  }




  return (
    <div className="bg-gray-50 min-h-screen font-outfit pb-10">
      <OrganizerNav />

      <div className="pt-23 md:ml-64 p-4 md:p-8 lg:p-12 flex flex-col items-center">
        {/* Header */}
        <div className='flex flex-row justify-end w-full items-center'>
          {currentEvent !== null && (
            <div className='flex justify-between w-full'>
              <div
                className="w-full flex items-center justify-start gap-1 cursor-pointer mb-4"
                onClick={() => setCurrentEvent(null)}
              >
                <IoIosArrowBack className="text-secondary text-xl" />
                <span className="text-secondary text-sm font-medium font-outfit">Back</span>
              </div>
              <img
                src={orgLogo}
                className='hidden rounded-full md:flex w-[2.5rem] mr-10'
                alt=''
              />
            </div>
          )}
          {currentEvent === null && (
            <img
              src={orgLogo}
              className='hidden rounded-full md:flex w-[2.5rem] mr-10'
              alt=''
            />
          )}
        </div>

        {!currentEvent ? (
          <>
            <div className="justify-center mb-5 hidden md:flex">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light font-outfit text-gray-800">
                Event Overview
              </h1>
            </div>

            {/* Search & Buttons */}
            <div className="flex flex-col w-[90%] md:w-full items-center md:items-start justify-between gap-4 mb-8">
              {/* Search bar */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search events by name or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Action buttons */}
              <div className="flex flex-row w-full gap-3 items-center lg:w-[80%] xl:w-[70%] lg:justify-between overflow-x-auto hide-scrollbar text-sm">
                {["All Events", "Upcoming", "Ongoing", "Done"].map((cat) => (
                  <button
                    key={cat}
                    className={`${selectedCategory === cat
                      ? `bg-secondary text-white`
                      : `border-1 border-secondary text-secondary`
                      } whitespace-nowrap px-4 lg:px-7 xl:px-10 py-2 rounded-full hover:bg-secondary/80 hover:text-white font-outfit shadow cursor-pointer`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <Link
                to={`/org/${userCode}/create-event`}
                className='bg-secondary text-center text-white mt-8 w-full py-3 rounded-lg font-outfit md:self-start md:w-auto md:px-5 cursor-pointer hover:bg-secondary/80 hover:text-white'
              >
                Create New Event
              </Link>
            </div>

            {/* Event Cards */}
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-8 w-[95%] lg:w-full'>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, i) => (
                  <EventCard
                    key={i}
                    eventPoster={event.event_poster}
                    eventStatus={getEventStatus(event)}
                    eventStatusColor={getStatusColor(getEventStatus(event))}
                    eventName={event.title}
                    eventDate={formatEventDateTime(event.start_date, event.start_time, event.end_date, event.end_time)}
                    eventLocation={event.venue_name}
                    eventAttendees={event.attendees}
                    ticketTypes={event.ticket_types}
                    eventCode={event.event_code}
                    setEventCode={event.event_code}
                    fetchEventDetails={fetchEventDetails}
                    selected={event}
                    fetchAttendees={fetchAttendees}
                  />
                ))
              ) : (
                <p className="text-gray-500">No events match your search or category.</p>
              )}
            </div>
          </>
        ) : (
          <div className='flex w-full flex-col'>            

            {/* Search & Buttons */}
            <div className="flex flex-col md:w-full items-center justify-between gap-4 mb-5 mt-5">              

              {/* Action buttons */}
              <div className="flex flex-row w-full gap-5 justify-center items-center overflow-x-auto hide-scrollbar text-sm">
                {["Dashboard", "Transactions", "Attendees"].map((cat) => (
                  <button
                    key={cat}
                    className={`${selectedPage === cat
                      ? `bg-secondary text-white`
                      : `border-1 border-secondary text-secondary`
                      } whitespace-nowrap px-4 lg:px-7 xl:px-10 py-2 rounded-full hover:bg-secondary/80 hover:text-white font-outfit shadow cursor-pointer`}
                    onClick={() => setSelectedPage(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {selectedPage === 'Dashboard' ? (
              <EventDashboard />
            ) : selectedPage === 'Transactions' ? (
              <EventTransactions transactions={transactions} setAttendees={setAttendees} setTransactions={setTransactions} setSelectedTransaction={setSelectedTransaction} filteredTransactions={filteredTransactions} loadingTransac={loadingTransac} searchTransactions={searchTransactions} setSearchTransactions={setSearchTransactions} currentEvent={currentEvent} />
            ) : (
              <EventAttendees attendeeList={attendees} fetchAttendees={fetchAttendees} currentEvent={currentEvent} setSearchAttendees={setSearchAttendees} searchAttendees={searchAttendees} attendees={attendees} setAttendees={setAttendees} setSelectedAttendee={setSelectedAttendee}
                loadingAttendees={loadingAttendees} filteredAttendees={filteredAttendees} />
            )}
          </div>
        )}

        {/* ATTENDEE MODAL */}
        {selectedAttendee && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] font-outfit lg:justify-end lg:items-start">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md h-auto lg:h-screen flex flex-col">
              {/* Header */}
              <div className="relative flex items-center justify-center px-4 py-3 border-b border-gray-200 bg-gray-500">
                <h2 className="text-base font-semibold text-white">Attendee Information</h2>
                <button
                  onClick={() => setSelectedAttendee(null)}
                  className="absolute right-4 text-gray-200 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-4 divide-y divide-gray-200 text-sm">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Reference Code</span>
                    <span className="text-gray-800 font-medium">{selectedAttendee.attendee_code}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Registration Date</span>
                    <span className="text-gray-800 font-medium">
                      {new Date(selectedAttendee.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Name</span>
                    <span className="text-gray-800 font-medium">{selectedAttendee.fullName}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-800 font-medium">{selectedAttendee.email}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Ticket Type</span>
                    <span className="text-gray-800 font-medium">{selectedAttendee.ticket_read?.ticket_name}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Check-in Time</span>
                    <span className="text-gray-800 font-medium">
                      {selectedAttendee.attendance?.check_in_time
                        ? new Date(selectedAttendee.attendance.check_in_time).toLocaleString()
                        : ''}
                    </span>
                  </div>
                </div>

                {selectedAttendee.responses?.length > 0 && (
                  <div className="px-6 py-4">
                    <h3 className="text-gray-700 font-semibold mb-2">Responses</h3>
                    <ul className="space-y-2">
                      {selectedAttendee.responses.map((resp, idx) => (
                        <li key={idx} className="border-b pb-2">
                          <p className="text-gray-500 text-sm">{resp.question?.question_text}</p>
                          <p className="text-gray-800 font-medium">{resp.response_value || "No response"}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sticky Footer */}
              <div className="border-t border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 text-sm">
                  <span className="text-gray-600">Ticket Link:</span>
                  <button
                    className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                    onClick={() =>
                      window.open(selectedAttendee.ticket_qr_data)
                    }
                  >
                    <span>URL</span>
                    <MdContentCopy className="text-lg" />
                  </button>
                </div>
                <div className="w-full h-6 bg-gray-500"></div>
              </div>
            </div>
          </div>
        )}


        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] font-outfit lg:justify-end lg:items-start">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md h-auto lg:h-screen flex flex-col">
              {/* Header */}
              <div className="relative flex items-center justify-center px-4 py-3 border-b border-gray-200 bg-gray-500">
                <h2 className="text-base font-semibold text-white">Transaction Information</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="absolute right-4 text-gray-200 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className='flex flex-col text-sm mt-5'>
                  <div className="flex justify-between py-2 px-6">
                    <span className="text-gray-500">Transaction Code</span>
                    <span className="text-gray-800 font-medium">{selectedTransaction.payment_ref}</span>
                  </div>
                  <div className="flex justify-between py-2 px-6">
                    <span className="text-gray-500">Transaction Date</span>
                    <span className="text-gray-800 font-medium">{new Date(selectedTransaction.created_at).toLocaleDateString("en-US", {
                      month: "short",  // Aug
                      day: "numeric",  // 31
                      year: "numeric", // 2025
                    })}{" "}
                      {new Date(selectedTransaction.created_at).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true, // 5:10 pm
                      }).toLowerCase()}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 px-6 mb-5">
                    <span className="text-gray-500">Status</span>
                    <span className={`${selectedTransaction.status === 'Pending' ?
                      'text-gray-500' :
                      selectedTransaction.status === 'Success' ? 'text-green-600' :
                        'text-red-500'
                      } text-gray-800 font-medium`}>{selectedTransaction.status}</span>
                  </div>                  
                </div>                
              </div>

              {/* Sticky Footer */}
              <div className="border-t border-gray-200">
                {groupTickets(selectedTransaction.attendees)?.map(([ticketName, info], idx) => (
                    <div key={idx} className="flex justify-between py-2 px-6">
                      <span className="text-gray-800 font-medium">
                        {ticketName} <span className="text-gray-500">x{info.count}</span>
                      </span>
                      <span className="text-gray-600">
                        ₱{info.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {/* Show grand total */}
                  <div className="flex justify-between py-2 px-6 border-t mt-2 pt-2 font-semibold">
                    <span>Total</span>
                    <span>₱{selectedTransaction.amount}</span>
                  </div>
                <div className="flex items-center justify-between px-6 py-4 text-sm">
                  <span className="text-gray-600">Print Tickets:</span>
                  <button
                    className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                    onClick={() =>
                      window.open(`/transaction/${selectedTransaction.payment_ref}/`)
                    }
                  >
                    <span>URL</span>
                    <MdContentCopy className="text-lg" />
                  </button>
                </div>
                <div className="w-full h-6 bg-gray-500"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Chatbot />
    </div>
  );
};

export default OrganizerEvent;
