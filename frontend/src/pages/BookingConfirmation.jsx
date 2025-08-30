import React, { useEffect, useRef, useState } from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import api from "../api.js";
import { useParams, Link } from "react-router-dom";

export default function Ticket() {
  const componentRef = useRef();  

  const [attendee, setAttendee] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [ticketType, setTicketType] = useState(null);
  const {attendeeCode} = useParams();
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // Changed from 'content' to 'contentRef'
    documentTitle: `${attendeeCode}-booking-confirmation`,
  });
  useEffect(() => {
    api.get(`/attendees/booking-info/${attendeeCode}/`)
      .then(res => {
        setAttendee(res.data);
        setEventDetails(res.data.event_details);
        setTicketType(res.data.ticket_read);
        console.log("Attendee data:", res.data);
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
            // Single-day event
            return `${start.toLocaleDateString("en-US", optionsDate)} at ${start.toLocaleTimeString("en-US", optionsTime)}${end ? ` - ${end.toLocaleTimeString("en-US", optionsTime)}` : ""}`;
        } else {
            // Multi-day event
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
            // Single-day event
            return `${start.toLocaleDateString("en-US", optionsDate)} at ${start.toLocaleTimeString("en-US", optionsTime)}${end ? ` - ${end.toLocaleTimeString("en-US", optionsTime)}` : ""}`;
        } else {
            // Multi-day event
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


  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center gap-6 p-4">
        {/* Logo Section */}
        <div className="w-full max-w-4xl flex justify-center mb-6 px-4 sm:px-0">
          <div className="w-40 h-16 sm:w-48 sm:h-20 bg-gray-300 flex items-center justify-center rounded-lg">
            <span className="text-gray-500 text-sm sm:text-base">Logo Placeholder</span>
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
            <div className="flex items-center text-xs font-outfit sm:text-sm text-gray-500 space-x-2 mt-1">
              <IoLocationOutline size={16} />
              <span>{eventDetails?.venue_specific !== null && eventDetails?.venue_specific !== '' ? eventDetails?.venue_specific + ', ' : ''}{eventDetails?.venue_address}</span>
            </div>
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
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium font-outfit text-gray-700">Venue:</span>
                    <span className="text-right">{eventDetails?.venue_name}, {eventDetails?. venue_specific}</span>
                  </div>
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


      {/* Printing page layout */}
      <div ref={componentRef} className="bg-white w-full items-center hidden justify-center p-6 print:flex flex-col">
        <div className="font-outfit grid grid-cols-3 w-[95%] font-semibold text-sm">
          <p>{formatEventDateTime1(eventDetails?.start_date, eventDetails?.start_time, eventDetails?.end_date, eventDetails?.end_time)}</p>
          <p className="cols-span-2">Ticket | {eventDetails?.title}</p>
        </div>
        <div className="flex flex-col border border-gray-300 shadow-sm py-5 px-3 w-[95%] rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-300 border border-gray-600 rounded-xl grid grid-cols-3 p-3">
            <div className="aspect-video object-cover rounded-lg overflow-hidden col-span-1 flex items-center justify-start">
              <img src={eventDetails?.event_poster} alt="" className="object-cover rounded-lg" />
            </div>
            <div className="ml-3">
              <h2 className="text-md sm:text-lg font-outfit font-semibold text-gray-800">
                {eventDetails?.title}
              </h2>
              <p className="text-xs sm:text-sm font-outfit text-gray-500">{eventDetails?.category
    ? eventDetails.category.charAt(0).toUpperCase() + eventDetails.category.slice(1)
    : ""}
  {" "}Event</p>
            </div>
            <div className="text-right mt-2 sm:mt-0 place-items-end self-end justify-self-end">
              <p className="text-[10px] font-outfit sm:text-xs uppercase tracking-wide text-gray-500">
                Ticket Confirmed
              </p>
              <p className="text-sm sm:text-lg font-outfit font-semibold text-secondary">
                {ticketType?.ticket_name} Access
              </p>
            </div>
          </div>

          {/* Event Details + QR */}
          <div className="flex flex-row border border-gray-500 rounded-xl font-outfit shadow-lg">

            {/* Left: Event Details */}
            <div className="flex flex-col w-1/2 p-4 border-dashed border-gray-400 border-r flex flex-col">
              <h3 className="text-center font-outfit text-lg font-semibold mb-3">
                Event Details
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium font-outfit text-gray-700">Date:</span>
                  <span>{formatEventDateRange(eventDetails?.start_date, eventDetails?.end_date)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium font-outfit text-gray-700">Time:</span>
                  <span>{formatEventTimeRange(eventDetails?.start_time, eventDetails?.end_time)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium font-outfit text-gray-700">Venue:</span>
                  <span className="text-right">{eventDetails?.venue_name}, {eventDetails?.venue_specific}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium font-outfit text-gray-700">Reference Code:</span>
                  <span>{attendee?.attendee_code}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-700">Ticket Holder:</span>
                  <span>{attendee?.fullName}</span>
                </div>
                <div className="flex flex-col border-b">
                  <div className="w-full flex justify-between">
                    <span className="font-medium font-outfit leading-none">Price:</span>
                    <p className="text-gray-500 text-xs font-outfit">{ticketType?.ticket_name}</p>
                  </div>
                  <p className="font-semibold w-full text-right text-lg">{ticketType?.price === 0 || ticketType?.price === '0.00' ? 'Free' : ticketType?.price}</p>
                </div>
                {/* Rules */}
                <ul className="pt-2 font-outfit text-gray-500 list-disc list-inside text-xs">
                  <li>Present this ticket upon entry</li>
                  <li>No refunds or exchange</li>
                  <li>Don't lose this ticket</li>
                </ul>
              </div>
            </div>



            {/* QR Section */}
            <div className="flex flex-col items-center justify-center w-1/2 p-4">
              <div className="flex flex-col items-center w-full justify-center">
                <div className="w-[70%] aspect-square object-contain bg-gray-200 flex items-center justify-center rounded-lg">
                  <img src={attendee?.ticket_qr_image} alt="" />
                </div>
                <p className="text-xs font-outfit text-gray-500 mt-3 text-center">
                  Scan this code at Entrance Venue <br />
                  <span className="inline-flex items-center space-x-1">
                    <CiSaveDown2 size={14} className="text-gray-500" />
                    <span>QR Scanner Required</span>
                  </span>
                </p>
                <div className="w-full border-b border-dashed border-gray-400 mt-4"></div>
                <p className="text-xs font-outfit text-gray-400 mt-2">
                  Purchased on {formatPurchaseDate(attendee?.created_at)}
                </p>
              </div>
            </div>

          </div>

        </div>

        <div className="font-outfit grid grid-cols-1 w-[95%] font-semibold text-sm">
          <Link 
  to={`/attendee/${attendee?.attendee_code}`} 
  target="_blank"
>
  {attendee?.ticket_qr_data}
</Link>

        </div>
      </div>
    </>
  );
}