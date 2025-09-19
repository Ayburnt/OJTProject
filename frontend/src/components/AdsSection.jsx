import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // For navigation

function AdsSection() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sari-Sari Events";
  }, []);

  const images = [
    {
      id: 1,
      heading: "STREAMLINE YOUR EVENTS WITH",
      subheading: "EVENT SARI-SARI",
      buttonText: "CLICK HERE",
      action: "explore",
    },
    {
      id: 2,
      heading: "making it easier to plan, manage, and execute for my events, big or small.",
      subheading: "EVENT SARI-SARI —",
      buttonText: "START NOW !",
      action: "login",
    },
    {
      id: 3,
      heading: "Smart planning, smooth managing, perfect execution for events with",
      subheading: "EVENT SARI-SARI",
      buttonText: "CREATE EVENT NOW !",
      action: "concerts",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Navigation
  const goToNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setFade(true);
    }, 300);
  };

  const goToPrevious = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setFade(true);
    }, 300);
  };

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(goToNext, 2000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const currentImage = images[currentIndex];

  // Button click handler
  const handleButtonClick = (action) => {
    if (action === "explore") {
      const section = document.getElementById("recommended-events");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/"); // adjust if needed
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <section className="relative bg-secondary w-[90%] w-full overflow-hidden shadow-sm">
        {/* Content with fade */}
        <div
          className={`z-10 py-3 w-full flex items-center justify-center text-center text-white transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentImage.id === 2 ? (
            <h3 className="text-base font-bold leading-none w-[75%]">
              {currentImage.subheading}{" "}
              <span className="font-outfit text-xs md:text-sm w-[70%] text-center font-normal">
                {currentImage.heading}
              </span>{" "}
              <button
                className="ml-3 cursor-pointer px-3 py-1 text-sm bg-white text-black rounded font-normal shadow-md/80"
                onClick={() => handleButtonClick("concerts")}
              >
                {currentImage.buttonText}
              </button>
            </h3>
          ) : (
            <h3 className="font-outfit text-xs md:text-sm leading-none w-[75%] text-center">
              {currentImage.heading}{" "}
              <span className="text-base font-bold">
                {currentImage.subheading}
              </span>{" "}
              <button
                className="ml-3 cursor-pointer px-3 py-1 text-sm bg-white text-black rounded shadow-md/80"
                onClick={() => handleButtonClick("concerts")}
              >
                {currentImage.buttonText}
              </button>
            </h3>
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
      </section>
    </div>
  );
}

export default AdsSection;
