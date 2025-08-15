import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosEye } from "react-icons/io";
import { MdOutlineWarehouse } from "react-icons/md";
import { IoCalendarClearOutline } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { LuPhilippinePeso } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { BsSend } from "react-icons/bs";
import AdminNav from "../components/AdminNav";
import { useNavigate } from "react-router-dom";

function AdminEventControl() {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-aliceblue font-outfit grid grid-cols-1 md:grid-cols-6 xl:grid-cols-9 md:[80%] lg:[75%]">
         <AdminNav />

<div className="font-outfit overflow-y-scroll col-span-6 w-full md:col-span-4 xl:col-span-7 flex items-center flex-col lg:mt-5">
      {/* Back */}
        <div className="w-full max-w-md flex items-center text-left mb-3 gap-1 cursor-pointer mt-18 lg:mt-2 lg:self-start lg:ml-10"
        onClick={() => navigate('/')} >
        <IoIosArrowBack className="text-secondary text-xl" />
        <span className="text-secondary text-sm font-medium font-outfit">Back</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-0 w-[90%]">
        {/* Left Main Content */}
        <div className="flex-1 space-y-4 font-outfit">
           <h1 className="text-2xl font-semibold text-gray-800">Event Proposal Review</h1>
        <p className="text-sm text-gray-500">
          Review and manage incoming event proposals from organizers
        </p>

        {/* Event Image Placeholder */}
        <div className="w-full h-48 bg-gray-400 rounded-md mt-4 flex items-center justify-center relative md:w-[95%]">
          <span className="text-black text-sm font-semibold">Event Image</span>
          <div className="absolute top-2 right-2 text-white cursor-pointer">
            <IoIosEye className="text-xl"/>
          </div>
        </div>

          {/* Event Header */}
          <div className="bg-white p-6 rounded-lg shadow-sm md:w-[95%]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Tuli ni Josh: Kids Party
              </h2>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-md font-medium">
                Pending
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              “The Creation of Adam,” a famous fresco by Michelangelo on the Sistine
              Chapel ceiling, depicts the biblical story of God giving life to Adam, the
              first man. It symbolizes the moment of creation and the unique relationship
              between God and humanity.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600 mt-4">
                  <div className="flex items-center gap-2">
                <MdOutlineWarehouse className="text-secondary"/> <span>Event Type: Conference</span>
              </div>
              <div className="flex items-center gap-2">
                <CiClock2 className="text-secondary"/> <span>10:00 AM – 7:00 PM</span>
              </div>
               <div className="flex items-center gap-2">
                <LuUsers className="text-secondary"/> <span>Expected Attendees: 2000</span>
              </div>
              <div className="flex items-center gap-2">
                <IoCalendarClearOutline className="text-secondary"/> <span>September 12, 2025</span>
              </div>
        
               <div className="flex items-center gap-2">
                <IoLocationOutline className="text-secondary"/> <span>SMX Convention Center</span>
              </div>
             
              <div className="flex items-center gap-2">
                <LuPhilippinePeso className="text-secondary"/> <span>Event Budget: ₱30,000</span>
              </div>
            </div>
          </div>

          {/* Event Highlights */}
          <div className="bg-white p-6 rounded-lg shadow-sm md:w-[95%]">
            <h3 className="text-md font-semibold mb-3 text-gray-700">Event Highlights</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 text-sm text-gray-600 gap-4 md:gap-5">
              <div>
                <strong>Time Check-in:</strong> 30 min
              </div>
              <div>
                <strong>Age Restriction:</strong> 13+
              </div>
              <div>
                <strong>Parking:</strong> None
              </div>
            </div>
          </div>

          {/* Ticketing System */}
          <div className="bg-white p-6 rounded-lg shadow-sm md:w-[95%]">
            <h3 className="text-md font-semibold mb-3 text-gray-700">Ticketing System</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 text-sm text-gray-600 gap-4">
              <div>
                <strong>Regular Ticket</strong>
                <div>Price: ₱500</div>
                <div>Qty: 300</div>
              </div>
              <div>
                <strong>Student Ticket</strong>
                <div>Price: ₱250</div>
                <div>Qty: 300</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <aside className="space-y-4 w-full lg:w-72 md:w-[94%]">
  {/* Event Organizer */}
  <div className="bg-white p-7 rounded-lg shadow-sm md: mt-3">
    <h4 className="font-semibold text-xl text-gray-700">Event Organizer</h4>
    <div className="flex items-center gap-3 mt-2">
      <CgProfile className="text-5xl text-gray-500 mr-3 md:mt-3" />
      <div>
        <p className="text-sm font-medium text-gray-800 md:mt-3">Dinasour R. Roar</p>
        <p className="text-xs text-gray-500">organizer@email.com</p>
        <p className="text-xs text-gray-500">09262037594</p>
      </div>
    </div>
  </div>

  {/* Submission Details */}
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h4 className="font-semibold text-medium text-gray-700 mb-4">Submission Details</h4>
    <h4 className="text-xs text-gray-500">Submitted Date:</h4>
    <p className="text-xs text-gray-500 mt-1">Submitted June 18, 2025, 12:30 PM</p>
  </div>

  {/* Internal Comment */}
  <div className="bg-white p-8 rounded-lg shadow-sm">
    <h4 className="font-semibold text-medium text-gray-700 mb-2">Internal Comment</h4>
  <div className="space-y-1">
  <div className="flex items-center text-sm text-bold font-medium">
    <CgProfile className="text-xl mr-2" />
    Admin
  </div>
   <p className="text-xs text-gray-500 my-4">pangit ka daw po............</p>
 <div className="flex items-center gap-2">
  <textarea
    placeholder=""
    className="w-full text-sm p-1 border border-gray-500 rounded-md resize-none"
    rows="1"
  />
  <BsSend className="text-secondary text-2xl cursor-pointer" />
</div>
</div>
  </div>
</aside>
      </div>

{/* Action Buttons */}
  <div className="flex gap-5 mt-6 mb-5 justify-center lg:justify-left lg:mr-65">
    <button className="px-20 py-2 md:px-20 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all cursor-pointer">
      Accept
    </button>
    <button className="px-6 py-2 md:px-7 bg-red text-primary rounded-md hover:bg-red-500 transition-all cursor-pointer">
      Reject
    </button>
  </div>
</div>
    </div>
  );
}
export default AdminEventControl;
