import React from 'react'
import { GoCalendar } from "react-icons/go";
import { GoLocation } from "react-icons/go";
import { GoPeople } from "react-icons/go";

function OrganizerEventCard({ eventPoster, eventName, eventDate, eventLocation, eventAttendees, eventStatus }) {

    const eDetailsStyle = `font-outfit text-grey flex flex-row gap-3`
    return (
        <div className='shadow-lg rounded-xl px-5 pt-5 pb-6 flex flex-col items-start gap-2 bg-white hover:shadow-xl transition-shadow duration-300 leading-none border-2 border-gray-200'>
            <div className='overflow-hidden rounded-lg aspect-video'>
                <img src={eventPoster} alt="" className='object-cover' />
            </div>

            <div className='flex flex-row justify-between items-center w-full'>
                <p className='font-outfit text-2xl truncate w-full'>{eventName}</p>
                <p className='font-outfit py-1 px-3 bg-secondary text-xs text-white rounded-full ml-3'>{eventStatus}</p>
            </div>            
            <p className={eDetailsStyle}><span><GoCalendar/></span>{eventDate}</p>
            <p className={eDetailsStyle}><span><GoLocation/></span>{eventLocation}</p>
            <p className={eDetailsStyle}><span><GoPeople/></span>{eventAttendees}</p>

            <div className='flex flex-row gap-3 mt-3'>
                <button className='font-outfit px-4 py-2 bg-secondary text-white font-semibold cursor-pointer'>Edit</button>
                <button className='font-outfit text-secondary px-4 py-2 border-1 border-secondary font-semibold cursor-pointer'>Delete</button>
            </div>
        </div>
    )
}

export default OrganizerEventCard
