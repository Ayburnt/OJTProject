import React, { useEffect, useRef, useState } from 'react';
import { GoCalendar, GoLocation, GoPeople } from "react-icons/go";
import api from '../api.js';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiEditLine } from "react-icons/ri";
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth.js';
import Tooltip from '@mui/material/Tooltip';
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";

function OrganizerEventCard({ fetchEventDetails, eventStatusColor, eventPoster, eventName, eventDate, eventLocation, ticketTypes, eventStatus, eventCode, userCode, selected, fetchAttendees, setSelectedEvent }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [typedCode, setTypedCode] = useState('');
  const { userRole } = useAuth();
  const navigate = useNavigate();

  // Delete API call
  const handleDelete = async () => {
    try {
      await api.delete(`/update/${eventCode}/`); // make sure URL matches DRF path
      setTypedCode('');
      setConfirmDelete(false);
      fetchEventDetails();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event. Please try again.");
    }
  };

  // OrganizerEventCard.jsx

  // Determine if tickets are selling (if at least one has is_selling true)
  const isSelling = ticketTypes.some(ticket => ticket.is_selling);

  // Toggle selling handler
  const handleTicketSelling = async () => {
    try {
      await api.patch(`/events/${eventCode}/toggle-selling/`, { is_selling: !isSelling });
      toast.success(isSelling ? "Registration closed!" : "Registration opened!", {
        autoClose: 3000,
      })
      fetchEventDetails(); // refresh state after update
    } catch (err) {
      console.error(err);
      toast.error("Failed to update registration status. Please try again.", {
        autoClose: 5000,
      })
    }
  };


  // Calculate total tickets
  const totalTickets = ticketTypes.reduce((sum, ticket) => sum + ticket.quantity_total, 0);

  const eDetailsStyle = `font-outfit text-grey flex flex-row gap-3`;

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-md p-6 relative text-center">
            <button
              onClick={() => setConfirmDelete(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            >
              &times;
            </button>

            <h2 className="font-outfit text-lg font-semibold mb-2 text-gray-800">
              Do you really want to delete this event?
            </h2>
            <p className="font-outfit mb-6 text-base text-gray-600">
              This action cannot be undone. Please type <span className='font-bold italic'>{`'${eventCode}'`}</span> to confirm.
            </p>

            <input
              type="text"
              value={typedCode}
              onChange={(e) => setTypedCode(e.target.value)}
              placeholder="Enter event code"
              className="w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-3 mb-5"
            />

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  setTypedCode('');
                }}
                className="px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-xl hover:bg-teal-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={typedCode !== eventCode}
                onClick={handleDelete}
                className={`px-6 py-3 font-semibold rounded-xl ${typedCode === eventCode ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event card */}

      <div className='shadow-lg rounded-xl px-5 pt-5 pb-6 flex flex-col items-start gap-2 bg-white hover:shadow-xl transition-all duration-300 leading-none border-2 border-gray-200 cursor-pointer hover:scale-101' onClick={(e) => {
        e.stopPropagation();
        setSelectedEvent(selected);
        if (userRole === 'staff') {
          navigate(`/events/${selected.event_code}`)
        } else {
          fetchAttendees(selected)
        }
      }}>
        <Tooltip title="Click to view data" placement="top" arrow>
          <div className='overflow-hidden rounded-lg aspect-video'>
            <img src={eventPoster} alt="" className='object-cover' />
          </div>

          <div className='flex flex-row justify-between items-center w-full'>
            <p className='font-outfit text-2xl truncate w-full'>{eventName}</p>
            <p className={`font-outfit py-1 px-3 text-xs rounded-full ml-3 ${eventStatusColor}`}
            >{eventStatus}</p>
          </div>

          <p className={eDetailsStyle}><GoCalendar />{eventDate}</p>
          <p className={eDetailsStyle}><GoLocation />{eventLocation}</p>
          <p className={eDetailsStyle}><GoPeople />{totalTickets} total tickets</p>

        </Tooltip>

        {(userRole === 'organizer' || userRole === 'co-organizer') && (
          <div className='flex flex-row gap-3 w-full mt-2 items-center justify-between'>
            <button
              className={`font-outfit px-4 py-3 outline-none rounded-md text-white font-semibold cursor-pointer w-full 
    ${isSelling ? 'bg-red-600 hover:bg-red-700' : 'bg-secondary hover:bg-secondary/90'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleTicketSelling()
              }}
            >
              {isSelling ? "Close registration" : "Open registration"}
            </button>



            <div className="relative inline-block" ref={menuRef}>
              {/* Toggle button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open)
                }}
              >
                <BsThreeDotsVertical className='text-2xl cursor-pointer' />
              </button>

              {/* Popup container */}
              {open && (
                <div className="absolute right-0 bottom-full w-40 bg-white border border-gray-200 rounded-lg shadow-lg/40 z-10">
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(selected);
                          if (userRole === 'staff') {
                            navigate(`/events/${selected.event_code}`)
                          } else {
                            fetchAttendees(selected)
                          }
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 flex flex-row gap-1 items-center cursor-pointer"
                      >
                        <HiOutlineDocumentSearch />View Details
                      </button>
                    </li>
                    <div className="border-t border-gray-300"></div>
                    <li>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/org/edit/${eventCode}`)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 flex flex-row gap-1 items-center cursor-pointer"
                      >
                        <RiEditLine />Edit Event
                      </button>
                    </li>
                    <div className="border-t border-gray-300"></div>
                    <li>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(true)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 flex flex-row gap-1 items-center text-red-600 cursor-pointer"
                      >
                        <RiDeleteBin6Line />Delete Event
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>           
          </div>
        )}


      </div>
    </>
  );
}

export default OrganizerEventCard;
