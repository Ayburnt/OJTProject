import React, { useEffect, useState } from 'react';
import OrganizerNav from '../components/OrganizerNav';
import { CgProfile } from 'react-icons/cg';
import { Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import Chatbot from '../pages/Chatbot'; // Import the new Chatbot component
import api from '../api.js'

function OrganizerDashboard() {
  const { isLoggedIn, userCode, userFirstName, userProfile } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {

      try {
        const res = await api.get(`/list-create/`);
        console.log(res.data);
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);

      }
    }

    fetchEventDetails();
  }, []);

  function formatDateTime(dateStr, timeStr) {
    const dt = new Date(`${dateStr}T${timeStr}`); // combine date + time
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",   // full month name
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,    // 12-hour format with AM/PM
    }).format(dt);
  }



  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-primary font-outfit text-gray-800 overflow-hidden">
      {/* Organizer Navigation - visible on all screen sizes */}
      <OrganizerNav />

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 mt-16 md:mt-0 md:ml-64 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center bg-white rounded-xl p-4 mb-6 shadow">
          <div className="w-full flex flex-col items-center text-center">
            <h2 className="text-lg sm:text-2xl text-secondary font-outfit">
              Good Morning, <span className="font-semibold">{userFirstName}</span>
            </h2>

            <p className="text-sm text-gray-500">
              Here's what's happening with your events today.
            </p>
          </div>

          {isLoggedIn ? (
            <>
              {userProfile && <img src={userProfile} alt="User Profile" className="h-8 w-8 lg:w-10 lg:h-10 hidden md:flex aspect-square rounded-full object-cover" />}
            </>
          ) : (
            <CgProfile className='hidden md:flex text-[2rem]' />
          )}
        </header>

        {/* Statistic Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {["Total Revenue", "Total Attendees", "Total Events Created", "Upcoming Events"].map((label, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center text-center h-28"
            >
              <h3 className="text-base font-medium text-gray-700">{label}</h3>
            </div>
          ))}
        </div>

        {/* Recent Events */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-6 font-outfit">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h3 className="text-lg font-semibold">Recent Events</h3>
            <Link to={`/org/${userCode}/create-event`}>
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer">
                Create
              </button>
            </Link>
          </div>
          {/* Event Placeholder */}
          <div className="flex flex-col gap-4 font-outfit">
            {Array.isArray(events) && events.length > 0 ? (
              events.map((event, i) => {
              const totalTickets = event.ticket_types.reduce(
                (sum, ticket) => sum + ticket.quantity_total,
                0
              );
              return (

                <div key={i} className="border p-5 rounded-lg flex justify-between items-center text-gray-400">
                  <div className="grid grid-cols-4 place-items-center gap-4">
                    <div className='aspect-square'>
                      <a
                        href={event.event_qr_image}
                        download={`event-${event.event_code}-qr.png`}
                        target='_blank'
                      >
                        <img
                          src={event.event_qr_image}
                          alt="Event QR"
                          className="w-40 h-40 object-contain rounded"
                        />
                      </a>
                    </div>
                    <div className='col-span-3 place-items-start w-full'>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {event.start_date === event.end_date
                          ? `${formatDateTime(event.start_date, event.start_time)} - ${event.end_time}`
                          : `${formatDateTime(event.start_date, event.start_time)} - ${formatDateTime(event.end_date, event.end_time)}`}
                        <br /> • {totalTickets} tickets
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
            ):(
              <p className="text-gray-500">No events available yet.</p>
            )}            

            {/* Placeholder box */}
            <div className="border p-10 rounded-lg h-20 flex items-center justify-center text-gray-400 font-outfit">
              <span>No upcoming events</span>
            </div>
          </div>
        </section>
      </main>

      {/* Include the Chatbot component here */}
      <Chatbot />
    </div>
  );
}

export default OrganizerDashboard;
