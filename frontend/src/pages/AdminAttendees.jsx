// src/pages/AdminAttendeesManagement.jsx
import React, { useState } from "react";
import AdminNav from "../components/AdminNav";
import { FiSearch } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

export default function AdminAttendeesManagement() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All Events");

  const events = [
    {
      id: 1,
      title: "Tuli ni Josh: Kids Party",
      date: "September 12, 2025",
    },
  ];

  return (
  <div className="min-h-screen bg-aliceblue font-outfit grid grid-cols-1 md:grid-cols-6 xl:grid-cols-9">
  {/* Sidebar */}
  <AdminNav />

  {/* Main Content */}
  <div className="font-outfit overflow-y-scroll mx-3 col-span-6 md:col-span-4 xl:col-span-7 flex flex-col items-start px-2 md:px-4 lg:px-10">
    {step === 1 && (
      <>
        {/* Header */}
     <div className="flex flex-col p-4 mt-16 mb-10 md:flex-row md:mt-7 md:justify-between md:w-[95%]">
     <h1 className="text-xl sm:text-4xl text-gray-800 md:text-lg lg:text-4xl">
      Attendees Management
    </h1>

<div className="flex items-center w-full sm:w-72 mt-2 md:mt-0 md:gap-10">
  {/* Search Box */}
  <div className="flex items-center gap-2 border-b border-gray-300 pb-1 flex-1">
    <FiSearch className="text-teal-500 text-2xl my-1" />
    <input
      className="w-full text-sm bg-transparent outline-none placeholder-gray-400"
      type="text"
      placeholder="Search Events"
    />
  </div>

  {/* Profile Icon */}
  <CgProfile className="hidden md:flex text-4xl text-gray-400 lg:text-5xl" />
</div>
  </div>

        {/* Tabs */}
        <div className="w-full md:w-[90%] mb-3">
          <div className="flex flex-row gap-1.5 justify-start overflow-x-auto hide-scrollbar text-sm sm:text-base pb-1">
            <button
              onClick={() => setSelectedCategory("All Events")}
              className="group text-secondary hover:font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap"
            >
              All Events
              <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white font-semibold px-2 py-0.5 rounded-md text-xs sm:text-sm">
                6
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory("Pending")}
              className="group text-secondary hover:font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap"
            >
              Pending
              <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white font-semibold px-2 py-0.5 rounded-md text-xs sm:text-sm">
                3
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory("Accepted")}
              className="group text-secondary hover:font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap"
            >
              Accepted
              <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white font-semibold px-2 py-0.5 rounded-md text-xs sm:text-sm">
                2
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory("Rejected")}
              className="group text-secondary hover:font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap"
            >
              Rejected
              <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white font-semibold px-2 py-0.5 rounded-md text-xs sm:text-sm">
                1
              </span>
            </button>
          </div>
        </div>

        <hr className="border-gray-300 mb-5 w-full md:w-[90%] lg:w-[80%]"/>

  
{/* Event Cards */}
<div className="space-y-3 w-full sm:w-[90%] md:max-w-3xl flex flex-col md:w-[60%] items-start lg:w-[50%]">
  {events.map((event) => (
    <div
      key={event.id}
      className="bg-white border border-gray-200 rounded-lg p-4 flex flex-row justify-between items-center gap-3 w-full"
    >
      <div className="flex flex-col">
        <h2 className="text-gray-800 font-medium text-sm sm:text-base">
          {event.title}
        </h2>
        <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-500">
          <FaRegCalendarAlt className="text-teal-500" />
          <span>{event.date}</span>
        </div>
      </div>
      <button
        className="px-5 py-1.5 bg-teal-600 text-white text-xs sm:text-sm rounded hover:bg-teal-700 transition-all"
        onClick={() => setStep(2)}
      >
        View
      </button>
    </div>
  ))}
</div>
          </>
        )}



  {step === 2 && (
  <div className="min-h-screen font-outfit p-4 sm:p-5 max-w-full overflow-y-auto">
    {/* Header Section */}
    <div className="max-w-7xl">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 p-4 mx-auto mt-16 mb-5 md:flex-row md:justify-between md:mt-2 lg:gap-40">
        <h1 className="text-xl sm:text-3xl md:text-xl text-gray-800 lg:text-3xl">
          Attendees Management
        </h1>

        <div className="flex items-center w-full sm:w-72 mt-2 md:mt-0">
          {/* Search Box */}
          <div className="flex items-center gap-2 border-b border-gray-300 pb-1 flex-1 ">
            <FiSearch className="text-teal-500 text-2xl my-1" />
            <input
              className="w-full text-sm bg-transparent outline-none placeholder-gray-400"
              type="text"
              placeholder="Search Events"
            />
          </div>

          {/* Profile Icon */}
          <CgProfile className="hidden md:flex text-4xl text-gray-400 lg:text-5xl" />
        </div>
      </div>

      {/* Back Button */}
      <div
        className="flex items-center text-left mb-3 gap-1 cursor-pointer mt-6 md:mt-1"
        onClick={() => setStep(1)}
      >
        <IoIosArrowBack className="text-secondary text-2xl" />
        <span className="text-secondary text-lg font-medium font-outfit">
          Back
        </span>
      </div>

      {/* Event Title + Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-sm md:text-base font-semibold">
          Tuli ni Josh: Kids Party
        </h2>
        <button className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-4 py-2 rounded transition-all w-full sm:w-auto">
          Download Attendees CSV
        </button>
      </div>
    </div>

    {/* Table Section */}
    <div className="mx-auto border border-gray-400 rounded overflow-x-auto">
      <table className="min-w-[600px] w-full text-[13px] md:text-xs border-collapse">
        <thead>
          <tr>
            <th className="px-3 py-2 border border-gray-400 text-center">NAME</th>
            <th className="px-3 py-2 border border-gray-400 text-center">EMAIL</th>
            <th className="px-3 py-2 border border-gray-400 text-center">STATUS</th>
            <th className="px-3 py-2 border border-gray-400 text-center">REG. DATE</th>
            <th className="px-3 py-2 border border-gray-400 text-center">TICKET TYPE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-3 py-2 border border-gray-400 text-center">1</td>
            <td className="px-3 py-2 border border-gray-400 text-center">1</td>
            <td className="px-3 py-2 border border-gray-400 text-center">1</td>
            <td className="px-3 py-2 border border-gray-400 text-center">1</td>
            <td className="px-3 py-2 border border-gray-400 text-center">1</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}


   </div>
    </div>
  );
}
