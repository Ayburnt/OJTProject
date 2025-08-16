import React from 'react'
import { GoCalendar, GoLocation, GoPeople } from "react-icons/go";

function OrganizerEventCard({ eventPoster, eventName, eventDate, eventLocation, eventAttendees, eventStatus, ticketTypes }) {

    // Calculate the total number of tickets from all ticket types
    const totalTickets = ticketTypes.reduce((sum, ticket) => sum + ticket.quantity_total, 0);

    const eDetailsStyle = `font-outfit text-grey flex flex-row gap-3`
    return (
        <div className='shadow-lg rounded-xl px-5 pt-5 pb-6 flex flex-col items-start gap-2 bg-white hover:shadow-xl transition-shadow duration-300 leading-none border-2 border-gray-200'>
            <div className='overflow-hidden rounded-lg aspect-video'>
                <img src={eventPoster} alt="" className='object-cover' />
            </div>

            <div className='flex flex-row justify-between items-center w-full'>
                <p className='font-outfit text-2xl truncate w-full'>{eventName}</p>
                <p className={`font-outfit py-1 px-3 text-xs text-white rounded-full ml-3 
                    ${eventStatus === 'pending' ? 'bg-slate-700' :
                        eventStatus === 'published' ? 'bg-green-700' :
                        eventStatus === 'cancelled' ? 'bg-red-500' :
                        eventStatus === 'draft' ? 'bg-stone-700' :
                        eventStatus === 'completed' ? 'bg-secondary' :
                        'bg-amber-600'
                    }`}
                >{eventStatus}</p>
            </div>          
            <p className={eDetailsStyle}><span><GoCalendar/></span>{eventDate}</p>
            <p className={eDetailsStyle}><span><GoLocation/></span>{eventLocation}</p>
            {/* Display the total tickets here instead of eventAttendees */}
            <p className={eDetailsStyle}><span><GoPeople/></span>{totalTickets} total tickets</p>

            <div className='flex flex-row gap-3 mt-3'>
                <button className='font-outfit px-4 py-2 bg-secondary text-white font-semibold cursor-pointer'>Edit</button>
                <button className='font-outfit text-secondary px-4 py-2 border-1 border-secondary font-semibold cursor-pointer'>Delete</button>
            </div>
        </div>
    )
}

export default OrganizerEventCard