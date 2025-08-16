import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import EventCard from './EventCard'; // Assuming you have an EventCard component
import api from '../events.js';;

function RecommendedEvents() {
  const [ events, setEvents ] = useState([]);

  useEffect(() => {
    const fetchAllEvents = async() => {
      try{
        const res = await api.get(`/event-public-view/`);
        setEvents(res.data);
        console.log(res.data);
      }catch(err){
        console.error(err);
      }
    }

    fetchAllEvents();
  },[])
  // const events = [
  //   { id: 1, title: 'Skechers Friendship', date: 'July 30, 2025', location: 'Open Air Arena', organizer: 'Meow Meow', imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/jomrun-images-new/cover_images/cover_image_opiCp9U70j4YpeT.jpg' },
  //   { id: 2, title: 'Art & Design Expo', date: 'Aug 5, 2025', location: 'Convention Center', organizer: 'Meow Meow', imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.zUnrJFICaLByoN5etfMydwHaJ2?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  //   { id: 3, title: 'Tech Innovators Summit', date: 'Aug 10, 2025', location: 'Digital Hub', organizer: 'Meow Meow', imageUrl: 'https://s3.amazonaws.com/industryevents/events/logo/1221642/original/1636444487296.jpg?1637655250' },
  //   { id: 4, title: 'Food & Wine Festival', date: 'Aug 15, 2025', location: 'City Park', organizer: 'Meow Meow', imageUrl: 'https://www.doingdisneydaily.com/wp-content/uploads/2023/04/2024-Epcot-Food-and-Wine-Festival-Ultimate-Guide-Walt-Disney-World-Tips-683x1024.png' },
  //   { id: 5, title: 'Stand-up Comedy Night', date: 'Aug 20, 2025', location: 'The Laugh Club', organizer: 'Meow Meow', imageUrl: 'https://via.placeholder.com/400x250/A1C4FD/FFFFFF?text=Comedy' },
  //   { id: 6, title: 'Local Crafts Market', date: 'Aug 25, 2025', location: 'Community Square', organizer: 'Meow Meow', imageUrl: 'https://via.placeholder.com/400x250/C1E1D9/FFFFFF?text=Market' },
  //   { id: 7, title: 'Charity Fun Run', date: 'Aug 28, 2025', location: 'Lakeside Path', organizer: 'Meow Meow', imageUrl: 'https://via.placeholder.com/400x250/FFD9C0/6B4F4F?text=Run' },
  //   { id: 8, title: 'Classic Car Show', date: 'Sep 2, 2025', location: 'Exhibition Grounds', organizer: 'Meow Meow', imageUrl: 'https://via.placeholder.com/400x250/ADD8E6/FFFFFF?text=Cars' },
  // ];

  return (
    <section className="py-16 md:py-20 bg-white shadow-inner-lg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-teal-800 mb-4 tracking-tight">
            WHAT'S HAPPENING NOW?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover the hottest and most popular events happening around you. Don't miss out on the action!
          </p>
        </div>
 {/* Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 md:gap-9">
          {events.map((event, i) => (
            <Link key={i} to={`/events/${event.event_code}`} className="block">
              <EventCard eventPoster={`http://127.0.0.1:8000${event.event_poster}`} eventTitle={event.title}
                eventDate={`${event.start_date === event.end_date ? event.start_date : event.start_date, `-`, event.end_date}`}
                eventLocation={event.venue_place} eventCreator={`${event.created_by.first_name} ${event.created_by.last_name}`}
              />
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          {/* Corrected "View All Events" button to a Link component */}
          <Link
            to="/Events" // This is the path to your ViewAllEventsPage
            className="inline-block bg-teal-600 text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-teal-700 transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-teal-600 hover:border-teal-800"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}

export default RecommendedEvents;