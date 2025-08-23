import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
const SariSariLogo = "/sariLogo.png";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../api.js";

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
  const [eventResults, setEventResults] = useState([]);
  const [organizerResults, setOrganizerResults] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
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
        let events = [];
        if (Array.isArray(res.data)) {
          events = res.data;
        } else if (res.data?.results && Array.isArray(res.data.results)) {
          events = res.data.results;
        }
        setAllEvents(events);
      } catch (err) {
        console.error("API Fetch Error (events):", err);
        setAllEvents([]);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Fetch organizers when searching
  useEffect(() => {
    const fetchOrganizers = async () => {
      if (!searchTerm.trim()) {
        setOrganizerResults([]);
        return;
      }
      try {
        const res = await api.get(`/organizers/`, {
          params: { search: searchTerm },
        });
        setOrganizerResults(res.data || []);
      } catch (err) {
        console.error("API Fetch Error (organizers):", err);
        setOrganizerResults([]);
      }
    };

    fetchOrganizers();
  }, [searchTerm]);

  // ✅ Filter events locally
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setEventResults([]);
      return;
    }

    const filtered = (allEvents || []).filter(
      (event) =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue_place?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setEventResults(filtered);
    setShowResults(true);
  }, [searchTerm, allEvents]);

  // ✅ Truncate helper
  const truncate = (text, length = 40) =>
    !text ? "" : text.length > length ? text.slice(0, length) + "..." : text;

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
          <CiSearch className="text-gray-500 text-xl mr-2" />
          <input
            type="text"
            placeholder="Search events or organizers..."
            className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowResults(true)}
          />

          {/* Results Dropdown */}
          {showResults &&
            (eventResults.length > 0 || organizerResults.length > 0) && (
              <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-50">
                {/* Events */}
                {eventResults.length > 0 && (
                  <>
                    <p className="px-4 pt-2 text-xs font-semibold text-gray-500">
                      Events
                    </p>
                    {eventResults.map((event, i) => (
                      <Link
                        key={`event-${i}`}
                        to={`/events/${event.event_code}`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
                        onClick={() => {
                          setSearchTerm("");
                          setShowResults(false);
                        }}
                      >
                        <img
                          src={event.event_poster || "/placeholder.png"}
                          alt={event.title}
                          className="w-12 h-12 rounded-md object-cover"
                        />
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
                            {truncate(event.venue_place, 50) || "Online Event"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </>
                )}

                {/* Organizers */}
                {organizerResults.length > 0 && (
                  <>
                    <p className="px-4 pt-2 text-xs font-semibold text-gray-500">
                      Organizers
                    </p>
                    {organizerResults.map((org, i) => (
                      <Link
                        key={`org-${i}`}
                        to={`/org/${org.user_code}`} // ✅ FIXED to match your TimeLine route
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
                        onClick={() => {
                          setSearchTerm("");
                          setShowResults(false);
                        }}
                      >
                        <img
                          src={org.profile_picture || "/placeholder.png"}
                          alt={org.first_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 flex items-center gap-1">
                            {org.first_name} {org.last_name}
                            {org.verification_status === "verified" && (
                              <FaCheckCircle className="text-green-500 text-sm" />
                            )}
                          </span>
                          {org.company_name && (
                            <span className="text-xs text-gray-500">
                              {org.company_name}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {org.email}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}

          {/* No results */}
          {showResults &&
            searchTerm &&
            eventResults.length === 0 &&
            organizerResults.length === 0 && (
              <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg p-4 text-gray-500">
                No results found
              </div>
            )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link
            to="/find-my-ticket"
            className={`${
              isLoggedIn && userRole === "client" ? "hidden" : "block"
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
                  onClick={() => setIsAccDD(!isAccDD)}
                />
              )}
              <div
                className={`${
                  isAccDD ? "grid" : "hidden"
                } shadow-lg text-sm bg-white absolute right-5 top-full origin-top-right grid-cols-1 place-items-center overflow-hidden border border-gray-300 rounded-b-lg w-full max-w-[15%]`}
              >
                <p className="font-outfit flex items-center justify-center gap-2 border-b border-gray-300 w-full text-center bg-secondary text-white text-base py-2">
                  {userFirstName} {userLastName}
                  {userProfile?.verification_status === "verified" && (
                    <FaCheckCircle className="text-green-400" />
                  )}
                </p>
                <button
                  onClick={() => navigate(`/org/${userCode}/dashboard`)}
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

                {/* Mobile Menu Icon */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 focus:outline-none p-2"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* ✅ Missing Mobile Menu */}
{isMobileMenuOpen && (
<div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-full z-20 bg-white border border-gray-300 w-full rounded-md flex shadow-md">
  <nav className="flex flex-col items-center text-center space-y-2 p-4 w-full">
      <Link
        to="/find-my-ticket"
        className="text-gray-700 hover:text-teal-600 transition-colors text-base font-medium"
      >
        Find my Tickets
      </Link>
      <button
        onClick={handleCreateEvent}
        className="text-left text-gray-700 hover:text-teal-600 transition-colors text-base font-medium"
      >
        Create Event
      </button>
      {isLoggedIn ? (
        <>
          <button
            onClick={() => navigate(`/org/${userCode}/dashboard`)}
            className="text-left text-gray-700 hover:text-teal-600 transition-colors text-base font-medium"
          >
            Dashboard
          </button>
          <button
            onClick={logout}
            className="text-left text-gray-700 hover:text-teal-600 transition-colors text-base font-medium"
          >
            Log out
          </button>
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
)}
    </header>

  );
}

export default Header;
