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
  const [sortColumn, setSortColumn] = useState(null);
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

  // 1️⃣ Collect all unique questions from all attendees (use question_label now)
 const allQuestions = Array.from(
  new Set(
    filteredAttendees.flatMap(att =>
      (att.responses || [])
        .map(resp => resp.question_details?.question_label) // 👈 fixed
        .filter(Boolean)
    )
  )
);

  // 2️⃣ Build CSV headers
  const headers = [
    "Reference Code",
    "Registration Date",
    "First Name",
    "Last Name",
    "Email",
    "Ticket Type",
    "Price at Purchase",
    "Check-in Time",
    ...allQuestions
  ];

  // 3️⃣ Map attendees into rows
  const rows = filteredAttendees.map(att => {
    const base = [
      att.attendee_code || "",
      att.registration_date || "",
      att.firstname || "",
      att.lastname || "",
      att.email || "",
      att.ticket_read?.ticket_name || "",
      att.price_at_purchase || "",
      att.attendance?.check_in_time
        ? new Date(att.attendance.check_in_time).toLocaleString()
        : ""
    ];

    // Map answers per question_label
const answers = allQuestions.map(q => {
  const resp = (att.responses || []).find(
    r => r.question_details?.question_label === q // 👈 fixed
  );
  return resp ? resp.response_value || "" : "";
});

    return [...base, ...answers];
  });

  // 4️⃣ Build CSV content (with BOM for Excel)
  const csvContent =
    "\uFEFF" +
    headers.join(",") +
    "\n" +
    rows
      .map(r =>
        r
          .map(value =>
            `"${String(value).replace(/"/g, '""').replace(/\r?\n/g, " ")}"`
          )
          .join(",")
      )
      .join("\n");

  // 5️⃣ Trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${currentEvent?.event_code || "attendees"}_full.csv`);
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

  const handleSort = (column) => {
  let newOrder = "asc";
  if (sortColumn === column && sortOrder === "asc") newOrder = "desc";

  setSortColumn(column);
  setSortOrder(newOrder);

  const sorted = [...attendees].sort((a, b) => {
    let valA, valB;

    switch (column) {
      case "reference":
        valA = a.attendee_code;
        valB = b.attendee_code;
        break;
      case "firstname":
        valA = a.firstname;
        valB = b.firstname;
        break;
      case "lastname":
        valA = a.lastname;
        valB = b.lastname;
        break;
      case "email":
        valA = a.email;
        valB = b.email;
        break;
      case "ticket":
        valA = a.ticket_read?.ticket_name;
        valB = b.ticket_read?.ticket_name;
        break;
      case "checkin":
        valA = a.attendance?.check_in_time
          ? new Date(a.attendance.check_in_time).getTime()
          : 0;
        valB = b.attendance?.check_in_time
          ? new Date(b.attendance.check_in_time).getTime()
          : 0;
        break;
      default:
        valA = "";
        valB = "";
    }

    // normalize strings
    if (typeof valA === "string") valA = valA.trim().toLowerCase();
    if (typeof valB === "string") valB = valB.trim().toLowerCase();

    if (valA < valB) return newOrder === "asc" ? -1 : 1;
    if (valA > valB) return newOrder === "asc" ? 1 : -1;
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
                <TableCell onClick={() => handleSort("reference")} sx={{fontFamily: 'Outfit, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Reference Code{sortOrder === "asc" ? <FaChevronUp className='text-gray-500 text-xs' /> : <FaChevronDown className='text-gray-500 text-xs' />}
                  </div>
                </TableCell>
                <TableCell onClick={() => handleSort("firstname")} sx={{fontFamily: 'Outfit, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    First Name{sortOrder === "asc" ? <FaChevronUp className='text-gray-500 text-xs' /> : <FaChevronDown className='text-gray-500 text-xs' />}
                  </div>
                </TableCell>
                <TableCell sx={{fontFamily: 'Outfit, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort("lastname")}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Last Name{sortOrder === "asc" ? <FaChevronUp className='text-gray-500 text-xs' /> : <FaChevronDown className='text-gray-500 text-xs' />}
                  </div></TableCell>
                <TableCell onClick={() => handleSort("email")} sx={{fontFamily: 'Outfit, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Email{sortOrder === "asc" ? <FaChevronUp className='text-gray-500 text-xs' /> : <FaChevronDown className='text-gray-500 text-xs' />}
                  </div>
                </TableCell>
                <TableCell onClick={() => handleSort("ticket")} sx={{fontFamily: 'Outfit, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Ticket Type{sortOrder === "asc" ? <FaChevronUp className='text-gray-500 text-xs' /> : <FaChevronDown className='text-gray-500 text-xs' />}
                  </div>
                </TableCell>
                {/* <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Paid</TableCell> */}
                <TableCell onClick={() => handleSort("checkin")} sx={{fontFamily: 'Outfit, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Check-In Time{sortOrder === "asc" ? <FaChevronUp className='text-gray-500 text-xs' /> : <FaChevronDown className='text-gray-500 text-xs' />}
                  </div>
                </TableCell>
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