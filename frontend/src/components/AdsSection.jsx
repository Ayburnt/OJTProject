import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // For navigation

function AdsSection() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sari-Sari Events";
  }, [])

  const images = [
    {
        id: 1,
      src: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/ladies-night-party-landscape-poster-flyer-design-template-cc9e9c66c4e308161db9c7dcaa27bffe_screen.jpg?ts=1601365829",
      alt: "Hero Banner 1 - Discover Events",
      heading: "STREAMLINE YOUR EVENTS WITH",
      subheading: "EVENT SARI-SARI",
      buttonText: "CLICK HERE",
      action: "explore"
    },
    {
        id: 2,
      src: "https://i.pinimg.com/736x/dc/72/63/dc7263d4dae4bb28fb5a71ff4ad9891e.jpg",
      alt: "Hero Banner 2 - Become an Organizer",
      heading: "making it easier to plan, manage, and execute for my events, big or small.",
      subheading: "EVENT SARI-SARI —",
      buttonText: "START NOW !",
      action: "login"
    },
    {
        id: 3,
      src: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/nightclub-dance-party-landscape-flyer-template-f69a412a8dd4e6f0bb393b01e1327395_screen.jpg?ts=1561377260",
      alt: "Hero Banner 3 - Featured Concert",
      heading: "Smart planning, smooth managing, perfect execution for events with",
      subheading: "EVENT SARI-SARI",
      buttonText: "CREATE EVENT NOW !",
      action: "concerts"
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const currentImage = images[currentIndex];

  // Button click handler
  const handleButtonClick = (action) => {
    if (action === "explore") {
      const section = document.getElementById("recommended-events");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else if (action === "login") {
      navigate("/"); // adjust your route if login page is different
    } else if (action === "concerts") {
      navigate("/"); // you can change this path
    }
  };

  return (
    <div className='flex items-center justify-center w-full'>
      <section className="relative bg-secondary w-[90%] w-full overflow-hidden shadow-sm">
        {/* Background Image */}
        {/* <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="absolute inset-0 w-full h-full object-cover z-0"
          key={currentImage.src}
        />

        <div className="absolute inset-0 bg-black/60 z-10"></div> */}

        {/* Content */}
        <div className="z-10 py-3 w-full flex items-center justify-center text-center text-white">          
          {currentImage.id === 2 ? (
            <h3 className='text-base font-bold'>{currentImage.subheading} <span className='font-outfit text-xs md:text-sm w-[70%] text-center font-normal'>{currentImage.heading}</span> <button className='ml-3 cursor-pointer px-3 py-1 text-sm bg-white text-black rounded font-normal shadow-md/80' onClick={() => handleButtonClick('concerts')}>{currentImage.buttonText}</button></h3>
          ) : (
            <h3 className='font-outfit text-xs md:text-sm w-[70%] text-center'>{currentImage.heading} <span className='text-base font-bold'>{currentImage.subheading}</span> <button className='ml-3 cursor-pointer px-3 py-1 text-sm bg-white text-black rounded shadow-md/80' onClick={() => handleButtonClick('concerts')}>{currentImage.buttonText}</button></h3>            
          )}      
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="cursor-pointer absolute left-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none z-20"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="text-sm" />
        </button>
        <button
          onClick={goToNext}
          className="cursor-pointer absolute right-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none z-20"
          aria-label="Next slide"
        >
          <FaChevronRight className="text-sm" />
        </button>

        {/* Navigation Dots */}
        {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-gray-400 bg-opacity-75'}`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div> */}
      </section>
    </div>
  );
}

export default AdsSection;