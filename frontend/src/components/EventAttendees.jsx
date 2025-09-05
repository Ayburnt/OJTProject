import React, { useRef, useState } from 'react'
import { GoUpload } from "react-icons/go";
import { BsDownload } from "react-icons/bs";
import { RiQrScan2Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import api from '../api';
import { Scanner } from "@yudiel/react-qr-scanner";

function EventAttendees({ fetchAttendees, currentEvent, attendeeList, filteredAttendees, loadingAttendees, setSelectedAttendee, attendees, setAttendees, searchAttendees, setSearchAttendees }) {
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef(null);
  const handleDecode = (result) => {
    if (result && result.length > 0) {
      console.log("✅ Scanned:", result);
      const scannedValue = result[0].rawValue; // Correctly access the rawValue property
      setScanning(false);
      window.location.href = scannedValue;
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
      alert("Failed to download CSV.");
    }
  };

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
  return (
    <>
      {scanning && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
          <p className="text-white mb-4">Scan a QR Code</p>
          <div className="w-80 h-80 bg-white rounded-lg overflow-hidden">
            <Scanner
              onScan={handleDecode}
              onError={(err) => console.error("Scanner error:", err)}
              allowMultiple
            />
          </div>
          <button
            onClick={() => setScanning(false)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 md:col-span-2">
          {currentEvent.title || "Event Attendees"}
        </h1>
        <div className="md:col-span-1 w-full md:place-items-end">
          <button
            onClick={() => setScanning(!scanning)}
            className="font-semibold text-lg flex flex-row gap-1 items-center text-secondary cursor-pointer"
          >
            Scan QR <span><RiQrScan2Line /></span>
          </button>
        </div>
      </div>

      {/* Search + Upload/Download */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 w-full">
        <div className="relative w-full lg:max-w-sm">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
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
            className="w-[48%] md:min-w-[140px] whitespace-nowrap py-2 px-3 text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all flex justify-center items-center gap-2 cursor-pointer"                  >
            Upload CSV <GoUpload />
          </button>

          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-md">
        <table className="w-full text-center border-collapse rounded-md">
          <thead>
            <tr className="text-gray-600 text-sm bg-gray-100">
              <th className="py-3 px-4 border border-gray-300">Reference Code</th>
              <th className="py-3 px-4 border border-gray-300">Reg.date</th>
              <th className="py-3 px-4 border border-gray-300">Name</th>
              <th className="py-3 px-4 border border-gray-300">Email</th>
              <th className="py-3 px-4 border border-gray-300">Ticket Type</th>
              <th className="py-3 px-4 border border-gray-300">Paid</th>
              <th className="py-3 px-4 border border-gray-300">Check-in Time</th>
            </tr>
          </thead>
          <tbody>
            {loadingAttendees ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500 border border-gray-300">
                  Loading attendees...
                </td>

              </tr>
            ) : filteredAttendees.length > 0 ? (
              filteredAttendees.map((a, idx) => (
                <tr
                  key={a.id}
                  className={`text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition cursor-pointer`}
                  onClick={() => setSelectedAttendee(a)}
                >
                  {/* Reference Code */}
                  <td onClick={() => setSelectedAttendee(a)} className="py-3 px-4 border border-gray-300 text-gray-600">
                    {a.attendee_code || "—"}
                  </td>

                  {/* Reg.date */}
                  <td className="py-3 px-4 border border-gray-300 text-gray-600">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  {/* Name */}
                  <td className="py-3 px-4 border border-gray-300 text-gray-600">{a.fullName}</td>

                  {/* Email → Gmail */}
                  <td className="py-3 px-4 border border-gray-300 text-gray-600">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${a.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {a.email}
                    </a>
                  </td>

                  {/* Ticket */}
                  <td className="py-3 px-4 border border-gray-300 text-gray-600">{a.ticket_read?.ticket_name}</td>

                  {/* Paid toggle */}
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!a.paid) {
                        a.paid = "yes";
                      } else if (a.paid === "yes") {
                        a.paid = "no";
                      } else {
                        a.paid = null;
                      }
                      setAttendees([...attendees]); // refresh UI
                    }}
                    className="py-3 px-4 border border-gray-300 text-gray-600"
                  >
                    {a.paid === "yes" ? (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">Yes</span>
                    ) : a.paid === "no" ? (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">No</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Check-in */}
                  <td className="py-3 px-4 border border-gray-300 text-gray-600">
                    {a.attendance?.check_in_time
                      ? new Date(a.attendance.check_in_time).toLocaleString()
                      : ''}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-gray-500 border">No attendees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default EventAttendees
