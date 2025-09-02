import React, { useEffect, useRef, useState } from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { IoCalendarClearOutline, IoLocationOutline, IoLink } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import api from "../api.js";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { toast } from "react-toastify";
import { RiQrScan2Line } from "react-icons/ri";
import { Scanner } from '@yudiel/react-qr-scanner';

export default function Ticket() {
  const componentRef = useRef();
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  // Corrected handleDecode function to properly handle the result object
  const handleDecode = (result) => {
    if (result && result.length > 0) {
      const scannedValue = result[0].rawValue; // Correctly access the rawValue property
      setScanning(false);
      window.location.href = scannedValue;
    }
  };

  const [attendee, setAttendee] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [ticketType, setTicketType] = useState(null);
  const { attendeeCode } = useParams();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${attendeeCode}-booking-confirmation`,
  });

  const [isOrganizer, setIsOrganizer] = useState(false);
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const { isLoggedIn, userCode, userRole } = useAuth();

  useEffect(() => {
    if (isLoggedIn && userRole === 'organizer' && eventDetails?.created_by === userCode) {
      setIsOrganizer(true);
    } else {
      setIsOrganizer(false);
    }
  }, [isLoggedIn, userRole, userCode, eventDetails?.created_by]);

  useEffect(() => {
    api.get(`/attendees/booking-info/${attendeeCode}/`)
      .then(res => {
        setAttendee(res.data);
        setEventDetails(res.data.event_details);
        setTicketType(res.data.ticket_read);
        setAttendanceDetails(res.data.attendance);
        console.log(res.data)
      })
      .catch(err => console.error("Error fetching attendee:", err));
  }, [attendeeCode]);

  function formatEventDateTime(startDate, startTime, endDate, endTime) {
    if (!startDate || !startTime) return "TBA";
    const start = new Date(`${startDate}T${startTime}`);
    const end = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
    if (!end || start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString("en-US", optionsDate)} at ${start.toLocaleTimeString("en-US", optionsTime)}${end ? ` - ${end.toLocaleTimeString("en-US", optionsTime)}` : ""}`;
    } else {
      return `${start.toLocaleDateString("en-US", optionsDate)}, ${start.toLocaleTimeString("en-US", optionsTime)} - ${end.toLocaleDateString("en-US", optionsDate)}, ${end.toLocaleTimeString("en-US", optionsTime)}`;
    }
  }

  function formatEventDateTime1(startDate, startTime, endDate, endTime) {
    if (!startDate || !startTime) return "TBA";
    const start = new Date(`${startDate}T${startTime}`);
    const end = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;
    const optionsDate = { year: "numeric", month: "numeric", day: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
    if (!end || start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString("en-US", optionsDate)} at ${start.toLocaleTimeString("en-US", optionsTime)}${end ? ` - ${end.toLocaleTimeString("en-US", optionsTime)}` : ""}`;
    } else {
      return `${start.toLocaleDateString("en-US", optionsDate)}, ${start.toLocaleTimeString("en-US", optionsTime)} - ${end.toLocaleDateString("en-US", optionsDate)}, ${end.toLocaleTimeString("en-US", optionsTime)}`;
    }
  }

  function formatPurchaseDate(datetimeString) {
    if (!datetimeString) return "TBA";
    const date = new Date(datetimeString);
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
    return `${date.toLocaleDateString("en-US", optionsDate)} ${date.toLocaleTimeString("en-US", optionsTime)}`;
  }

  function formatEventDateRange(startDate, endDate) {
    if (!startDate) return "TBA";
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    const options = { year: "numeric", month: "short", day: "numeric" };
    if (!end || start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("en-US", options);
    }
    return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
  }

  function formatEventTimeRange(startTime, endTime) {
    if (!startTime) return "TBA";
    const today = new Date().toISOString().split("T")[0]; // dummy date
    const start = new Date(`${today}T${startTime}`);
    const end = endTime ? new Date(`${today}T${endTime}`) : null;
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    return `${start.toLocaleTimeString("en-US", options)}${end ? ` - ${end.toLocaleTimeString("en-US", options)}` : ""}`;
  }

  const handleCheckIn = async () => {
    try {
      const response = await api.post(`/attendees/check-in/`, { attendee_code: attendeeCode, user_code: userCode });
      toast.success('Check-in successful!');
      setAttendanceDetails(response.data);
    } catch (err) {
      console.error("Error during check-in:", err);
      toast.error('Check-in failed. Please try again.');
    }
  };


  return (
    <>
      {scanning && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
          <p className="text-white mb-4">Scan a QR Code</p>
          <div className="w-80 h-80 bg-white rounded-lg overflow-hidden">
            <Scanner onScan={handleDecode} onError={(err) => console.error("Scanner error:", err)} allowMultiple />
          </div>
          <button
            onClick={() => setScanning(false)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 flex flex-col items-center gap-6 p-4">
        {/* Logo Section */}
        <div className="w-full max-w-4xl flex justify-center mb-6 px-4 sm:px-0">
          <div className="flex flex-row w-full items-center justify-between rounded-lg">
            <img className="w-[30%] md:w-[20%] cursor-pointer" onClick={() => navigate(`/`)} src="https://ik.imagekit.io/cafedejur/sari-sari-events/sariLogo.svg?updatedAt=1753510696909" alt="" />
            <div className="flex items-center space-x-2">
              {isOrganizer && (
                <>
                  <button
                    onClick={handleCheckIn}
                    disabled={attendanceDetails?.check_in_time}
                    className={`px-4 py-2 rounded-lg font-outfit text-sm shadow 
          ${attendanceDetails?.check_in_time
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-teal-700"}`}
                  >
                    {attendanceDetails?.check_in_time
                      ? `Checked in at ${new Date(attendanceDetails.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : "Check In"}
                  </button>
                  <button onClick={() => setScanning(!scanning)} className="outline-none"><RiQrScan2Line className="text-secondary text-2xl cursor-pointer" /></button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 w-full max-w-6xl px-4 sm:px-0">
          {/* Left Card: Event Banner */}
          <div className="bg-white rounded-2xl shadow-lg w-full lg:w-1/3 p-4 sm:p-6">
            <div className="w-full aspect-video sm:h-44 bg-gray-200 flex items-center justify-center object-cover rounded-lg mb-4">
              <img src={eventDetails?.event_poster} className="w-full" alt="" />
            </div>
            <h2 className="text-lg sm:text-xl font-outfit font-semibold mb-2">{eventDetails?.title}</h2>
            <p className="text-gray-600 mb-4 font-outfit text-sm sm:text-base">
              {eventDetails?.description}
            </p>
            <div className="flex items-center font-outfit text-xs sm:text-sm text-gray-500 space-x-2">
              <IoCalendarClearOutline size={16} />
              <span>{formatEventDateTime(eventDetails?.start_date, eventDetails?.start_time, eventDetails?.end_date, eventDetails?.end_time)}</span>
            </div>

            {eventDetails?.event_type !== 'virtual' ? (
              <div className="flex items-center text-xs font-outfit sm:text-sm text-gray-500 space-x-2 mt-1">
                <IoLocationOutline size={16} />
                <span>{eventDetails?.venue_specific !== null && eventDetails?.venue_specific !== '' ? eventDetails?.venue_specific + ', ' : ''}{eventDetails?.venue_address}</span>
              </div>
            ) : (
              <div className="flex items-center text-xs font-outfit sm:text-sm text-gray-500 space-x-2 mt-1">
                <IoLink size={16} />
                <span>{eventDetails?.meeting_platform} - {eventDetails?.meeting_link}</span>
              </div>
            )}
          </div>

          {/* Right Card: Event Confirmation / Ticket */}
          <div className="bg-white rounded-2xl shadow-lg w-full lg:w-2/3 flex flex-col">
            {/* Header Section */}
            <div className="bg-gray-300 border-b border-dashed px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl flex flex-row items-center justify-between flex-wrap">
              <div>
                <h2 className="text-md sm:text-lg font-outfit font-semibold text-gray-800">
                  {eventDetails?.title}
                </h2>
                <p className="text-xs sm:text-sm font-outfit text-gray-500">
                  {eventDetails?.category
                    ? eventDetails.category.charAt(0).toUpperCase() + eventDetails.category.slice(1)
                    : ""}
                  {" "}Event
                </p>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <p className="text-[10px] font-outfit sm:text-xs uppercase tracking-wide text-gray-500">
                  Ticket Confirmed
                </p>
                <p className="text-sm sm:text-lg font-outfit font-semibold text-secondary">
                  {ticketType?.ticket_name} Access
                </p>
              </div>
            </div>

            {/* Event Details + QR */}
            <div className="flex flex-col lg:flex-row">
              {/* QR Section */}
              <div className="order-1 lg:order-2 flex-1 p-4 sm:p-6 flex flex-col items-center justify-start">
                <div className="flex flex-col items-center w-full">
                  <div className="w-32 sm:w-40 h-32 sm:h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                    <img src={attendee?.ticket_qr_image} className="w-full" alt="" />
                  </div>
                  <p className="text-xs font-outfit sm:text-sm text-gray-500 mt-4 text-center">
                    Scan this code at Entrance Venue <br />
                    <span className="inline-flex items-center space-x-1">
                      <CiSaveDown2 size={14} className="text-gray-500" />
                      <span>QR Scanner Required</span>
                    </span>
                  </p>
                  <div className="w-full border-b border-dashed border-gray-400 mt-6"></div>
                  <p className="text-xs font-outfit sm:text-sm text-gray-400 mt-2">
                    Purchased on {formatPurchaseDate(attendee?.created_at)}
                  </p>
                  {/* Desktop button only */}
                  <div className="mt-4 w-full hidden sm:flex justify-center">
                    <button
                      type="button"
                      className="bg-teal-600 font-outfit text-white px-4 sm:px-6 py-2 rounded-lg shadow hover:bg-teal-700 transition text-sm sm:text-base flex items-center gap-2 cursor-pointer"
                      onClick={handlePrint}
                    >
                      <CiSaveDown2 size={18} /> Download as PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile horizontal line above Event Details */}
              <div className="block lg:hidden w-full border-t border-dashed border-gray-400 mb-4"></div>

              {/* Left: Event Details */}
              <div className="order-2 lg:order-1 flex-1 p-4 sm:p-6 border-dashed border-gray-400 lg:border-r flex flex-col">
                <h3 className="text-center font-outfit text-xl sm:text-2xl font-semibold mb-6">
                  Event Details
                </h3>
                <div className="space-y-6 sm:space-y-10 text-xs sm:text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium font-outfit text-gray-700">Date:</span>
                    <span>{formatEventDateRange(eventDetails?.start_date, eventDetails?.end_date)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium font-outfit text-gray-700">Time:</span>
                    <span>{formatEventTimeRange(eventDetails?.start_time, eventDetails?.end_time)}</span>
                  </div>
                  {eventDetails?.event_type !== 'virtual' && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium font-outfit text-gray-700">Venue:</span>
                      <span className="text-right">{eventDetails?.venue_name}, {eventDetails?.venue_specific}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium font-outfit text-gray-700">Reference Code:</span>
                    <span>{attendee?.attendee_code}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Ticket Holder:</span>
                    <span>{attendee?.fullName}</span>
                  </div>
                  <div className="flex flex-col border-b pb-3">
                    <span className="font-medium font-outfit">Price:</span>
                    <div className="text-right">
                      <p className="text-gray-500 text-xs font-outfit sm:text-sm">Standard</p>
                      <p className="font-semibold">{ticketType?.price === 0 || ticketType?.price === '0.00' ? 'Free' : ticketType?.price}</p>
                    </div>
                  </div>
                  {/* Rules */}
                  <ul className="pt-4 font-outfit text-gray-500 list-disc list-inside space-y-1 text-xs sm:text-sm">
                    <li>Present this ticket upon entry</li>
                    <li>No refunds or exchange</li>
                    <li>Don't lose this ticket</li>
                  </ul>
                  {/* Mobile button below rules */}
                  <div className="mt-4 w-full sm:hidden flex justify-center">
                    <button
                      type="button"
                      className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 transition text-sm flex items-center gap-2 cursor-pointer"
                      onClick={handlePrint}
                    >
                      <CiSaveDown2 size={18} /> Download as PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

{/* Printing page layout (vertical ticket style) */}
<div
  ref={componentRef}
  className="bg-white w-full hidden print:flex justify-start items-start p-4 font-outfit"
>
  {/* Outer Dashed Border for Cut-out */}
  <div className="p-6 border-2 border-dashed border-[#D9D9D9] rounded-xl inline-block">
  
    {/* Ticket Wrapper */}
    <div className="w-[280px] border-2 border-[#D9D9D9] rounded-lg shadow-md overflow-hidden text-center font-outfit">
      {/* Header: Poster + Logo */}
      <div className="bg-Dark-grayish-blue p-3 flex justify-between items-center">
        {/* Event Poster */}
        <img
          src={eventDetails?.event_poster}
          alt="Event Poster"
          className="w-28 h-16 object-cover rounded"
        />

        {/* Logo Placeholder */}
        <div className="w-12 h-12 flex items-center justify-center border rounded bg-white">
          <img
            src="https://placehold.co/48x48/png"
            alt="Logo Placeholder"
            className="w-8 h-8 object-contain"
          />
        </div>
      </div>

      {/* Event Title Bar */}
      <div className="bg-Dark-grayish-blue text-white py-3 border-t border-dashed border-white">
        <h2 className="text-sm font-outfit font-bold text-center">
          {eventDetails?.title}
        </h2>
        <p className="text-[15px] font-outfit text-center">
          {eventDetails?.category
            ? eventDetails.category.charAt(0).toUpperCase() +
              eventDetails.category.slice(1)
            : ""}{" "}
          1st PVHAI Golf Tournament
        </p>

        {/* Broken Line Separator */}
        <div className="border-t border-dashed border-white my-2 w-full"></div>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center p-4">
        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
          <img
            src={attendee?.ticket_qr_image}
            alt="QR Code"
            className="w-full"
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-2">
          {attendee?.attendee_code}
        </p>
        <p className="text-[10px] text-gray-900 mt-1">
          {formatPurchaseDate(attendee?.created_at)}
        </p>
      </div>

                <p className="text-xs font-outfit text-gray-400 mt-2">
      {/* Attendee Details */}
      <div className="px-4">
        <p className="font-semibold font-outfit text-gray-800">
          {attendee?.fullName}
        </p>
        <p className="text-[50px] text-gray-500">
          {ticketType?.ticket_name} Access
        </p>
      </div>

      {/* Footer (same as top color) */}
      <div className="bg-Dark-grayish-blue font-outfit text-white text-[20px] py-2 mt-3">
        <p>{eventDetails?.sub_event || "Event Category Here"}</p>
      </div>
    </div>
  </div>

  {/* Footer: QR Data Link */}
  <div className="mt-2 text-xs text-gray-500">
    <Link to={`/attendee/${attendee?.attendee_code}`} target="_blank">
      {attendee?.ticket_qr_data}
    </Link>
  </div>
</div>


    </>
  );
}