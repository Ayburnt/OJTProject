import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import OrganizerNav from "../components/OrganizerNav";
import { FiUsers } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { GoUpload } from "react-icons/go";
import { BsDownload } from "react-icons/bs";
import api from "../api";

const Attendees = () => {
  const { userCode } = useParams();
  const fileInputRef = useRef(null);

  // --- States ---
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const [searchEvents, setSearchEvents] = useState("");

  const [currentEvent, setCurrentEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [searchAttendees, setSearchAttendees] = useState("");
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // --- Fetch events ---
  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        const res = await api.get(`/attendees/organizer-events/${userCode}/`);
        setEvents(res.data || []);
      } catch (err) {
        setEventsError("Failed to fetch events. Check network or Django server.");
        console.error("Error fetching events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchOrganizerEvents();
  }, [userCode]);

  // --- Fetch attendees ---
const fetchAttendees = async (event) => {
  setCurrentEvent(event);
  setLoadingAttendees(true);
  try {
    const res = await api.get(`/attendees/${event.event_code}/`);
    
    // Use res.data directly if it's a list; fallback to res.data.attendees if wrapped
    const attendeesData = Array.isArray(res.data)
      ? res.data
      : res.data.attendees || [];

    setAttendees(attendeesData);
  } catch (err) {
    console.error("Error fetching attendees:", err);
    setAttendees([]); // fallback
  } finally {
    setLoadingAttendees(false);
  }
};

  // --- CSV upload/download ---
  const uploadCsv = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentEvent) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post(
        `/attendees/${currentEvent.event_code}/upload-csv/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert(res.data.message || "CSV uploaded successfully!");
      fetchAttendees(currentEvent);
    } catch (err) {
      console.error("Error uploading CSV:", err);
      alert("Failed to upload CSV.");
    }
  };

  const downloadCsv = async () => {
    if (!currentEvent) return;
    try {
      const res = await api.get(
        `/attendees/${currentEvent.event_code}/export-csv/`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${currentEvent.event_code}_attendees.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading CSV:", err);
    }
  };

  // --- Filters ---
  const filteredEvents = events.filter((event) =>
    (event.title || "").toLowerCase().includes(searchEvents.toLowerCase())
  );

  const filteredAttendees = attendees.filter(
    (a) =>
      a.fullName?.toLowerCase().includes(searchAttendees.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchAttendees.toLowerCase())
  );

  return (
    <div className="bg-alice-blue min-h-screen font-outfit">
      <OrganizerNav />

      <div className="md:ml-64 p-4 md:p-8 lg:p-12 flex flex-col items-center">
        <div className="flex justify-end w-full mb-6">
          <CgProfile className="hidden md:flex text-[2.5rem] text-gray-300 mr-10" />
        </div>

        {!currentEvent ? (
          // --- EVENTS LIST ---
          <div className="w-full max-w-6xl mx-auto">
            {loadingEvents ? (
              <p>Loading events...</p>
            ) : eventsError ? (
              <p className="text-red-500">{eventsError}</p>
            ) : (
              <div className="p-5 md:p-8 lg:p-10 border border-gray-300 rounded-xl shadow bg-white">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                  Manage Event Attendees
                </h1>

                <div className="relative mb-6 w-full lg:w-[75%]">
                  <CiSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search events"
                    value={searchEvents}
                    onChange={(e) => setSearchEvents(e.target.value)}
                    className="w-full pl-10 border-b border-gray-400 focus:border-teal-500 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-4 w-full">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => fetchAttendees(event)}
                        className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 transition cursor-pointer"
                      >
                        <span className="font-medium text-gray-700">
                          {event.title}
                        </span>
                        <div className="flex items-center gap-3 text-gray-600">
                          <span>{event.attendees_count || 0} Attendees</span>
                          <FiUsers className="text-lg" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No events found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          // --- ATTENDEES LIST ---
          <div className="w-full max-w-6xl mx-auto">
            <div
              className="w-full flex items-center justify-start gap-1 cursor-pointer mb-4"
              onClick={() => setCurrentEvent(null)}
            >
              <IoIosArrowBack className="text-secondary text-xl" />
              <span className="text-secondary text-sm font-medium font-outfit">
                Back
              </span>
            </div>

            <div className="p-5 md:p-8 lg:p-10 border border-gray-300 rounded-xl shadow bg-white w-full">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                {currentEvent.title || "Event Attendees"}
              </h1>

              {/* Search + Upload/Download */}
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 w-full">
                <div className="relative w-full lg:max-w-sm">
                  <CiSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search attendees"
                    value={searchAttendees}
                    onChange={(e) => setSearchAttendees(e.target.value)}
                    className="w-full pl-10 border-b border-gray-400 focus:border-teal-500 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </div>

                <div className="w-full flex flex-row gap-2 justify-center md:gap-3 lg:w-auto">
                  <button
                    onClick={downloadCsv}
                    className="w-[48%] md:min-w-[140px] whitespace-nowrap py-2 px-3 text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all flex justify-center items-center gap-2 cursor-pointer"
                  >
                    Download CSV <BsDownload />
                  </button>

                  <button
                    onClick={uploadCsv}
                    className="w-[48%] md:min-w-[140px] whitespace-nowrap py-2 px-3 text-sm bg-primary hover:bg-teal-700 text-secondary font-medium rounded-md transition-all flex justify-center items-center gap-2 cursor-pointer border border-secondary"
                  >
                    Upload CSV <GoUpload />
                  </button>

                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="text-gray-600 text-sm bg-gray-100">
                      <th className="py-3 px-4 font-medium border border-gray-300">
                        Reg.date
                      </th>
                      <th className="py-3 px-4 font-medium border border-gray-300">
                        Name
                      </th>
                      <th className="py-3 px-4 font-medium border border-gray-300">
                        Email
                      </th>
                      <th className="py-3 px-4 font-medium border border-gray-300">
                        Ticket Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendees.length > 0 ? (
                      filteredAttendees.map((a, idx) => (
                        <tr
                          key={a.id}
                          className={`text-sm ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition cursor-pointer`}
                          onClick={() => setSelectedAttendee(a)}
                        >
                          <td className="py-3 px-4 border border-gray-300 text-gray-600">
                            {new Date(a.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 border border-gray-300 text-gray-600">
                            {a.fullName}
                          </td>
                          <td className="py-3 px-4 border border-gray-300 text-gray-600">
                            {a.email}
                          </td>
                          <td className="py-3 px-4 border border-gray-300 text-gray-600">
                            {a.ticket_read?.ticket_name}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-6 text-center text-gray-500 border border-gray-300"
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
        )}

        {/* Attendee Modal */}
        {selectedAttendee && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] font-outfit lg:justify-end lg:items-start">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md h-auto lg:h-screen">
              <div className="relative flex items-center justify-center px-4 py-3 border-b border-gray-200 bg-gray-500">
                <h2 className="text-base font-semibold text-white">
                  Attendee Information
                </h2>
                <button
                  onClick={() => setSelectedAttendee(null)}
                  className="absolute right-4 text-gray-200 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-4 divide-y divide-gray-200 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Registration Date</span>
                  <span className="text-gray-800 font-medium">
                    {new Date(selectedAttendee.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Name</span>
                  <span className="text-gray-800 font-medium">
                    {selectedAttendee.fullName}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-800 font-medium">
                    {selectedAttendee.email}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Ticket Type</span>
                  <span className="text-gray-800 font-medium">
                    {selectedAttendee.ticket_read?.ticket_name}
                  </span>
                </div>
              </div>

              {/* Show responses */}
              {selectedAttendee.responses?.length > 0 && (
                <div className="px-6 py-4">
                  <h3 className="text-gray-700 font-semibold mb-2">
                    Responses
                  </h3>
                  <ul className="space-y-2">
                    {selectedAttendee.responses.map((resp, idx) => (
                      <li key={idx} className="border-b pb-2">
                        <p className="text-gray-500 text-sm">
                          {resp.question?.question_text}
                        </p>
                        <p className="text-gray-800 font-medium">
                          {resp.response_value || "No response"}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between px-6 pb-5 border-t border-gray-200 text-sm">
                <span className="text-gray-600">Ticket Link:</span>
                <button
                  className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                  onClick={() =>
                    window.open(
                      `https://sari-sari.com/ticket/${selectedAttendee.id}`,
                      "_blank"
                    )
                  }
                >
                  <span>URL</span>
                  <MdContentCopy className="text-lg" />
                </button>
              </div>
              <div className="w-full h-6 bg-gray-500"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendees;
