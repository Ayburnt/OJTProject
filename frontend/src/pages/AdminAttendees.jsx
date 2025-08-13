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
      <div className="font-outfit overflow-y-scroll col-span-6 md:col-span-4 xl:col-span-7 flex flex-col items-start lg:gap-x-5">
        {step === 1 && (
          <>
            {/* Header */}
            <div className="flex flex-col p-4 mt-16 mb-10 md:flex-row md:items-center md:justify-between md:mt-7 xl:gap-x-50">
              <h1 className="text-xl sm:text-4xl text-gray-800">
                Attendees Management
              </h1>

              <div className="flex items-center gap-3 w-full sm:w-72 mt-2 md:mt-0">
                {/* Search Box */}
                <div className="flex items-center gap-2 border-b border-gray-300 pb-1 flex-1">
                  <FiSearch className="text-teal-500 text-2xl my-1" />
                  <input
                    className="w-full text-sm bg-transparent outline-none placeholder-gray-400"
                    type="text"
                    placeholder="Search Events"
                  />
                </div>
                <CgProfile className="hidden md:flex text-[3rem] text-gray-400" />
              </div>
            </div>

            {/* Tabs */}
            <div className="w-full md:w-[90%] lg:w-[85%] -ml-2 mb-3 xl:ml-2">
              <div className="flex flex-row gap-1.5 justify-start overflow-x-auto hide-scrollbar text-[16px] pb-1">
                {["All Events", "Pending", "Accepted", "Rejected"].map(
                  (tab, index) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedCategory(tab)}
                      className="group text-secondary hover:font-semibold px-3 py-1.5 rounded-full font-outfit flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {tab}
                      <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white font-semibold px-2 py-0.5 rounded-md text-[13px]">
                        {[6, 3, 2, 1][index]}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <hr className="border-gray-400 mb-5 w-[90%] mx-auto md:w-[95%] xl:mr-33" />

            {/* Events List */}
            <div className="space-y-3 w-[90%] md:max-w-2xl lg:max-w-lg xl:max-w-md flex flex-col items-start mx-auto md:mx-0 xl:ml-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex flex-row justify-between items-center gap-3 w-full"
                >
                  <div className="flex flex-col">
                    <h2 className="text-gray-800 font-medium text-sm sm:text-base">
                      {event.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <FaRegCalendarAlt className="text-teal-500" />
                      <span>{event.date}</span>
                    </div>
                  </div>
                  <button
                    className="px-5 py-1.5 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-all"
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
          <div className="min-h-screen font-outfit p-4 sm:p-5">
            <div className="flex flex-col p-4 mt-16 mb-10 md:flex-row md:items-center md:justify-between md:mt-7 xl:gap-x-50">
              <h1 className="text-xl sm:text-4xl text-gray-800">
                Attendees Management
              </h1>

              <div className="flex items-center gap-3 w-full sm:w-72 mt-2 md:mt-0">
                {/* Search Box */}
                <div className="flex items-center gap-2 border-b border-gray-300 pb-1 flex-1">
                  <FiSearch className="text-teal-500 text-2xl my-1" />
                  <input
                    className="w-full text-sm bg-transparent outline-none placeholder-gray-400"
                    type="text"
                    placeholder="Search Events"
                  />
                </div>
                <CgProfile className="hidden md:flex text-[3rem] text-gray-400" />
              </div>
            </div>

              {/* Back */}
          <div
            className="flex items-center text-left mb-3 gap-1 cursor-pointer mt-6 md:mt-1"
            onClick={() => setStep(1)}
          >
            <IoIosArrowBack className="text-secondary text-2xl" />
            <span className="text-secondary text-lg font-medium font-outfit">Back</span>
          </div>

          {/* Event Title + Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 mr-20">
            <h2 className="text-sm md:text-base font-semibold">
              Tuli ni Josh: Kids Party
            </h2>
          <button className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-4 py-2 rounded transition-all w-auto">
          Download Attendees CSV
        </button>
            </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-400 rounded md:w-[90%]">
            <table className="w-full text-xs md:text-sm border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-3 border border-gray-400 text-center">NAME</th>
                  <th className="px-4 py-3 border border-gray-400 text-center">EMAIL</th>
                  <th className="px-4 py-3 border border-gray-400 text-center">STATUS</th>
                  <th className="px-4 py-3 border border-gray-400 text-center">REG. DATE</th>
                  <th className="px-4 py-3 border border-gray-400 text-center">TICKET TYPE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 border border-gray-400 text-center">1</td>
                  <td className="px-4 py-3 border border-gray-400 text-center">1</td>
                  <td className="px-4 py-3 border border-gray-400 text-center">1</td>
                  <td className="px-4 py-3 border border-gray-400 text-center">1</td>
                  <td className="px-4 py-3 border border-gray-400 text-center">1</td>
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
