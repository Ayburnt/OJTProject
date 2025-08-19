import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
const SariSariLogo = "/sariLogo.png";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../events.js";

function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    isLoggedIn,
    userRole,
    userLastName,
    userFirstName,
    userProfile,
    logout,
    userCode,
  } = useAuth();

  const [isAccDD, setIsAccDD] = useState(false);

  // ✅ Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allEvents, setAllEvents] = useState([]); // store all events
  const [showResults, setShowResults] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCreateEvent = () => {
    if (isLoggedIn && userRole === "organizer") {
      navigate(`/org/${userCode}/create-event`);
    } else if (!isLoggedIn) {
      navigate("/login");
    }
  };

  // ✅ Fetch all events once
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/event-public-view/`);
        setAllEvents(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Filter events as user types
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = allEvents.filter(
      (event) =>
        event.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (event.venue_place &&
          event.venue_place
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );

    setSearchResults(filtered);
    setShowResults(true);
  }, [searchTerm, allEvents]);

  // ✅ Helper: Truncate text
  const truncate = (text, length = 40) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center space-x-2"
          onClick={() => navigate("/")}
        >
          <img
            src={SariSariLogo}
            alt="SariSari Logo"
            className="h-10 md:h-12 object-contain rounded-md cursor-pointer"
          />
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-md mx-4 md:mx-8">
          <CiSearch className="text-gray-500 text-secondary text-xl mr-2" />
          <input
            type="text"
            placeholder="Search for events..."
            className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowResults(true)}
          />

          {/* Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-50">
              {searchResults.map((event, i) => (
                <Link
                  key={i}
                  to={`/events/${event.event_code}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
                  onClick={() => {
                    setSearchTerm("");
                    setShowResults(false);
                  }}
                >
                  {/* Event Image */}
                  <img
                    src={event.event_poster || "/placeholder.png"}
                    alt={event.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />

                  {/* Event Info */}
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 truncate max-w-[180px]">
                      {truncate(event.title, 40)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {event.start_date === event.end_date
                        ? event.start_date
                        : `${event.start_date} - ${event.end_date}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {truncate(event.venue_place, 50) ||
                        "Online Event"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No results */}
          {showResults && searchTerm && searchResults.length === 0 && (
            <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg p-4 text-gray-500">
              No events found
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link
            to="/find-my-ticket"
            className={`${
              isLoggedIn && userRole === "client"
                ? "hidden"
                : "block"
            } text-gray-700 hover:text-teal-600 transition-colors text-base font-medium`}
          >
            Find my Tickets
          </Link>
          <button
            onClick={handleCreateEvent}
            className={`${
              isLoggedIn && userRole === "guest" ? "hidden" : "block"
            } cursor-pointer text-gray-700 hover:text-teal-600 transition-colors text-base font-medium`}
          >
            Create Event
          </button>
          {isLoggedIn ? (
            <>
              {userProfile && (
                <img
                  src={userProfile}
                  alt="User Profile"
                  className="h-8 w-8 rounded-full object-cover cursor-pointer"
                  onClick={() => {
                    setIsAccDD(!isAccDD);
                  }}
                />
              )}

              {/* Dropdown */}
              <div
                className={`${
                  isAccDD ? "grid" : "hidden"
                } shadow-lg text-sm bg-white absolute right-5 top-full origin-top-right grid-cols-1 place-items-center overflow-hidden border border-gray-300 rounded-b-lg w-full max-w-[15%]`}
              >
                <p className="font-outfit block border-b border-gray-300 w-full text-center bg-secondary text-white text-gray-700 transition-colors text-base py-2">
                  {userFirstName} {userLastName}
                </p>
                <button
                  onClick={() =>
                    navigate(`/org/${userCode}/dashboard`)
                  }
                  className="border-b border-gray-300 w-full font-outfit block text-gray-700 hover:text-teal-600 transition-colors text-base py-1 cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  className="font-outfit block text-gray-700 hover:text-teal-600 transition-colors text-base py-1 cursor-pointer"
                  onClick={logout}
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="text-gray-700 hover:text-teal-600 transition-colors text-base font-medium"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
