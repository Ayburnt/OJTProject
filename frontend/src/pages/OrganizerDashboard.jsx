import React, { useEffect, useState } from 'react';
import OrganizerNav from '../components/OrganizerNav';
import { CgProfile } from 'react-icons/cg';
import { Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import Chatbot from '../pages/Chatbot';
import api from '../api.js'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';


function OrganizerDashboard() {
  const { isLoggedIn, userCode, userFirstName, userRole, orgLogo } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalAttendees: 0,
    totalEvents: 0,
    upcomingEvents: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [attendeesData, setAttendeesData] = useState([]);



  useEffect(() => {
    if (!userRole) return;
    const fetchEventDetails = async () => {
      if (userRole === 'organizer') {
        try {
          const res = await api.get(`/list-create/`);
          const events = res.data;

          // Compute stats
          let totalRevenue = 0;
          let totalAttendees = 0;
          let upcomingEvents = 0;

          events.forEach(event => {
            // attendees = total - available for each ticket
            const attendees = event.ticket_types.reduce(
              (sum, t) => sum + (t.quantity_total - t.quantity_available),
              0
            );

            // revenue = sum of (sold tickets × price)
            const revenue = event.ticket_types.reduce(
              (sum, t) => sum + (t.price * (t.quantity_total - t.quantity_available)),
              0
            );

            totalAttendees += attendees;
            totalRevenue += revenue;

            // Check upcoming events
            const now = new Date();
            const start = new Date(`${event.start_date}T${event.start_time}`);
            if (event.status === "published" && now < start) {
              upcomingEvents += 1;
            }
          });

          setStats({
            totalRevenue,
            totalAttendees,
            totalEvents: events.length,
            upcomingEvents,
          });

          setEvents(events);
          console.log(events);
        } catch (err) {
          console.error("Error fetching events:", err);
        }
      } else {
        try {
          const res = await api.get(`/list-create/co-org/`);
          const events = res.data;

          // Compute stats
          let totalRevenue = 0;
          let totalAttendees = 0;
          let upcomingEvents = 0;

          events.forEach(event => {
            // attendees = total - available for each ticket
            const attendees = event.ticket_types.reduce(
              (sum, t) => sum + (t.quantity_total - t.quantity_available),
              0
            );

            // revenue = sum of (sold tickets × price)
            const revenue = event.ticket_types.reduce(
              (sum, t) => sum + (t.price * (t.quantity_total - t.quantity_available)),
              0
            );

            totalAttendees += attendees;
            totalRevenue += revenue;

            // Check upcoming events
            const now = new Date();
            const start = new Date(`${event.start_date}T${event.start_time}`);
            if (event.status === "published" && now < start) {
              upcomingEvents += 1;
            }
          });

          setStats({
            totalRevenue,
            totalAttendees,
            totalEvents: events.length,
            upcomingEvents,
          });

          setEvents(events);
          console.log(events);
        } catch (err) {
          console.error("Error fetching events:", err);
        }
      }

    };

    fetchEventDetails();
  }, [userRole]);

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


  useEffect(() => {
    document.title = "Organizer Dashboard | Sari-Sari Events";
  }, []);

  // Use a useEffect hook to prepare and set chart data when events change
  useEffect(() => {
    // Prepare revenue data for the chart
    const newRevenueData = events.map(event => ({
      name: event.title,
      revenue: event.ticket_types.reduce(
        (sum, t) => sum + (t.price * (t.quantity_total - t.quantity_available)),
        0
      )
    }));
    setRevenueData(newRevenueData);

    // Prepare attendees data for the chart
    const newAttendeesData = events.map(event => ({
      name: event.title,
      attendees: event.ticket_types.reduce(
        (sum, t) => sum + (t.quantity_total - t.quantity_available),
        0
      )
    }));
    setAttendeesData(newAttendeesData);

  }, [events]); // This effect will re-run whenever the `events` state changes

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
              {orgLogo && <img src={orgLogo} alt="User Profile" className="h-8 w-8 lg:w-10 lg:h-10 hidden md:flex aspect-square rounded-full object-cover" />}
            </>
          ) : (
            <CgProfile className='hidden md:flex text-[2rem]' />
          )}
        </header>

        {/* Statistic Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center h-28">
            <h3 className="text-base font-medium text-gray-700">Total Revenue</h3>
            <p className="text-2xl font-bold text-teal-600">
              ₱{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center h-28">
            <h3 className="text-base font-medium text-gray-700">Total Attendees</h3>
            <p className="text-2xl font-bold text-teal-600">
              {stats.totalAttendees.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center h-28">
            <h3 className="text-base font-medium text-gray-700">Total Events Created</h3>
            <p className="text-2xl font-bold text-teal-600">
              {stats.totalEvents}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center h-28">
            <h3 className="text-base font-medium text-gray-700">Upcoming Events</h3>
            <p className="text-2xl font-bold text-teal-600">
              {stats.upcomingEvents}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Revenue per Event */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue per Event</h3>
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attendees Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold">Attendees per Event</h3>
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={attendeesData}
                  dataKey="attendees"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#14b8a6"
                  label
                >
                  {attendeesData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#14b8a6", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>



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

                  <Link
                    key={i}
                    to={`/events/${event.event_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border p-5 rounded-lg flex justify-between items-center text-gray-400 hover:bg-gray-100 transition"
                  >
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
                  </Link>
                )
              })
            ) : (
              <div className="border p-10 rounded-lg h-20 flex items-center justify-center text-gray-400 font-outfit">
                <span>No upcoming events</span>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Include the Chatbot component here */}
      <Chatbot />
    </div>
  );
}

export default OrganizerDashboard;