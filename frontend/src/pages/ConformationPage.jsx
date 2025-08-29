import React from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";

export default function Ticket() {
  return (
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
          <div className="w-full h-40 sm:h-44 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
            <span className="text-gray-500 text-sm font-outfit sm:text-base">Event Banner Placeholder</span>
          </div>
          <h2 className="text-lg sm:text-xl font-outfit font-semibold mb-2">HACKANGKONG 2025</h2>
          <p className="text-gray-600 mb-4 font-outfit text-sm sm:text-base">
            Super o,duper mahabang haba ang description neto
          </p>
          <div className="flex items-center font-outfit text-xs sm:text-sm text-gray-500 space-x-2">
               <IoCalendarClearOutline size={16} />
               <span>March 18, 2026, 5:00 PM</span>
          </div>

          <div className="flex items-center text-xs font-outfit sm:text-sm text-gray-500 space-x-2 mt-1">
            <IoLocationOutline size={16} />
            <span>F2 HALL SMX Convention Center Pasay, Manila</span>
          </div>
        </div>

        {/* Right Card: Event Confirmation / Ticket */}
        <div className="bg-white rounded-2xl shadow-lg w-full lg:w-2/3 flex flex-col">

          {/* Header Section */}
          <div className="bg-gray-300 border-b border-dashed px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl flex flex-row items-center justify-between flex-wrap">
            <div>
              <h2 className="text-md sm:text-lg font-outfit font-semibold text-gray-800">
                HACKANGKONG 2025
              </h2>
              <p className="text-xs sm:text-sm font-outfit text-gray-500">Social Event</p>
            </div>

            <div className="text-right mt-2 sm:mt-0">
              <p className="text-[10px] font-outfit sm:text-xs uppercase tracking-wide text-gray-500">
                Ticket Confirmed
              </p>
              <p className="text-sm sm:text-lg font-outfit font-semibold text-secondary">
                Standard Access
              </p>
            </div>
          </div>

          {/* Event Details + QR */}
          <div className="flex flex-col lg:flex-row">

            {/* QR Section */}
            <div className="order-1 lg:order-2 flex-1 p-4 sm:p-6 flex flex-col items-center justify-start">
              <div className="flex flex-col items-center w-full">
                <div className="w-32 sm:w-40 h-32 sm:h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                  QR Placeholder
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
                  Purchased on August 27, 2025
                </p>

                {/* Desktop button only */}
                <div className="mt-4 w-full hidden sm:flex justify-center">
                  <button className="bg-teal-600 font-outfit text-white px-4 sm:px-6 py-2 rounded-lg shadow hover:bg-teal-700 transition text-sm sm:text-base flex items-center gap-2">
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
                  <span>March 15, 2026</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium font-outfit text-gray-700">Time:</span>
                  <span>2:00 PM – 8:00 PM</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium font-outfit text-gray-700">Venue:</span>
                  <span className="text-right">SMX Convention Pasay, 2nd Floor F2 Hall</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium font-outfit text-gray-700">Seat:</span>
                  <span>Standard Seat</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-700">Ticket Holder:</span>
                  <span>Geryln Rama Tandepet</span>
                </div>
                <div className="flex flex-col border-b pb-3">
                  <span className="font-medium font-outfit">Price:</span>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs font-outfit sm:text-sm">Standard</p>
                    <p className="font-semibold">₱200.00</p>
                  </div>
                </div>

                {/* Rules */}
                <ul className="pt-4 font-outfit text-gray-500 list-disc list-inside space-y-1 text-xs sm:text-sm">
                  <li>Present this ticket upon entry</li>
                  <li>No refunds or exchange</li>
                  <li>Don’t lose this ticket</li>
                </ul>

                {/* Mobile button below rules */}
                <div className="mt-4 w-full sm:hidden flex justify-center">
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 transition text-sm flex items-center gap-2">
                    <CiSaveDown2 size={18} /> Download as PDF
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
