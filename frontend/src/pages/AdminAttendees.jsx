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
    <div className="min-h-screen bg-gray-50 font-outfit mx-3 sm:mx-5 md:ml-75 md:mr-10">
      <AdminNav />

      {step === 1 && (
        <>
          {/* Header */}
          <div className="flex flex-col gap-4 p-4 mt-16 mb-5 md:flex-row md:justify-between md:items-center md:mt-7">
            <h1 className="text-xl sm:text-4xl text-gray-800">
              Attendees Management
            </h1>

            <div className="flex items-center gap-2 border-b border-gray-300 pb-1 w-full sm:w-72 md:w-64 md:ml-50">
              <FiSearch className="text-teal-500 text-lg" />
              <input
                type="text"
                placeholder="Search Events"
                className="w-full text-sm bg-transparent outline-none placeholder-gray-400"
              />
            </div>

            <CgProfile className="hidden md:flex text-[2.5rem] text-gray-400" />
          </div>

          {/* Tabs */}
          <div className="w-full md:max-w-3xl mb-3">
            <div className="flex flex-row gap-1.5 items-center overflow-x-auto hide-scrollbar text-[16px] pb-1">
              <button
                onClick={() => setSelectedCategory("All Events")}
                className="group text-secondary hover:font-semibold px-3 py-1.5 rounded-full font-outfit flex items-center gap-1.5 whitespace-nowrap"
              >
                All Events
                <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white font-semibold px-2 py-0.5 rounded-md text-[13px]">
                  6
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory("Pending")}
                className="group text-secondary hover:font-semibold px-3 py-1.5 rounded-full font-outfit flex items-center gap-1.5 whitespace-nowrap"
              >
                Pending
                <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white font-semibold px-2 py-0.5 rounded-md text-[13px]">
                  3
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory("Accepted")}
                className="group text-secondary hover:font-semibold px-3 py-1.5 rounded-full font-outfit flex items-center gap-1.5 whitespace-nowrap"
              >
                Accepted
                <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white font-semibold px-2 py-0.5 rounded-md text-[13px]">
                  2
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory("Rejected")}
                className="group text-secondary hover:font-semibold px-3 py-1.5 rounded-full font-outfit flex items-center gap-1.5 whitespace-nowrap"
              >
                Rejected
                <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white font-semibold px-2 py-0.5 rounded-md text-[13px]">
                  1
                </span>
              </button>
            </div>
          </div>

          <hr className="border-gray-400 mb-5 md:w-[85%] -ml-2" />

          {/* Event Cards */}
          <div className="p-4 space-y-3 md:mr-30 md:w-[53%] w-full">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <h2 className="text-gray-800 font-medium text-sm sm:text-base">
                    {event.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <FaRegCalendarAlt className="text-teal-500" />
                    <span>{event.date}</span>
                  </div>
                </div>
                <button
                  className="px-5 py-1.5 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-all w-full sm:w-auto"
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
          {/* Top Bar */}
          <div className="flex flex-col gap-4 p-4 mt-16 mb-5 md:flex-row md:justify-between md:items-center md:mt-2">
            <h1 className="text-xl sm:text-4xl text-gray-800">
              Attendees Management
            </h1>

            <div className="flex items-center gap-2 border-b border-gray-300 pb-1 w-full sm:w-72 md:w-64 md:ml-50">
              <FiSearch className="text-teal-500 text-lg" />
              <input
                type="text"
                placeholder="Search Events"
                className="w-full text-sm bg-transparent outline-none placeholder-gray-400"
              />
            </div>

            <CgProfile className="hidden md:flex text-[2.5rem] text-gray-400" />
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-sm md:text-base font-semibold">
              Tuli ni Josh: Kids Party
            </h2>
            <button className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-4 py-2 rounded transition-all w-full sm:w-auto md:mr-24">
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
  );
}
