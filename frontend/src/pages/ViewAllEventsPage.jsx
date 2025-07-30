// src/pages/ViewAllEventsPage.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { Link } from 'react-router-dom';

function ViewAllEventsPage() {
  // --- Scroll to top on component mount ---
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top-left corner of the window
  }, []); // Empty dependency array ensures this runs only once after initial render

  // --- Dummy Data for All Events ---
  const allEvents = [
    {
      id: 1,
      title: 'Skechers Friendship Walk 2025',
      date: '23 August 2025',
      location: 'Đường Trần Bạch Đằng - Thủ Thiêm',
      imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/jomrun-images-new/cover_images/cover_image_opiCp9U70j4YpeT.jpg',
      shortDescription: 'Join the annual Skechers Friendship Walk to promote an active lifestyle and connect communities.',
      category: 'Sports'
    },
    {
      id: 2,
      title: 'Art & Design Expo 2025',
      date: 'Aug 5, 2025',
      location: 'SMX Convention Center, Pasay City',
      imageUrl: 'https://via.placeholder.com/600x400/93D3A2/FFFFFF?text=Art+Design+Expo',
      shortDescription: 'Explore cutting-edge art installations, innovative design concepts, and interact with renowned artists.',
      category: 'Entertainment'
    },
    {
      id: 3,
      title: 'The WHOLSESOME Hobbies Club: Booktroverts',
      date: '18 January 2025',
      location: 'theCOMMONS Thonglor',
      imageUrl: 'https://via.placeholder.com/600x400/F0D9B1/000000?text=Booktroverts+Club',
      shortDescription: 'A series hosted by Read Me Again x theCOMMONS for book lovers and introverts.',
      category: 'Lifestyle'
    },
    {
      id: 4,
      title: 'Summer Music Festival',
      date: 'July 20, 2025',
      location: 'Open Air Grounds, Taguig',
      imageUrl: 'https://via.placeholder.com/600x400/FFDDC1/000000?text=Music+Festival',
      shortDescription: 'An electrifying music festival featuring local and international artists. Get ready to dance!',
      category: 'Entertainment'
    },
    {
      id: 5,
      title: 'Manila Food & Wine Fair',
      date: 'Sept 15-17, 2025',
      location: 'World Trade Center, Pasay',
      imageUrl: 'https://via.placeholder.com/600x400/D0F0C0/000000?text=Food+Wine+Fair',
      shortDescription: 'A culinary journey showcasing the best of local and international cuisines and wines.',
      category: 'Lifestyle'
    },
    {
      id: 6,
      title: 'Tech Innovations Summit',
      date: 'Oct 10-12, 2025',
      location: 'SMX Convention Center, Pasay City',
      imageUrl: 'https://via.placeholder.com/600x400/A7DBD8/000000?text=Tech+Summit',
      shortDescription: 'Discover the future of technology with leading experts and groundbreaking innovations.',
      category: 'Business'
    },
    {
      id: 7,
      title: 'Local Artisan Market',
      date: 'Nov 1, 2025',
      location: 'Makati Greenbelt',
      imageUrl: 'https://via.placeholder.com/600x400/FFC0CB/000000?text=Artisan+Market',
      shortDescription: 'Support local craftsmen and discover unique handmade goods.',
      category: 'Lifestyle'
    },
    {
      id: 8,
      title: 'Philippine Historical Tour',
      date: 'Dec 1-5, 2025',
      location: 'Intramuros, Manila',
      imageUrl: 'https://via.placeholder.com/600x400/ADD8E6/000000?text=Historical+Tour',
      shortDescription: 'Journey through time and explore the rich history of the Philippines.',
      category: 'Entertainment'
    },
    {
      id: 9,
      title: 'National Book Fair',
      date: 'Sept 20-24, 2025',
      location: 'SM Megamall, Mandaluyong',
      imageUrl: 'https://via.placeholder.com/600x400/D3D3D3/000000?text=Book+Fair',
      shortDescription: 'A grand exhibition of books, authors, and literary events.',
      category: 'Entertainment'
    },
    {
      id: 10,
      title: 'Gaming Convention PH',
      date: 'Nov 15-16, 2025',
      location: 'World Trade Center, Pasay',
      imageUrl: 'https://via.placeholder.com/600x400/C0C0C0/000000?text=Gaming+Con',
      shortDescription: 'Immerse yourself in the world of video games, esports, and cosplay.',
      category: 'Entertainment'
    },
    {
      id: 11,
      title: 'Sustainable Living Expo',
      date: 'Oct 5-7, 2025',
      location: 'Quezon City Circle',
      imageUrl: 'https://via.placeholder.com/600x400/B0E0E6/000000?text=Eco+Expo',
      shortDescription: 'Learn about eco-friendly practices and sustainable products for a greener lifestyle.',
      category: 'Lifestyle'
    },
    {
      id: 12,
      title: 'International Film Festival',
      date: 'Jan 20-26, 2026',
      location: 'Cinemas Nationwide',
      imageUrl: 'https://via.placeholder.com/600x400/87CEFA/000000?text=Film+Fest',
      shortDescription: 'Showcasing the best of global cinema, independent films, and documentaries.',
      category: 'Entertainment'
    },
    {
      id: 13,
      title: 'Fitness & Wellness Summit',
      date: 'Feb 10-12, 2026',
      location: 'MOA Arena, Pasay',
      imageUrl: 'https://via.placeholder.com/600x400/A0DCF0/000000?text=Fitness+Summit',
      shortDescription: 'Expert talks, workshops, and demonstrations on health, fitness, and mental well-being.',
      category: 'Sports'
    },
    {
      id: 14,
      title: 'Fashion Week Manila',
      date: 'Mar 1-5, 2026',
      location: 'The Peninsula Manila',
      imageUrl: 'https://via.placeholder.com/600x400/FFB6C1/000000?text=Fashion+Week',
      shortDescription: 'Witness the latest trends from top designers and emerging talents.',
      category: 'Lifestyle'
    },
    {
      id: 15,
      title: 'Pet Lovers Fair',
      date: 'April 20, 2026',
      location: 'Tiendesitas, Pasig',
      imageUrl: 'https://via.placeholder.com/600x400/98FB98/000000?text=Pet+Fair',
      shortDescription: 'A fun-filled day for pet owners and animal enthusiasts with various activities.',
      category: 'Lifestyle'
    },
  ];

  const initialEventsToShow = 8;
  const eventsIncrement = 4;

  const [eventsToShow, setEventsToShow] = useState(initialEventsToShow);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = activeCategory === 'All'
    ? allEvents
    : allEvents.filter(event => event.category === activeCategory);

  useEffect(() => {
    setEventsToShow(initialEventsToShow);
  }, [activeCategory]);


  const handleSeeMore = () => {
    setEventsToShow(prevCount => Math.min(prevCount + eventsIncrement, filteredEvents.length));
  };

  const displayedEvents = filteredEvents.slice(0, eventsToShow);
  const hasMore = eventsToShow < filteredEvents.length;

  const categories = ['All', 'Entertainment', 'Business', 'Sports', 'Lifestyle'];

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-10">All Events</h1>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-200
                ${activeCategory === category
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`
              }
            >
              {category}
            </button>
          ))}
        </div>

        {/* Event Grid */}
        {filteredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayedEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform transition-transform hover:scale-105 duration-300">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                      {event.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-medium">Date:</span> {event.date}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      <span className="font-medium">Location:</span> {event.location}
                    </p>
                    <p className="text-gray-700 text-base mb-4 flex-grow">
                      {event.shortDescription}
                    </p>
                    <Link
                      to={`/events/${event.id}`}
                      className="mt-auto bg-teal-600 text-white px-5 py-2 rounded-full text-center font-medium hover:bg-teal-700 transition-colors self-start"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* "See More" button - only rendered if there are more events to show */}
            {hasMore && (
              <div className="text-center mt-16">
                <button
                  onClick={handleSeeMore}
                  className="bg-teal-600 text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-teal-700 transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-teal-600 hover:border-teal-800"
                >
                  See More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600 text-lg">No events available in this category. Please try another!</p>
        )}
      </div>
    </div>
  );
}

export default ViewAllEventsPage;