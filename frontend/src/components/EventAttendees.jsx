import React, { useRef, useState } from 'react'
import { GoUpload } from "react-icons/go";
import { BsDownload } from "react-icons/bs";
import { RiQrScan2Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import api from '../api';
import { Scanner } from "@yudiel/react-qr-scanner";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";


function EventAttendees({ fetchAttendees, currentEvent, attendeeList, filteredAttendees, loadingAttendees, setSelectedAttendee, attendees, setAttendees, searchAttendees, setSearchAttendees }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Get the current page data
  const paginatedAttendees = filteredAttendees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

  const downloadCsv = () => {
  if (!filteredAttendees || filteredAttendees.length === 0) {
    alert("No attendees to export.");
    return;
  }

  // Only the rows you're currently displaying
  const visibleData = filteredAttendees;   // or paginatedAttendees if you only want the current page

  const headers = [
    "Reference Code",
    "First Name",
    "Last Name",
    "Email",
    "Ticket Type",
    "Check-in Time"
  ];

  const rows = visibleData.map(a => [
    a.attendee_code || "—",
    a.firstname || "",
    a.lastname || "",
    a.email || "",
    a.ticket_read?.ticket_name || "",
    a.attendance?.check_in_time
      ? new Date(a.attendance.check_in_time).toLocaleString()
      : ""
  ]);

  // Build CSV
  let csvContent =
    headers.join(",") +
    "\n" +
    rows.map(r => r.map(value =>
      `"${String(value).replace(/"/g, '""')}"`
    ).join(",")).join("\n");

  // Download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `${currentEvent?.event_code || "attendees"}_visible.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

  const handleSortByLastName = () => {
  const newOrder = sortOrder === "asc" ? "desc" : "asc";
  setSortOrder(newOrder);

  const sorted = [...attendees].sort((a, b) => {
    if (a.lastname.toLowerCase() < b.lastname.toLowerCase()) return newOrder === "asc" ? -1 : 1;
    if (a.lastname.toLowerCase() > b.lastname.toLowerCase()) return newOrder === "asc" ? 1 : -1;
    return 0;
  });

  setAttendees(sorted);
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
            className="w-[48%] md:min-w-[140px] whitespace-nowrap py-2 px-3 text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all flex justify-center items-center gap-2 cursor-pointer"
          >
            Upload CSV <GoUpload />
          </button>

          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
      </div>
      
      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Reference Code</TableCell>
                <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>First Name</TableCell>
                <TableCell sx={{fontFamily: 'Outfit, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={handleSortByLastName}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Last Name{sortOrder === "asc" ? <FaChevronUp className='text-gray-500 text-xs' /> : <FaChevronDown className='text-gray-500 text-xs' />}
                  </div></TableCell>
                <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Email</TableCell>
                <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Ticket Type</TableCell>
                {/* <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Paid</TableCell> */}
                <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Check-in Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingAttendees ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-gray-500">
                    Loading attendees...
                  </TableCell>
                </TableRow>
              ) : paginatedAttendees.length > 0 ? (
                paginatedAttendees.map((a, idx) => (
                  <Tooltip key={a.id} title="Click to view details" placement="top" arrow>
                  <TableRow                    
                    className={`text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition cursor-pointer`}
                    onClick={() => setSelectedAttendee(a)}
                  >
                    {/* Reference Code */}
                    <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                      {a.attendee_code || "—"}
                    </TableCell>                   
                    
                    {/* Name */}
                    <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                      {a.firstname}
                    </TableCell>

                    <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                      {a.lastname}
                    </TableCell>

                    {/* Email → Gmail */}
                    <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${a.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {a.email}
                      </a>
                    </TableCell>

                    {/* Ticket */}
                    <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                      {a.ticket_read?.ticket_name}
                    </TableCell>

                    {/* Paid toggle */}
                    {/* <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}
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
                      className="py-3 px-4 text-gray-600"
                    >
                      {a.paid === "yes" ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">Yes</span>
                      ) : a.paid === "no" ? (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">No</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-xs">—</span>
                      )}
                    </TableCell> */}

                    {/* Check-in */}
                    <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                      {a.attendance?.check_in_time
                        ? new Date(a.attendance.check_in_time).toLocaleString()
                        : ''}
                    </TableCell>
                  </TableRow>
                  </Tooltip>
                ))
              ) : (
                <TableRow>
                  <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} colSpan={7} className="py-6 text-gray-500 text-center">
                    No attendees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredAttendees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}

export default EventAttendees