import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OrganizerNav from "../components/OrganizerNav";
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { GoUpload } from "react-icons/go";
import { BsDownload } from "react-icons/bs";
import api from "../api";

const Attendees = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [attendees, setAttendees] = useState([
    {
      id: 1,
      reg_date: "2025-08-01",
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      contact: "09171234567",
      ticket_type: "VIP",
    },
    {
      id: 2,
      reg_date: "2025-08-02",
      name: "Maria Santos",
      email: "maria@example.com",
      contact: "09981234567",
      ticket_type: "General Admission",
    },
    {
      id: 3,
      reg_date: "2025-08-03",
      name: "Pedro Reyes",
      email: "pedro@example.com",
      contact: "09221234567",
      ticket_type: "Student",
    },
  ]);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = "Organizer Attendees | Sari-Sari Events";
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    try {
      const res = await api.get("/attendees/");
      if (res.data && res.data.length > 0) {
        setAttendees(res.data); // overwrite dummy with real API
      }
    } catch (err) {
      console.error("Error fetching attendees:", err);
    }
  };

  const uploadCsv = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/attendees/upload-csv/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message || "CSV uploaded successfully!");
      fetchAttendees();
    } catch (err) {
      console.error("Error uploading CSV:", err);
      alert("Failed to upload CSV.");
    }
  };

  const downloadCsv = async () => {
    try {
      const res = await api.get("/attendees/export-csv/", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendees.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading CSV:", err);
    }
  };

  const filteredAttendees = attendees.filter((attendee) =>
    attendee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendee.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-alice-blue min-h-screen font-outfit">
      <OrganizerNav />

      <div className="md:ml-64 p-4 md:p-8 lg:p-12 flex flex-col items-center">

        {/* Profile Icon */}
        <div className="flex justify-end w-full mb-6">
          <CgProfile className="hidden md:flex text-[2.5rem] text-gray-300 mr-10" />
        </div>

        {/* Back Arrow */}
        <div className="w-full flex justify-center mb-4">
          <div
            className="w-full max-w-6xl flex items-center justify-start gap-1 cursor-pointer"
            onClick={() => navigate("/attendees")}
          >
            <IoIosArrowBack className="text-secondary text-xl" />
            <span className="text-secondary text-sm font-medium font-outfit">
              Back
            </span>
          </div>
        </div>

        {/* Container */}
        <div className="w-full max-w-6xl mx-auto p-5 md:p-8 lg:p-10 border border-gray-300 rounded-xl shadow bg-white">

          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Pangalan ng Events
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
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <div className="rounded-xl overflow-hidden border border-gray-300">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="text-gray-600 text-sm bg-gray-100">
                    <th className="py-3 px-4 font-medium border border-gray-300">Reg.date</th>
                    <th className="py-3 px-4 font-medium border border-gray-300">Name of Attendee</th>
                    <th className="py-3 px-4 font-medium border border-gray-300">Email</th>
                    <th className="py-3 px-4 font-medium border border-gray-300">Contact Number</th>
                    <th className="py-3 px-4 font-medium border border-gray-300">Ticket Type</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((a, idx) => (
                      <tr
                        key={idx}
                        className={`text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition cursor-pointer`}
                        onClick={() => setSelectedAttendee(a)}
                      >
                        <td className="py-3 px-4 border border-gray-300 text-gray-600">{a.reg_date}</td>
                        <td className="py-3 px-4 border border-gray-300 text-gray-600">{a.name}</td>
                        <td className="py-3 px-4 border border-gray-300 text-gray-600">{a.email}</td>
                        <td className="py-3 px-4 border border-gray-300 text-gray-600">{a.contact}</td>
                        <td className="py-3 px-4 border border-gray-300 text-gray-600">{a.ticket_type}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-6 text-center text-gray-500 font-outfit border border-gray-300"
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
      </div>

      {/* MODAL */}
      {selectedAttendee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] font-outfit lg:justify-end lg:items-start">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md h-auto lg:h-screen">

            {/* Header */}
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



            {/* Details */}
            <div className="px-6 py-4 divide-y divide-gray-200 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Registration Date</span>
                <span className="text-gray-800 font-medium">{selectedAttendee.reg_date}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Name</span>
                <span className="text-gray-800 font-medium">{selectedAttendee.name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">E-mail</span>
                <span className="text-gray-800 font-medium">{selectedAttendee.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Contact Number</span>
                <span className="text-gray-800 font-medium">{selectedAttendee.contact}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Ticket Type</span>
                <span className="text-gray-800 font-medium">{selectedAttendee.ticket_type}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 pt-37 pb-5 border-t border-gray-200 text-sm lg:pt-260 xl:pt-70">
              <span className="text-gray-600">Ticket Link:</span>
              <button
                className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                onClick={() => window.open(`https://sari-sari.com/ticket/${selectedAttendee.id}`, "_blank")}
              >
                <span>URL:</span>
                <MdContentCopy className="text-lg" />
              </button>

            </div>
            <div className="w-full h-6 bg-gray-500 "></div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Attendees;
