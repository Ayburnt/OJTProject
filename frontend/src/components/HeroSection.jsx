import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Install react-icons if you haven't: npm install react-icons

function HeroSection() {
  useEffect(() => {
    document.title = "Sari-Sari Events";
  },[])
  const images = [
    {
      src: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/ladies-night-party-landscape-poster-flyer-design-template-cc9e9c66c4e308161db9c7dcaa27bffe_screen.jpg?ts=1601365829",
      alt: "Hero Banner 1 - Discover Events",
      heading: "DISCOVER NEW EVENTS",
      subheading: "Find your next unforgettable experience",
      buttonText: "Explore Events",
    },
    {
      src: "https://i.pinimg.com/736x/dc/72/63/dc7263d4dae4bb28fb5a71ff4ad9891e.jpg",
      alt: "Hero Banner 2 - Become an Organizer",
      heading: "BECOME AN ORGANIZER WITH US",
      subheading: "Seamlessly manage and promote your events",
      buttonText: "Start Organizing Today",
    },
    {
      src: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/nightclub-dance-party-landscape-flyer-template-f69a412a8dd4e6f0bb393b01e1327395_screen.jpg?ts=1561377260",
      alt: "Hero Banner 3 - Featured Concert",
      heading: "LIVE MUSIC EXPERIENCE",
      subheading: "Grab your tickets now for the hottest shows!",
      buttonText: "See Concerts",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next slide
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to go to the previous slide
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds (5000ms)

    // Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, [currentIndex]); // Re-run effect if currentIndex changes to reset timer

  const currentImage = images[currentIndex];

  return (
    <div className='flex items-center justify-center pt-10'>
      <section className="relative w-[85%] h-[400px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl mb-16">
        {/* Background Image */}
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="absolute inset-0 w-full h-full object-cover z-0"
          key={currentImage.src}
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>


        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-5 drop-shadow-lg animate-fade-in-up">
            {currentImage.heading.split(' ').map((word, index) => (
              <span key={index} className={word === 'EVENTS' ? 'text-orange-300' : ''}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-medium mb-10 drop-shadow animate-fade-in-up delay-200">
            {currentImage.subheading}
          </p>
          <button className="cursor-pointer bg-orange-500 text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-orange-500 hover:border-orange-700 animate-fade-in-up delay-400">
            {currentImage.buttonText}
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none z-20"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={goToNext}
          className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none z-20"
          aria-label="Next slide"
        >
          <FaChevronRight className="text-2xl" />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-gray-400 bg-opacity-75'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HeroSection;